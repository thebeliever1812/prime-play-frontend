declare module "*.css";

export {};

declare global {
    interface Window {
        Razorpay?: RazorpayConstructor;
    }

    interface RazorpayConstructor {
        new (options: RazorpayOptions): RazorpayInstance;
    }

    interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description?: string;
        order_id: string;
        handler: (response: RazorpayResponse) => void;
        modal?: {
            ondismiss?: () => void;
        };
        theme?: {
            color?: string;
        };
    }

    interface RazorpayInstance {
        open: () => void;
    }

    interface RazorpayResponse {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }
}
