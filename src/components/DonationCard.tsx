"use client"
import { useState, useEffect } from "react";
import { X, Heart, IndianRupee } from "lucide-react";
import { cn } from "@/utils/cn";
import { setDismissedForever, setLastShownAt } from "@/lib/features/donation/donation.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

const DONATION_INTERVAL = 30 * 60 * 1000; // 30 minutes

const presetAmounts = [
    { amount: 10, label: "Coffee ☕" },
    { amount: 50, label: "Lunch 🍕", popular: true },
    { amount: 100, label: "Hero 🦸" },
];

const DonationCard = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showCustomAmountDiv, setShowCustomAmountDiv] = useState<boolean>(false);
    const [customAmount, setCustomAmount] = useState<number>(1);

    const dispatch = useAppDispatch();

    const dismissedForever = useAppSelector((state) => state.donation.dismissedForever)
    const lastShownAt = useAppSelector((state) => state.donation.lastShownAt)

    useEffect(() => {
        if (dismissedForever) return;

        const now = Date.now();

        const canShow =
            lastShownAt == null || now - lastShownAt >= DONATION_INTERVAL;
        
        const showCard = () => {
            setIsVisible(true);
            dispatch(setLastShownAt(Date.now()));
        };

        // Show quickly if allowed; otherwise wait remaining time
        const delay = canShow
            ? 3000
            : Math.max(0, DONATION_INTERVAL - (now - (lastShownAt ?? 0)));
        const timer = setTimeout(showCard, delay);
        return () => clearTimeout(timer);
    }, [dismissedForever, lastShownAt, dispatch]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    const handleDismissForever = () => {
        dispatch(setDismissedForever(true));
        setIsVisible(false);
    };

    const handleDonate = (amount: number) => {
        alert(`Thank you for your donation of ₹${amount}!`);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed z-50 bottom-6 left-1/2 -translate-x-1/2
    w-[calc(100vw-2rem)] max-w-80
    sm:left-auto sm:translate-x-0 sm:right-6 sm:w-full
    animate-slide-in-right ">
            <div className=" rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] shadow-2xl shadow-purple-500/30">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-5">
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute right-2 top-2 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
                        aria-label="Close donation card"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Header */}
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Heart className="h-6 w-6 animate-pulse text-white" fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Support Prime Play</h3>
                            <p className="text-sm text-white/80">Help us keep content free</p>
                        </div>
                    </div>

                    {/* Preset Amounts */}
                    <div className="mb-4 flex gap-2">
                        {presetAmounts.map(({ amount, label, popular }) => (
                            <button
                                disabled={showCustomAmountDiv}
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
                                disabled={customAmount < 1}
                            >
                                Donate {customAmount ? `₹${customAmount}` : ""}
                            </button>
                        )
                    }

                    {/* Custom Amount Link */}
                    <button className="my-2 w-full text-center text-sm text-white/70 underline-offset-2 transition-colors hover:text-white hover:underline cursor-pointer duration-150" onClick={() => setShowCustomAmountDiv(prev => !prev)}>
                        {showCustomAmountDiv ? "Hide Custom Amount" : "Donate Custom Amount"}
                    </button>

                    {/* Don't show again */}
                    <button
                        onClick={handleDismissForever}
                        className="w-full text-center text-xs text-white/70 transition-colors hover:text-white/90 cursor-pointer"
                    >
                        Don't show again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonationCard
