export const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            reject(false);
            return;
        }

        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => resolve(true);
        script.onerror = () => reject(false);

        document.body.appendChild(script);
    });
};
