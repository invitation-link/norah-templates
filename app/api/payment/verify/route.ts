// Payment Verification API
import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            invitation_id,
            user_id,
            tier
        } = body

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing payment details' },
                { status: 400 }
            )
        }

        // Verify signature
        const isValid = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            )
        }

        // Update invitation to premium if invitation_id provided
        if (invitation_id) {
            // Use any cast to bypass strict type checking for schema mismatch
            await (supabase.from('invitations') as any)
                .update({ is_published: true })
                .eq('id', invitation_id)
        }

        // Log the payment in analytics
        if (invitation_id) {
            await (supabase.from('analytics') as any).insert({
                invitation_id,
                event_type: 'payment',
                metadata: {
                    order_id: razorpay_order_id,
                    payment_id: razorpay_payment_id,
                    tier,
                    user_id,
                }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            payment_id: razorpay_payment_id,
        })
    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json(
            { error: 'Payment verification failed' },
            { status: 500 }
        )
    }
}
