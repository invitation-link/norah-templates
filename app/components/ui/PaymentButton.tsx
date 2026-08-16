'use client'

import { useState } from 'react'
import { Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { PRICING } from '@/lib/product'
import { apiFetch } from '@/app/lib/api'
import { trackEvent } from '@/app/lib/analytics'

declare global { interface Window { Razorpay: any } }

type PaidPlan = 'ESSENTIAL' | 'PREMIUM'

export function PaymentButton({ planId, invitationId, onSuccess, className, children }: {
  planId: PaidPlan
  invitationId: string
  onSuccess?: () => void | Promise<void>
  className?: string
  children?: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const pricing = PRICING[planId]

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const pay = async () => {
    setLoading(true)
    try {
      if (!(await loadRazorpay())) throw new Error('Could not load Razorpay')
      const response = await apiFetch('/api/payments/orders', { method: 'POST', body: JSON.stringify({ invitationId, planId }) })
      const order = await response.json()
      if (!response.ok) throw new Error(order.error || 'Could not start checkout')
      const checkout = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Invite Link',
        description: `${pricing.name} invitation · one-time payment`,
        order_id: order.orderId,
        theme: { color: '#E6A719' },
        handler: async (result: any) => {
          try {
            const verified = await apiFetch('/api/payments/verify', { method: 'POST', body: JSON.stringify({ orderId: result.razorpay_order_id, paymentId: result.razorpay_payment_id, signature: result.razorpay_signature }) })
            const body = await verified.json()
            if (!verified.ok) throw new Error(body.error || 'Payment verification failed')
            if (!body.paid) { toast.success('Payment received and awaiting final confirmation.'); return }
            trackEvent('purchase', { transaction_id: result.razorpay_payment_id, value: pricing.amount, currency: 'INR', plan: planId })
            toast.success('Payment received. Publishing your invitation…')
            await onSuccess?.()
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not confirm payment')
          } finally {
            setLoading(false)
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      })
      checkout.on('payment.failed', () => { toast.error('Payment failed. Please try again.'); setLoading(false) })
      checkout.open()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not start checkout')
      setLoading(false)
    }
  }

  return <button type="button" onClick={pay} disabled={loading || !invitationId} className={className}>
    {loading ? <><Loader2 size={18} className="animate-spin" /> Preparing secure checkout…</> : children || <><Crown size={18} /> Pay ₹{pricing.amount}</>}
  </button>
}
