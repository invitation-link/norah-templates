// Razorpay Payment Integration for InviteKaro
import crypto from 'crypto'

// Razorpay configuration - uses environment variables
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || ''
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ''

// Public key for frontend
export const RAZORPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''

// Premium pricing tiers
export const PRICING = {
    PREMIUM_SINGLE: {
        id: 'premium_single',
        name: 'Premium Invite',
        amount: 199, // in INR
        currency: 'INR',
        features: [
            'Remove InviteKaro branding',
            'Priority support',
            'Analytics dashboard',
        ],
    },
    PREMIUM_PACK: {
        id: 'premium_pack',
        name: 'Premium Pack (5 Invites)',
        amount: 799,
        currency: 'INR',
        features: [
            'All Premium features',
            '5 invitations included',
            'Valid for 1 year',
        ],
    },
    BUSINESS: {
        id: 'business',
        name: 'Business Plan',
        amount: 999,
        currency: 'INR',
        period: 'month',
        features: [
            'Unlimited invitations',
            'Custom domain support',
            'API access',
            'White-label option',
        ],
    },
} as const

export type PricingTier = keyof typeof PRICING

/**
 * Create Razorpay order options
 */
export function createOrderOptions(
    tier: PricingTier,
    userId: string,
    invitationId?: string
) {
    const pricing = PRICING[tier]

    return {
        amount: pricing.amount * 100, // Razorpay expects amount in paise
        currency: pricing.currency,
        receipt: `inv_${Date.now()}_${userId.slice(0, 8)}`,
        notes: {
            tier: tier,
            user_id: userId,
            invitation_id: invitationId || '',
            product_name: pricing.name,
        },
    }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    if (!RAZORPAY_KEY_SECRET) {
        console.error('Razorpay key secret not configured')
        return false
    }

    const body = orderId + '|' + paymentId

    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex')

    return expectedSignature === signature
}

/**
 * Get Razorpay checkout options for frontend
 */
export function getCheckoutOptions(
    orderId: string,
    tier: PricingTier,
    userPhone?: string,
    userEmail?: string
) {
    const pricing = PRICING[tier]

    return {
        key: RAZORPAY_PUBLIC_KEY,
        amount: pricing.amount * 100,
        currency: pricing.currency,
        name: 'InviteKaro',
        description: pricing.name,
        order_id: orderId,
        prefill: {
            contact: userPhone || '',
            email: userEmail || '',
        },
        theme: {
            color: '#ec4899', // Pink to match brand
        },
        modal: {
            ondismiss: () => {
                console.log('Payment modal closed')
            },
        },
    }
}
