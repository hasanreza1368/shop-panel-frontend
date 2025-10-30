import React from "react";
import { motion } from "framer-motion";
import parsianLogo from '../assets/images/parsian-logo.png';

const NEON_COLORS = [
    "#FF00FF",
    "#00FFFF",
    "#FFD700",
    "#39FF14",
    "#FF4500",
    "#8A2BE2",
    "#ADFF2F",
    "#00BFFF",
    "#FF1493",
    "#FFFF00",
];

// ستاره‌های چشمک زن و حرکت عمودی آهسته
const TwinklingStars = ({ count = 8 }) => {
    return Array.from({ length: count }, (_, i) => {
        const size = Math.random() * 3 + 1.5;
        const startTop = Math.random() * 100;
        const left = Math.random() * 100 + "%";
        const color = NEON_COLORS[i % NEON_COLORS.length];

        return (
            <motion.span
                key={i}
                style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: color,
                    top: startTop + "%",
                    left,
                }}
                animate={{
                    opacity: [0.2, 1, 0.2],
                    y: [0, -6, 0], // حرکت عمودی آهسته
                }}
                transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: Math.random(),
                }}
            />
        );
    });
};

function formatCardNumber(cardNumber) {
    return cardNumber
        .replace(/[^0-9]/g, "")
        .match(/.{1,4}/g)
        ?.join(" ") ?? cardNumber;
}

const BankInfoCard = ({
    cardHolderName = "نام صاحب کارت",
    cardNumber = "1234567890123456",
    bankLogo = parsianLogo,
    expireDate = "12/25",
    isDarkMode = false,
}) => {
    const formatted = formatCardNumber(cardNumber);
    const digits = formatted.replace(/\s/g, "").split("");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-sm p-6 rounded-xl flex flex-col items-center justify-center overflow-hidden"
            style={{
                backgroundColor: isDarkMode ? "#1E293B" : "#F0F4F8",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25), 0 4px 10px rgba(255,255,255,0.1)",
                border: "1px solid rgba(0,0,0,0.1)",
            }}
        >
            {/* ستاره‌ها در پس‌زمینه */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <TwinklingStars count={12} />
            </div>

            {/* محتوا روی ستاره‌ها */}
            <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                {/* لوگو */}
                {bankLogo && (
                    <img
                        src={bankLogo}
                        alt="bank logo"
                        style={{
                            maxWidth: "50px",
                            height: "auto",
                            marginBottom: "4px",
                        }}
                    />
                )}

                {/* نام صاحب کارت */}
                <p
                    className="font-bold text-lg text-center"
                    style={{
                        fontFamily: "var(--persian-font-stack)",
                        color: isDarkMode ? "#E5E7EB" : "#111827",
                    }}
                >
                    {cardHolderName}
                </p>

                {/* شماره کارت */}
                <div className="flex gap-1 justify-center text-center flex-wrap">
                    {digits.map((char, index) => {
                        const color = NEON_COLORS[index % NEON_COLORS.length];
                        return (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{
                                    opacity: [1, 0.7, 1],
                                    textShadow: [`0 0 6px ${color}`, `0 0 14px ${color}`, `0 0 6px ${color}`],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: index * 0.05,
                                }}
                                whileHover={{
                                    scale: 1.2,
                                    textShadow: `0 0 18px ${color}, 0 0 28px ${color}`,
                                }}
                                style={{
                                    fontFamily: "var(--persian-font-stack)",
                                    fontWeight: 700,
                                    fontSize: "1.2rem",
                                    color,
                                    minWidth: "1ch",
                                    display: "inline-block",
                                }}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                </div>

                {/* تاریخ انقضا */}
                <p
                    className="text-xs"
                    style={{
                        fontFamily: "var(--persian-font-stack)",
                        color: isDarkMode ? "#E5E7EB" : "#374151",
                    }}
                >
                    انقضا: {expireDate}
                </p>
            </div>

            {/* واکنش‌گرایی */}
            <style>
                {`
          @media (max-width: 640px) {
            .w-full {
              padding: 1rem !important;
            }
            .max-w-sm {
              max-width: 95% !important;
            }
            p {
              font-size: 0.9rem !important;
            }
          }
        `}
            </style>
        </motion.div>
    );
};

export default BankInfoCard;