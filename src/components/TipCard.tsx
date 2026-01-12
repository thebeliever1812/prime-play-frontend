"use client"
import { useState, useEffect } from "react";
import { X, Heart, IndianRupee } from "lucide-react";
import { cn } from "@/utils/cn";
import { setDismissedForever, setLastShownAt } from "@/lib/features/donation/donation.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import axios from "axios";

const TIP_INTERVAL = 30 * 60 * 1000; // 30 minutes

const presetAmounts = [
    { amount: 10, label: "Coffee ☕" },
    { amount: 50, label: "Lunch 🍕", popular: true },
    { amount: 100, label: "Hero 🦸" },
];

const TipCard = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [showCustomAmountDiv, setShowCustomAmountDiv] = useState<boolean>(false);
    const [customAmount, setCustomAmount] = useState<number>(1);
    const [isPaying, setIsPaying] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const dismissedForever = useAppSelector((state) => state.donation.dismissedForever)
    const lastShownAt = useAppSelector((state) => state.donation.lastShownAt)

    const isLoadingUser = useAppSelector((state) => state.user.loading);

    useEffect(() => {
        if (dismissedForever) return;

        if (isLoadingUser) return;

        const now = Date.now();

        const canShow =
            lastShownAt == null || now - lastShownAt >= TIP_INTERVAL;

        const showCard = () => {
            setIsVisible(true);
            dispatch(setLastShownAt(Date.now()));
        };

        // Show quickly if allowed; otherwise wait remaining time
        const delay = canShow
            ? 3000
            : Math.max(0, TIP_INTERVAL - (now - (lastShownAt ?? 0)));
        const timer = setTimeout(showCard, delay);
        return () => clearTimeout(timer);
    }, [dismissedForever, lastShownAt, dispatch, isLoadingUser]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    const handleDismissForever = () => {
        dispatch(setDismissedForever(true));
        setIsVisible(false);
    };

    const handleDonate = async (amount: number) => {
        if (!amount || amount < 1) {
            toast.error("Please enter a valid donation amount");
            return;
        }
        try {
            setIsPaying(true);
            const loaded = await loadRazorpay();

            if (!loaded) {
                toast.error("Razorpay failed to load. Check your connection.");
                setIsPaying(false);
                return;
            }

            if (!window.Razorpay) {
                toast.error("Razorpay is not available");
                setIsPaying(false);
                return;
            }

            const { data } = await api.post("/tip/create-order", { amount });
            const order = data.data; // ApiResponse wraps it

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: "INR",
                name: "Prime Play",
                description: "Support Prime Play by tipping for content",
                order_id: order.id,
                handler: async (response) => {
                    try {
                        // 4️⃣ Verify payment on backend
                        await api.post("/tip/verify", response);

                        // 5️⃣ Show success toast
                        toast.success("Thank you for supporting Prime Play ❤️", {
                            style: {
                                background: "#7c3aed",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "16px",
                                textAlign: "center",
                            },
                            icon: <span style={{ fontSize: "18px" }}>❤️</span>,
                        });

                        // 6️⃣ Dismiss donation card
                        handleDismissForever();
                    } catch (err) {
                        if (axios.isAxiosError(err)) {
                            toast.error("Payment verification failed: " + (err.response?.data?.message || err.message));
                        } else {
                            toast.error("An unexpected error occurred during payment verification.");
                        }
                    } finally {
                        setIsPaying(false)
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log("Payment was not completed. Popup closed.");
                        toast.info("Payment cancelled", { autoClose: 2000 });
                        setIsPaying(false);
                    },
                },
                theme: { color: "#7c3aed" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("Tipping failed: " + (error.response?.data?.message || error.message));
            } else {
                toast.error("An unexpected error occurred during tipping.");
            }
        } finally {
            setIsPaying(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed z-50 bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-80 sm:left-auto sm:translate-x-0 sm:right-6 sm:w-full animate-slide-in-right">
            <div className=" rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] shadow-2xl shadow-purple-500/30">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-5">
                    {/* Close Button */}
                    <button
                        disabled={isPaying}
                        onClick={handleDismiss}
                        className="absolute right-2 top-2 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
                        aria-label="Close donation card"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {
                        isPaying ? (
                            <>
                                <div className="flex flex-col items-center justify-center py-8">
                                    {/* Gift Box */}
                                    <div className="relative animate-pulse" style={{ animationDuration: '1.5s' }}>
                                        {/* Sparkles around gift */}
                                        <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDuration: '1s' }} />
                                        <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping" style={{ animationDuration: '1.2s', animationDelay: '0.3s' }} />
                                        <div className="absolute -bottom-1 -left-3 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDuration: '1.4s', animationDelay: '0.5s' }} />

                                        {/* Lid with bow */}
                                        <div className="relative z-10 animate-bounce" style={{ animationDuration: '2s' }}>
                                            {/* Bow loops */}
                                            <div className="flex justify-center mb-1">
                                                <div className="w-4 h-3 bg-yellow-400 rounded-full -mr-1 rotate-[-20deg]" />
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full z-10" />
                                                <div className="w-4 h-3 bg-yellow-400 rounded-full -ml-1 rotate-[20deg]" />
                                            </div>
                                            {/* Lid */}
                                            <div className="w-14 h-4 bg-gradient-to-b from-pink-400 to-pink-500 rounded-t-md shadow-md">
                                                <div className="absolute left-1/2 -translate-x-1/2 w-2 h-full bg-yellow-400" />
                                            </div>
                                        </div>

                                        {/* Box body */}
                                        <div className="relative w-12 h-10 mx-auto bg-gradient-to-b from-pink-500 to-pink-600 rounded-b-md shadow-lg">
                                            {/* Vertical ribbon */}
                                            <div className="absolute left-1/2 -translate-x-1/2 w-2 h-full bg-yellow-400" />
                                            {/* Horizontal ribbon */}
                                            <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-yellow-400" />
                                        </div>
                                    </div>

                                    <p className="mt-5 text-lg font-bold text-white tracking-wide">
                                        Supporting
                                        <span className="inline-flex ml-1">
                                            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                                            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                                            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                                        </span>
                                    </p>
                                </div>
                            </>) : (
                            <>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                        <Heart className="h-6 w-6 animate-pulse text-white" fill="currentColor" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Support Prime Play</h3>
                                            <p className="text-sm text-white/80">Tip us if you enjoy the content</p>
                                    </div>
                                </div>

                                {/* Preset Amounts */}
                                <div className="mb-4 flex gap-2">
                                    {presetAmounts.map(({ amount, label, popular }) => (
                                        <button
                                            disabled={showCustomAmountDiv || isPaying}
                                            key={amount}
                                            onClick={() => handleDonate(amount)}
                                            className={cn(
                                                "relative flex-1 rounded-xl px-3 py-3 font-semibold transition-all cursor-pointer",
                                                "bg-white/20 text-white hover:text-purple-600 hover:scale-105 hover:bg-white hover:disabled:scale-100 disabled:cursor-default disabled:opacity-50"
                                            )}
                                        >
                                            {popular && (
                                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-yellow-900">
                                                    POPULAR
                                                </span>
                                            )}
                                            <div>
                                                <div className="text-lg flex items-center"><IndianRupee className="w-4" />{amount}</div>
                                            </div>
                                            <div className="text-xs opacity-80">{label}</div>
                                        </button>
                                    ))}

                                </div>
                                {
                                    showCustomAmountDiv && (
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="Enter custom amount"
                                                className="w-full rounded-md  px-3 py-2 text-white bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 outline-none"
                                                min={1}
                                                value={customAmount}
                                                onChange={(e) => setCustomAmount(Number(e.target.value))}
                                            />

                                            <div
                                                className="mt-2 flex items-center justify-center gap-1 text-2xl text-white text-center font-semibold "
                                            >
                                                <IndianRupee className="w-5 font-semibold" />
                                                {customAmount}
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    showCustomAmountDiv && (
                                        <button
                                            onClick={() => handleDonate(customAmount)}
                                            className="mt-4 w-full rounded-xl bg-white text-purple-600 font-bold px-4 py-2 hover:bg-purple-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={customAmount < 1 || isPaying}
                                        >
                                            Support {customAmount ? `₹${customAmount}` : ""}
                                        </button>
                                    )
                                }

                                {/* Custom Amount Link */}
                                <button disabled={isPaying} className="my-2 w-full text-center text-sm text-white/70 underline-offset-2 transition-colors hover:text-white hover:underline cursor-pointer duration-150 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setShowCustomAmountDiv(prev => !prev)}>
                                        {showCustomAmountDiv ? "Hide Custom Amount" : "Support Custom Amount"}
                                </button>

                                {/* Don't show again */}
                                <button
                                    disabled={isPaying}
                                    onClick={handleDismissForever}
                                    className="w-full text-center text-xs text-white/70 transition-colors hover:text-white/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Don&apos;t show again
                                </button>
                            </>)
                    }
                </div>
            </div>
        </div>
    );
};

export default TipCard
