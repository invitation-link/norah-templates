'use client'

import { useState } from 'react'
import { Crown, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { PRICING, PricingTier, getCheckoutOptions } from '@/lib/razorpay'
import { useAuth } from '@/app/components/providers/AuthProvider'

declare global {
    interface Window {
        Razorpay: any
    }
}

interface PaymentButtonProps {
    tier?: PricingTier
    invitationId?: string
    onSuccess?: () => void
    className?: string
    children?: React.ReactNode
}

export function PaymentButton({
    tier = 'PREMIUM_SINGLE',
    invitationId,
    onSuccess,
    className,
    children
}: PaymentButtonProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const pricing = PRICING[tier]

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }

            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePayment = async () => {
        if (!user) {
            toast.error('Please login to continue')
            return
        }

        setLoading(true)

        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
            toast.error('Failed to load payment gateway')
            setLoading(false)
            return
        }

        try {
            // Create order
            const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier,
                    user_id: user.id,
                    invitation_id: invitationId,
                }),
            })

            const order = await response.json()

            if (!response.ok) {
                throw new Error(order.error)
            }

            // Get checkout options
            const options = {
                ...getCheckoutOptions(order.order_id, tier, user.phone || '', user.email || ''),
                handler: async (response: any) => {
                    // Verify payment
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            invitation_id: invitationId,
                            user_id: user.id,
                            tier,
                        }),
                    })

                    const result = await verifyRes.json()

                    if (verifyRes.ok) {
                        toast.success('🎉 Payment successful! Your invite is now premium.')
                        onSuccess?.()
                    } else {
                        toast.error(result.error || 'Payment verification failed')
                    }
                },
            }

            const razorpay = new window.Razorpay(options)
            razorpay.on('payment.failed', (response: any) => {
                toast.error('Payment failed. Please try again.')
                console.error('Payment failed:', response.error)
            })
            razorpay.open()
        } catch (error) {
            console.error('Payment error:', error)
            toast.error('Failed to initiate payment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={className || `
                inline-flex items-center gap-2 px-6 py-3 
                bg-gradient-to-r from-amber-500 to-orange-500 
                text-white font-bold rounded-full 
                hover:opacity-90 transition-all 
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl
            `}
        >
            {loading ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                </>
            ) : children ? (
                children
            ) : (
                <>
                    <Crown size={18} />
                    Go Premium ₹{pricing.amount}
                </>
            )}
        </button>
    )
}

// Pricing cards component
export function PricingCards({
    onSelect,
    selectedTier
}: {
    onSelect: (tier: PricingTier) => void
    selectedTier?: PricingTier
}) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            {(Object.entries(PRICING) as [PricingTier, typeof PRICING[PricingTier]][]).map(([key, plan]) => (
                <div
                    key={key}
                    onClick={() => onSelect(key)}
                    className={`
                        relative p-6 rounded-2xl border-2 cursor-pointer transition-all
                        ${selectedTier === key
                            ? 'border-pink-500 bg-pink-50/50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                    `}
                >
                    {key === 'PREMIUM_PACK' && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            BEST VALUE
                        </span>
                    )}

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>

                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-bold text-gray-900">₹{plan.amount}</span>
                        {'period' in plan && (
                            <span className="text-gray-500">/{plan.period}</span>
                        )}
                    </div>

                    <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check size={16} className="text-green-500 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {selectedTier === key && (
                        <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                <Check size={14} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
