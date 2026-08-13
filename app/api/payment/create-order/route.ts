// Payment Order Creation API
import { NextRequest, NextResponse } from 'next/server'
import { createOrderOptions, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, PricingTier } from '@/lib/razorpay'
import { createServerClient } from '@/lib/supabase'

// Dynamic import of Razorpay (optional dependency)
let RazorpayInstance: any = null

const getRazorpayInstance = async () => {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        return null
    }

    try {
        if (!RazorpayInstance) {
            // @ts-ignore - razorpay is an optional dependency
            const Razorpay = (await import('razorpay')).default
            RazorpayInstance = new Razorpay({
                key_id: RAZORPAY_KEY_ID,
                key_secret: RAZORPAY_KEY_SECRET,
            })
        }
        return RazorpayInstance
    } catch (error) {
        console.warn('Razorpay SDK not installed. Payment features disabled.')
        return null
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tier, user_id, invitation_id } = body as {
            tier: PricingTier
            user_id: string
            invitation_id?: string
        }

        // Validate input
        if (!tier || !user_id) {
            return NextResponse.json(
                { error: 'tier and user_id are required' },
                { status: 400 }
            )
        }

        // Get Razorpay instance
        const razorpay = await getRazorpayInstance()

        if (!razorpay) {
            return NextResponse.json(
                { error: 'Payment service not configured. Please install razorpay: npm install razorpay' },
                { status: 503 }
            )
        }

        // Create order options
        const options = createOrderOptions(tier, user_id, invitation_id)

        // Create Razorpay order
        const order = await razorpay.orders.create(options)

        // Store order in database for tracking
        const supabase = createServerClient()

        // You could create a 'payments' table to track orders
        // For now, we'll just return the order

        return NextResponse.json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        })
    } catch (error) {
        console.error('Create order error:', error)
        return NextResponse.json(
            { error: 'Failed to create payment order' },
            { status: 500 }
        )
    }
}
