// src/ShopPanel.jsx (نسخه کامل با قابلیت کارت به کارت و انیمیشن‌های پیشرفته)

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
    ShoppingCart, CreditCard, UserX, Trash2, Loader2, CheckCircle, XCircle, Grid,
    Package, Scale, LogOut, Clock, Sun, Moon, Search, Banknote, Upload, FileUp,
    Users, Phone, Smartphone, Send, Sparkles
} from "lucide-react";
// 👈 وارد کردن فایل JSON اطلاعات بانکی
import bankInfo from './bankInfo.json';
import BankInfoCard from "./components/BankInfoCard";
import { AiOutlineShopping } from "react-icons/ai"; // آیکون پیش‌فرض محصول
import ContactButton from "./components/ContactButton";
import AddToCartButton from "./components/AddToCartButton";
import CardToCardButton from "./components/CardToCardButton";



// -----------------------------
// useScreenSize hook
// -----------------------------
const useScreenSize = (breakpoint = 992) => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return { isLargeScreen: width >= breakpoint };
};

// -----------------------------
// تابع تبدیل تاریخ به فارسی
// -----------------------------
const toPersianDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", calendar: "persian" };
    try {
        return new Intl.DateTimeFormat("fa-IR", options).format(date);
    } catch (e) {
        return date.toLocaleDateString("fa-IR", options);
    }
};

// -----------------------------
// کامپوننت Toast
// -----------------------------
const Toast = ({ message, type, onClose }) => {
    const color = type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#3B82F6";
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                zIndex: 50,
                padding: "1rem",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
                color: "white",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: color,
                cursor: "pointer",
            }}
            onClick={onClose}
        >
            {type === "success" && <CheckCircle size={24} />}
            {type === "error" && <XCircle size={24} />}
            {message}
        </motion.div>
    );
};


const ContactPopup = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    width: "90%",
                    maxWidth: "400px",
                    borderRadius: "1rem",
                    padding: "2rem",
                    background: "rgba(30,30,40,0.6)", // شیشه‌ای
                    backdropFilter: "blur(15px)",
                    border: "2px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 0 30px rgba(109,40,217,0.7)", // سایه براق
                    overflow: "hidden",
                }}
            >
                {/* نور زنده متحرک */}
                <motion.div
                    animate={{ x: ["-150%", "150%"] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        pointerEvents: "none",
                        filter: "blur(15px)",
                    }}
                />

                {/* نور تنفس */}
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(109,40,217,0.2)",
                        borderRadius: "1rem",
                        pointerEvents: "none",
                    }}
                />

                <h2 style={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    marginBottom: "1.5rem",
                    fontWeight: 700,
                    textShadow: "0 0 10px #9f1eff, 0 0 20px #2575fc",
                }}>
                    ارتباط با ما 💬
                </h2>

                <div style={{
                    color: "white",
                    fontSize: "1rem",
                    lineHeight: "2.2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem"
                }}>
                    <p>
                        <Phone size={20} style={{ display: "inline-block", marginLeft: 6, color: "#10B981" }} />
                        تلفن فروشگاه: <b>051-54191111</b>
                    </p>
                    <p>
                        <Smartphone size={20} style={{ display: "inline-block", marginLeft: 6, color: "#F59E0B" }} />
                        همراه: <b>09120000000</b>
                    </p>
                    <p>
                        <Send size={20} style={{ display: "inline-block", marginLeft: 6, color: "#3B82F6" }} />
                        تلگرام: <b>@rahgozar_ho1368</b>
                    </p>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        marginTop: "1.8rem",
                        width: "100%",
                        padding: "0.9rem",
                        borderRadius: "0.6rem",
                        border: "none",
                        background: "linear-gradient(135deg, #9f1eff, #2575fc)",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 0 15px #9f1eff, 0 0 25px #2575fc",
                        textShadow: "0 0 5px #fff",
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    بستن
                </button>
            </motion.div>
        </motion.div>
    );
};


// **********************************************
// ** ۱. کامپوننت‌های Star و TwinklingStars **
// **********************************************

// کامپوننت Star (یک ستاره تنها)
const Star = ({ size, delay, duration, color }) => {
    // افکت سوسو زدن با keyframes
    const twinkle = {
        opacity: [0, 1, 0, 1, 0.5, 0],
        scale: [1, 1.2, 1, 1, 1.1, 1],
    };

    return (
        <motion.div
            style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
                zIndex: 1,
                // موقعیت تصادفی
                top: `${Math.random() * 80}%`,
                right: `${Math.random() * 80}%`,
                transform: 'translate(50%, -50%)',
            }}
            animate={twinkle}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                delay: delay,
            }}
        />
    );
};

// کامپوننت TwinklingStars (ظرف ستاره‌ها)
const TwinklingStarsAnimatedNew = ({ count = 3, color = "#fff" }) => {
    const stars = Array.from({ length: count }).map((_, index) => (
        <Star
            key={index}
            size={Math.random() * 3 + 1}
            delay={Math.random() * 5}
            duration={Math.random() * 2 + 1}
            color={color}
        />
    ));

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
            {stars}
        </div>
    );
};


// --------------------
// کامپوننت CheckIcon
// --------------------
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

// --------------------
// ستاره تکی برای افکت TwinklingStars
// --------------------
const TwinkleStar = ({ size, delay, duration, color }) => {
    const twinkle = {
        opacity: [0, 1, 0, 1, 0.5, 0],
        scale: [1, 1.2, 1, 1, 1.1, 1],
    };

    return (
        <motion.div
            style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: color,
                boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
                zIndex: 1,
                top: `${Math.random() * 80}%`,
                right: `${Math.random() * 80}%`,
                transform: "translate(50%, -50%)",
            }}
            animate={twinkle}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                delay: delay,
            }}
        />
    );
};

// --------------------
// کامپوننت TwinklingStars
// --------------------
const TwinklingStarsAnimated = ({ count = 3, color = "#fff" }) => {
    const stars = Array.from({ length: count }).map((_, index) => (
        <TwinkleStar
            key={index}
            size={Math.random() * 3 + 1}
            delay={Math.random() * 5}
            duration={Math.random() * 2 + 1}
            color={color}
        />
    ));

    return (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
            {stars}
        </div>
    );
};

// --------------------
// کامپوننت ProductCard
// --------------------
const ProductCard = React.memo(({ product, onSelect, selected, isDarkMode }) => {
    const NEON_CARD_COLOR = isDarkMode ? "#00ffc8" : "#8000ff";
    const GLOW_SHADOW = `0 0 10px ${NEON_CARD_COLOR}, 0 0 20px ${NEON_CARD_COLOR}`;

    const [hovered, setHovered] = useState(false);

    // رنگ placeholder برای کارت بدون تصویر
    const COLORS = ["#F87171", "#34D399", "#60A5FA", "#FBBF24"];
    const bgColor = COLORS[product.id ? product.id % COLORS.length : Math.floor(Math.random() * COLORS.length)];

    const baseStyle = {
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: selected
            ? GLOW_SHADOW
            : isDarkMode
                ? "0 4px 10px rgba(0,0,0,0.5)"
                : "0 4px 10px rgba(0,0,0,0.1)",
        cursor: "pointer",
        backgroundColor: selected
            ? isDarkMode
                ? "#1e293b"
                : "#E0E7FF"
            : isDarkMode
                ? "#0f172a"
                : "white",
        border: selected
            ? `2px solid ${NEON_CARD_COLOR}`
            : isDarkMode
                ? "1px solid #374151"
                : "1px solid #E5E7EB",
        color: isDarkMode ? "white" : "inherit",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "all 0.3s ease",
    };

    const hoverStyle = {
        scale: 1.03,
        boxShadow: `${GLOW_SHADOW}, 0 8px 20px rgba(0,0,0,0.4)`,
    };

    // تعیین تصویر: اگر product.image موجود بود استفاده شود، در غیر این صورت مسیر پیش‌فرض public/images
    const productImage = product.image
        ? product.image
        : `/images/${product.id || product.name}.jpg`;

    return (
        <motion.div
            whileHover={hoverStyle}
            animate={{ scale: selected ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={baseStyle}
            onClick={() => onSelect(product)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            key={product.id || product.name}
        >
            {/* تصویر محصول یا placeholder رنگی با آیکون کیف */}
            <img
                src={productImage}
                alt={product.name}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.jpg"; // fallback برای محصول بدون تصویر
                }}
                style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "0.75rem",
                    marginBottom: "0.75rem",
                }}
            />

            {/* ستاره‌های چشمک زن */}
            {!selected && <TwinklingStarsAnimatedNew count={5} color={NEON_CARD_COLOR} />}

            {/* نام محصول */}
            <h4
                style={{
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    color: selected ? NEON_CARD_COLOR : isDarkMode ? "#818CF8" : "#3730A3",
                    marginBottom: "0.25rem",
                }}
            >
                {product.name}
            </h4>

            {/* قیمت محصول */}
            <p
                style={{
                    fontSize: "0.875rem",
                    color: isDarkMode ? "#A1A1AA" : "#4B5563",
                    fontWeight: 500,
                }}
            >
                قیمت واحد:{" "}
                <span style={{ fontWeight: "600", color: "#10B981" }}>
                    {product.price.toLocaleString()} تومان
                </span>
            </p>

            {/* Checkmark وقتی انتخاب شد */}
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        backgroundColor: NEON_CARD_COLOR,
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000",
                    }}
                >
                    <CheckIcon />
                </motion.div>
            )}
        </motion.div>
    );
});

// **********************************************
// ✅ کامپوننت اصلاح‌شده CardToCardModal (با رفع مشکل نام مشتری)
// **********************************************
// 💡 اصلاح: اضافه کردن 'customerPhone' و 'customerFullName' به props
const CardToCardModal = ({
    totalCartPrice,
    onClose,
    onUploadReceipt,
    isDarkMode,
    showToast,
    bankInfo,
    customerPhone,
    customerFullName
}) => {
    const [receiptFile, setReceiptFile] = useState(null);
    const fileInputRef = useRef(null);
    const CARD_COLOR = "#047857";

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setReceiptFile(file || null);
    };

    const handleSubmit = async () => {
        if (!receiptFile) {
            showToast("⚠️ لطفاً ابتدا رسید پرداخت را انتخاب کنید.", "error");
            return;
        }
        if (!customerPhone || !customerFullName) {
            showToast("❌ خطای احراز هویت: اطلاعات مشتری نامشخص است.", "error");
            return;
        }

        showToast("⏳ در حال ارسال رسید پرداخت...", "info");

        const formData = new FormData();
        formData.append("receipt", receiptFile);
        formData.append("amount", totalCartPrice);
        formData.append("customerName", customerFullName);
        formData.append("phone", customerPhone);

        try {
            const res = await axios.post(
                "http://192.168.1.127:5000/api/upload-receipt",
                formData
            );

            if (res.data.success) {
                showToast("✅ رسید پرداخت با موفقیت ارسال شد.", "success");
                onUploadReceipt();
                onClose();
            } else {
                showToast(res.data.error || "❌ خطا در ارسال رسید.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("❌ خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.", "error");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 60
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: isDarkMode ? "#1F2937" : "white",
                    padding: "2.5rem",
                    borderRadius: "1rem",
                    width: "90%",
                    maxWidth: "30rem",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                    color: isDarkMode ? "white" : "black",
                    position: "relative",
                    border: isDarkMode ? `1px solid ${CARD_COLOR}` : "none"
                }}
            >
                {/* دکمه بستن */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        background: "none",
                        border: "none",
                        color: isDarkMode ? "#A1A1AA" : "#6B7280",
                        cursor: "pointer"
                    }}
                >
                    <XCircle size={24} />
                </button>

                <h3
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        marginBottom: "1.5rem",
                        color: CARD_COLOR,
                        textAlign: "center"
                    }}
                >
                    جزئیات پرداخت کارت به کارت
                </h3>

                {/* مبلغ سفارش */}
                <p
                    style={{
                        lineHeight: "1.6",
                        marginBottom: "1.5rem",
                        textAlign: "justify",
                        color: isDarkMode ? "#E5E7EB" : "#4B5563"
                    }}
                >
                    مبلغ سفارش:{" "}
                    <span style={{ fontWeight: "bold", color: "#EF4444" }}>
                        {totalCartPrice.toLocaleString()} تومان
                    </span>
                </p>

                {/* کارت بانکی با افکت نئون */}
                <BankInfoCard
                    cardHolderName={bankInfo.cardHolderName}
                    cardNumber={bankInfo.cardNumber}
                    expireDate={bankInfo.expireDate || "12/25"}
                    isDarkMode={isDarkMode}
                />

                {/* بخش آپلود و ارسال رسید */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        marginTop: "1.5rem"
                    }}
                >
                    <label
                        htmlFor="receipt-upload"
                        style={{
                            padding: "0.75rem 1rem",
                            borderRadius: "0.5rem",
                            backgroundColor: CARD_COLOR,
                            color: "white",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 4px 10px rgba(4, 120, 87, 0.5)"
                        }}
                    >
                        <Upload size={20} />
                        <span>
                            {receiptFile
                                ? `فایل انتخاب شده: ${receiptFile.name}`
                                : "انتخاب فایل رسید پرداخت"}
                        </span>

                        <input
                            ref={fileInputRef}
                            id="receipt-upload"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                opacity: 0,
                                cursor: "pointer"
                            }}
                        />
                    </label>

                    <motion.button
                        whileHover={{ scale: receiptFile ? 1.02 : 1 }}
                        whileTap={{ scale: receiptFile ? 0.98 : 1 }}
                        onClick={handleSubmit}
                        disabled={!receiptFile}
                        style={{
                            padding: "0.75rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#10B981",
                            color: "white",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            opacity: receiptFile ? 1 : 0.5,
                            cursor: receiptFile ? "pointer" : "not-allowed",
                            boxShadow: receiptFile
                                ? "0 4px 10px rgba(16, 185, 129, 0.4)"
                                : "none"
                        }}
                    >
                        <FileUp size={20} /> ارسال رسید پرداخت
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};



// ShopPanel.jsx - بعد از CardToCardModal
// -----------------------------------------------------------------------------
// 🔥 کامپوننت دکمه شیک کاربران آنلاین (با استایل داخلی)
// -----------------------------------------------------------------------------
const OnlineUserIndicator = ({
    count,
    isDarkMode,
    NEON_COLOR, // حالا از Prop استفاده می‌شود
    NEON_GLOW_SHADOW // حالا از Prop استفاده می‌شود
}) => {
    // 💡 تعریف متغیرها باید داخل بدنه تابع کامپوننت باشد
    const GLOW_COLOR = "#00ffff"; // رنگ نور متحرک
    const BG_COLOR = isDarkMode ? "#081010" : "#E0FFFF";
    const TEXT_COLOR = isDarkMode ? NEON_COLOR : "#047857";

    // 💡 تعریف استایل‌ها باید داخل بدنه تابع کامپوننت باشد
    const style = {
        button: {
            position: 'relative',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            background: BG_COLOR,
            color: TEXT_COLOR,
            fontWeight: 'bold',
            fontSize: '1rem',
            border: `2px solid ${NEON_COLOR}`,
            cursor: 'default',
            overflow: 'hidden',
            boxShadow: `0 0 10px rgba(0, 255, 200, 0.6), inset 0 0 5px rgba(0, 255, 200, 0.3)`,
            transition: 'all 0.3s ease',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center', // اضافه شده برای تمیزی
            minWidth: '200px', // اضافه شده برای تمیزی
            justifyContent: 'center', // اضافه شده برای تمیزی
        },
        flicker: {
            animation: 'flicker 1.5s infinite alternate',
            display: 'flex', // اضافه شده برای تمیزی
            alignItems: 'center', // اضافه شده برای تمیزی
            zIndex: 20, // اضافه شده برای تمیزی
        },
        shine: {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${GLOW_COLOR}33, transparent)`,
            animation: 'shine 4s infinite linear',
            zIndex: 15, // اضافه شده برای تمیزی
        },
        star: {
            position: 'absolute',
            background: 'white',
            borderRadius: '50%',
            width: '2px',
            height: '2px',
            opacity: 0,
            animation: 'star-flicker 2s infinite ease-out',
            zIndex: 20, // اضافه شده برای تمیزی
        }
    };

    // 💡 تعریف تابع کمکی باید داخل بدنه تابع کامپوننت باشد
    const getStars = () => {
        return Array.from({ length: 5 }).map((_, i) => (
            <div
                key={i}
                style={{
                    ...style.star,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                }}
            />
        ));
    };

    // 💡 تابع return باید تنها یک خروجی داشته باشد
    return (
        <motion.div
            style={style.button}
            whileHover={{ scale: 1.05 }}
        >
            <div style={style.shine} /> {/* <span> به <div> تغییر کرد تا استایل shine بهتر اعمال شود */}
            <div style={style.flicker}> {/* <span> به <div> تغییر کرد تا استایل flicker بهتر اعمال شود */}
                <Users size={18} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
                تعداد کاربران آنلاین: {count.toLocaleString()}
            </div>
            {getStars()}

            {/* 💡 تعریف CSS Keyframes برای استایل‌های اینلاین */}
            <style>
                {`
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                @keyframes star-flicker {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1); }
                }
                @keyframes flicker {
                    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { 
                        opacity: 1; 
                        text-shadow: ${isDarkMode ? NEON_GLOW_SHADOW : 'none'}; 
                    }
                    20%, 24%, 55% { 
                        opacity: 0.9; 
                        text-shadow: ${isDarkMode ? `0 0 2px ${NEON_COLOR}` : 'none'};
                    }
                }
                `}
            </style>
        </motion.div>
    );
};
// **********************************************
// ** ۵. کامپوننت ShopPanel اصلی **
// **********************************************
const ShopPanel = () => {
    // ... (State ها) ...

    const [step, setStep] = useState("login");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [weight, setWeight] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [logs, setLogs] = useState([]);

    const [theme, setTheme] = useState("light");
    const isDarkMode = theme === "dark";

    const [showCardToCardModal, setShowCardToCardModal] = useState(false); // 👈 استیت موجود
    const [showContact, setShowContact] = useState(false);

    // 🔥 استیت جدید برای شمارنده کاربران آنلاین 🔥
    const [onlineCount, setOnlineCount] = useState(0);

    const { isLargeScreen } = useScreenSize();
    const wsRef = useRef(null);
    const logEndRef = useRef(null);

    const NEON_COLOR = "#00ffc8";
    const NEON_GLOW_SHADOW = `0 0 5px ${NEON_COLOR}, 0 0 10px ${NEON_COLOR}`;
    const DARK_BG = "#000909";

    // ✅ اصلاح شده با useCallback: تضمین می‌شود که این توابع تغییر نمی‌کنند
    const showToast = useCallback((message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, [setToast]); // setToast در اینجا به عنوان وابستگی قرار می‌گیرد

    // ✅ اصلاح شده با useCallback: تضمین می‌شود که این توابع تغییر نمی‌کنند
    const addLog = useCallback((message, owner) => {
        const now = new Date();
        const persianDate = toPersianDate(now);
        const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        setLogs(prev => [...prev, { message, owner, date: persianDate, time: formattedTime }]);
    }, [setLogs]); // setLogs در اینجا به عنوان وابستگی قرار می‌گیرد

    // 🔥 تابع calculateTotalPrice
    const calculateTotalPrice = () => {
        // این تابع فقط از 'cart' استفاده می‌کند که در Scope خارجی است و نیاز به useCallback ندارد
        return cart.reduce((total, item) => {
            const price = item.price || 0;
            const value = item.weight ? item.weight : (item.quantity || 0);
            return total + (price * value);
        }, 0);
    };

    // 🔥🔥 تابع fetchProducts: موقعیت آن همانجا باقی می‌ماند اما با useCallback
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://192.168.1.127:5000/api/products");
            setProducts(res.data);
            // 💡 چون addLog و showToast در اینجا استفاده می‌شوند، باید در useCallback این تابع به عنوان وابستگی باشند
            addLog("لیست محصولات از سرور دریافت شد.", "System");
        } catch (err) {
            showToast("خطا در دریافت محصولات از سرور.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setProducts, addLog, showToast]); // ✅ وابستگی‌های لازم برای fetchProducts

    useEffect(() => {
        // ۱. منطق بستن اتصال هنگام خروج از پنل
        if (step !== "panel") {
            // ✅ اصلاح: بستن فقط در صورت OPEN یا CONNECTING بودن
            if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
                wsRef.current.close();
            }
            wsRef.current = null;
            return;
        }

        // ۲. واکشی محصولات و اتصال به وب‌سوکت
        fetchProducts(); // ✅ این تابع اکنون ثابت است و مشکلی ایجاد نمی‌کند.

        const ws = new WebSocket(`ws://192.168.1.127:5000?phone=${phone}`);

        ws.onopen = () => {
            addLog("✅ اتصال به سرور برقرار شد.", "System");
        };

        ws.onmessage = (msg) => {
            // ... (بخش try و catch) ...
            try {
                const data = JSON.parse(msg.data);

                // --- ۱. هندل کردن nesieStatus ---
                if (data.type === "nesieStatus") {
                    const status = data.data.status === 'approved' ? 'تایید' : 'رد';
                    const reason = data.data.reason ? ` (دلیل: ${data.data.reason})` : '';

                    addLog(`🔥 درخواست نسیه شما توسط ادمین **${status}** شد.${reason}`, "Admin");
                    showToast(`پاسخ ادمین در مورد نسیه دریافت شد.`, "success");
                    // ...
                }

                // --- ۲. هندل کردن receiptStatus ---
                else if (data.type === "receiptStatus") {
                    const status = data.data.status === 'approved' ? 'تایید' : 'رد';
                    const reason = data.data.reason ? ` (دلیل: ${data.data.reason})` : '';

                    addLog(`💸 رسید پرداخت شما توسط ادمین **${status}** شد.${reason}`, "Admin");
                    showToast(`پاسخ ادمین در مورد رسید دریافت شد.`, "success");
                }

                // 🔥🔥🔥 جدید: هندل کردن onlineCount 🔥🔥🔥
                else if (data.type === "onlineCount") {
                    setOnlineCount(data.data);
                    addLog(`✅ [WS] تعداد کاربران آنلاین به‌روز شد: ${data.data}`, 'System');
                }

                // ۳. هندل کردن سایر پیام‌ها (مثل آپدیت محصولات)
                // ... داخل ws.onmessage
                else if (data.type === "products_update") {
                    console.log("🔥 پیام آپدیت محصولات از سرور دریافت شد!"); // 👈 این خط را اضافه کنید
                    setProducts(data.products);
                    showToast("لیست محصولات به‌روزرسانی شد", "info");
                }
                // ...
            } catch (error) {
                console.error("❌ خطا در تحلیل پیام وب‌سوکت:", error);
                addLog("خطا در دریافت اطلاعات از سرور.", "System");
            }
        };

        ws.onclose = () => {
            // ❌ حذف شد: لاگ `اتصال به سرور قطع شد` باید فقط توسط Cleanup Function اجرا شود تا تکرار نشود.
            wsRef.current = null;
        };

        // ۴. اختصاص دادن اتصال به wsRef
        wsRef.current = ws;

        // ۵. Cleanup Function: بستن اتصال قبلی قبل از اجرای مجدد useEffect
        return () => {
            if (wsRef.current) {
                // ✅ اصلاح: بستن فقط در صورت OPEN یا CONNECTING بودن
                if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
                    wsRef.current.close();
                    addLog("اتصال به سرور قطع شد.", "System"); // ✅ لاگ فقط اینجا است.
                }
                wsRef.current = null;
            }
        };
        // ✅ وابستگی‌های نهایی و صحیح: فقط متغیرهای state و توابع ثابت‌شده
    }, [step, phone, fetchProducts, addLog, setOnlineCount, setProducts, showToast]);
    // توابع هندلر...
    const handleLogin = () => {
        if (!firstName || !lastName || !phone || phone.length < 10) {
            showToast("لطفا همه فیلدها را به درستی پر کنید!", "error");
            return;
        }
        setStep("panel");
    };

    const handleSelectProduct = (product) => {
        if (selectedProduct && selectedProduct.id === product.id) {
            setSelectedProduct(null);
            showToast(`انتخاب ${product.name} لغو شد.`, "info");
        } else {
            setSelectedProduct(product);
            setQuantity(1);
            setWeight(1);
            showToast(`${product.name} انتخاب شد. تعداد و وزن را وارد کنید.`, "info");
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddToCart = () => {
        if (!selectedProduct) {
            showToast("لطفا یک محصول را انتخاب کنید.", "error");
            return;
        }
        if (quantity <= 0 || weight <= 0) {
            showToast("تعداد و وزن باید بیشتر از صفر باشند.", "error");
            return;
        }

        const totalPrice = selectedProduct.price * quantity * weight;
        const newItem = {
            ...selectedProduct,
            quantity,
            weight: parseFloat(weight.toFixed(2)),
            totalPrice
        };

        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.id === selectedProduct.id);

            if (existingItemIndex > -1) {
                const updatedCart = [...prevCart];
                const existingItem = updatedCart[existingItemIndex];
                updatedCart[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + quantity,
                    weight: parseFloat((existingItem.weight + weight).toFixed(2)),
                    totalPrice: existingItem.totalPrice + totalPrice
                };
                showToast(`تعداد ${selectedProduct.name} در سبد به‌روز شد.`, "success");
                return updatedCart;
            } else {
                showToast(`${selectedProduct.name} به سبد اضافه شد.`, "success");
                return [...prevCart, newItem];
            }
        });

        setSelectedProduct(null);
        setSearch("");
        setQuantity(1);
        setWeight(1);
    };

    const handleRemoveFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
        showToast("محصول از سبد حذف شد.", "info");
    }

    const totalCartPrice = cart.reduce((a, b) => a + b.totalPrice, 0);

    const handleOrder = async (type) => {
        if (cart.length === 0) {
            showToast("سبد خرید شما خالی است!", "error");
            return;
        }

        if (type === "cardToCard") {
            setShowCardToCardModal(true);
            addLog("کاربر درخواست پرداخت کارت به کارت را آغاز کرد.", "User");
            return;
        }

        setIsLoading(true);
        const customer = { firstName, lastName, phone };
        const endpoint = type === "nesie" ? "nesie" : "order";
        const logMessage = type === "nesie"
            ? "درخواست نسیه برای ادمین ارسال شد."
            : "درخواست سفارش با پرداخت آنلاین ارسال شد.";

        addLog(logMessage, "User");

        try {
            await axios.post(
                `http://192.168.1.127:5000/api/${endpoint}`,
                { customer, cart, type }
            );

            if (type === "nesie") {
                showToast("درخواست نسیه با موفقیت ارسال شد. منتظر پاسخ ادمین باشید.", "info");
            } else {
                showToast("سفارش آنلاین با موفقیت ثبت شد!", "success");
            }

            setCart([]);
        } catch (err) {
            showToast("خطا در ارسال سفارش. لطفا اتصال خود را بررسی کنید.", "error");
            console.error("خطا در ارسال سفارش:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReceiptUploadSuccess = () => {
        setShowCardToCardModal(false); // محو شدن هوشمند کادر
        setCart([]); // پاک کردن سبد خرید
        addLog("رسید پرداخت کارت به کارت با موفقیت ارسال شد. منتظر تایید ادمین باشید.", "System");
    };

    const handleClearLogs = () => setLogs([]);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    const mainContainerStyle = {
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', padding: '1.5rem', fontFamily: "'Shabnam', sans-serif",
        backgroundImage: isDarkMode ? 'none' : "url('/static/background/bg.jpg')",
        backgroundColor: isDarkMode ? DARK_BG : 'white', color: isDarkMode ? NEON_COLOR : 'initial',
        transition: 'all 0.5s ease',
    };

    const panelLayout = {
        display: 'flex', flexDirection: isLargeScreen ? 'row' : 'column', gap: '1.5rem',
        padding: '2rem', borderRadius: '1rem',
        boxShadow: isDarkMode ? '0 0 15px rgba(0, 255, 200, 0.2)' : '0 20px 25px rgba(0, 0, 0, 0.25)',
        width: '100%', maxWidth: isLargeScreen ? '80rem' : '100%', marginTop: '1.5rem',
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        border: isDarkMode ? '1px solid rgba(0, 255, 200, 0.1)' : 'none',
    };

    const neonHeaderStyle = {
        fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        color: isDarkMode ? NEON_COLOR : '#4F46E5',
        textShadow: isDarkMode ? NEON_GLOW_SHADOW : 'none',
        transition: 'all 0.5s ease',
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    {/* 👈 دکمه کارت به کارت */ }
    <CardToCardButton
        onClick={() => handleOrder("cardToCard")}
        disabled={isLoading || cart.length === 0}
    />

    // ---------------------------------------------------------------------

    return (
        <div style={mainContainerStyle}>
            {/* ... (Theme Button و Toast) ... */}
            <button
                onClick={toggleTheme}
                style={{
                    position: 'fixed', top: '1rem', left: '1rem', padding: '0.75rem',
                    borderRadius: '50%', backgroundColor: isDarkMode ? NEON_COLOR : '#4F46E5',
                    color: isDarkMode ? DARK_BG : 'white', zIndex: 50, cursor: 'pointer',
                    boxShadow: isDarkMode ? NEON_GLOW_SHADOW : '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                {/* 👈 رندر مُدال کارت به کارت */}
                {showCardToCardModal && (
                    <CardToCardModal
                        totalCartPrice={calculateTotalPrice()} // 💡 باید از تابع calculateTotalPrice استفاده شود
                        onClose={() => setShowCardToCardModal(false)}
                        onUploadReceipt={handleReceiptUploadSuccess}
                        isDarkMode={isDarkMode}
                        showToast={showToast}

                        // 📢 اطلاعات بانکی فروشنده (ثابت)
                        bankInfo={{
                            cardHolderName: "حسن رضا عرب مژن آبادی", // نام صاحب کارت فروشنده
                            cardNumber: "6221061240021222" // شماره کارت فروشنده
                        }}

                        // 🔥 اصلاح کلیدی ۱: ارسال شماره تلفن مشتری برای اتصال وب‌سوکت
                        customerPhone={phone}

                        // 🔥 اصلاح کلیدی ۲: ارسال نام کامل مشتری برای ثبت در لاگ
                        customerFullName={`${firstName} ${lastName}`}
                    />
                )}
            </AnimatePresence>
            {/* ... (Login Step) ... */}
            {step === "login" && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                        padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.25)',
                        width: '90%', maxWidth: '28rem', color: isDarkMode ? NEON_COLOR : 'initial',
                        border: isDarkMode ? `1px solid ${NEON_COLOR}` : 'none',
                    }}
                >
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center', color: isDarkMode ? NEON_COLOR : '#4F46E5', textShadow: isDarkMode ? NEON_GLOW_SHADOW : 'none' }}>🛒 پنل مشتری هوشمند</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${isDarkMode ? '#374151' : '#D1D5DB'}`, borderRadius: '0.5rem', transition: 'all 0.2s', backgroundColor: isDarkMode ? '#1F2937' : 'white', color: isDarkMode ? 'white' : 'black' }}
                            placeholder="نام" value={firstName} onChange={e => setFirstName(e.target.value)}
                        />
                        <input
                            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${isDarkMode ? '#374151' : '#D1D5DB'}`, borderRadius: '0.5rem', transition: 'all 0.2s', backgroundColor: isDarkMode ? '#1F2937' : 'white', color: isDarkMode ? 'white' : 'black' }}
                            placeholder="نام خانوادگی" value={lastName} onChange={e => setLastName(e.target.value)}
                        />
                        <input
                            style={{ width: '100%', padding: '0.75rem', border: `1px solid ${isDarkMode ? '#374151' : '#D1D5DB'}`, borderRadius: '0.5rem', transition: 'all 0.2s', backgroundColor: isDarkMode ? '#1F2937' : 'white', color: isDarkMode ? 'white' : 'black' }}
                            placeholder="شماره همراه" value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                        style={{
                            width: '100%', backgroundColor: isDarkMode ? NEON_COLOR : '#4F46E5',
                            color: isDarkMode ? DARK_BG : 'white', padding: '0.75rem',
                            borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1.125rem',
                            marginTop: '1.5rem', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        }}
                        onClick={handleLogin} disabled={isLoading}
                    >
                        {isLoading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={24} /> : "ورود به فروشگاه"}
                    </motion.button>
                </motion.div>
            )}

            {step === "panel" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={panelLayout}
                >
                    {/* ----------------------------------------------------------------------------------------------------------------- */}
                    {/* ستون ۱: محصولات (با فیلد جستجو) */}
                    {/* ----------------------------------------------------------------------------------------------------------------- */}
                    <div
                        style={{
                            flex: isLargeScreen ? 1 : 'none',
                            borderRight: isLargeScreen
                                ? (isDarkMode ? '1px solid rgba(0, 255, 200, 0.1)' : '1px solid #E5E7EB')
                                : 'none',
                            paddingRight: isLargeScreen ? '1.5rem' : '0'
                        }}
                    >
                        <h2 style={neonHeaderStyle}>
                            <Grid size={24} /> لیست محصولات
                        </h2>

                        {/* فیلد جستجو */}
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                style={{
                                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    border: `2px solid ${isDarkMode ? '#374151' : '#D1D5DB'}`,
                                    borderRadius: '0.5rem', outline: 'none', transition: 'all 0.2s',
                                    backgroundColor: isDarkMode ? '#1F2937' : 'white',
                                    color: isDarkMode ? 'white' : 'black'
                                }}
                                placeholder="جستجوی محصول..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: isDarkMode ? '#A1A1AA' : '#6B7280' }} />
                        </div>

                        {/* تنظیمات افزودن به سبد */}
                        <div
                            style={{
                                backgroundColor: isDarkMode ? '#1E293B' : '#F9FAFB',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
                                marginBottom: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}
                        >
                            <h4
                                style={{
                                    fontWeight: 'bold',
                                    color: isDarkMode ? NEON_COLOR : '#4B5563',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                تنظیمات افزودن به سبد:
                            </h4>

                            <AnimatePresence>
                                {selectedProduct && (
                                    <motion.p
                                        key="selected-info"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{
                                            fontSize: '0.875rem', padding: '0.5rem',
                                            backgroundColor: isDarkMode ? '#334155' : '#FEF3C7',
                                            borderRadius: '0.5rem', fontWeight: '600',
                                            color: isDarkMode ? '#FDE047' : '#B45309'
                                        }}
                                    >
                                        انتخاب شده: {selectedProduct.name} - قیمت واحد: {selectedProduct.price.toLocaleString()} تومان
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {/* ... (ورودی تعداد و وزن) ... */}
                                <div style={{ flex: 1 }}>
                                    <label
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isDarkMode ? '#A1A1AA' : '#4B5563', marginBottom: '0.25rem' }}
                                    > <Package size={16} /> تعداد </label>
                                    <input
                                        type="number" min={1}
                                        style={{ border: `2px solid ${isDarkMode ? '#374151' : '#D1D5DB'}`, padding: '0.75rem', borderRadius: '0.5rem', width: '100%', outline: 'none', transition: 'all 0.2s', textAlign: 'center', backgroundColor: isDarkMode ? '#1F2937' : 'white', color: isDarkMode ? 'white' : 'black' }}
                                        value={quantity}
                                        onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isDarkMode ? '#A1A1AA' : '#4B5563', marginBottom: '0.25rem' }}
                                    > <Scale size={16} /> وزن (کیلوگرم) </label>
                                    <input
                                        type="number" min={0.01} step={0.1}
                                        style={{ border: `2px solid ${isDarkMode ? '#374151' : '#D1D5DB'}`, padding: '0.75rem', borderRadius: '0.5rem', width: '100%', outline: 'none', transition: 'all 0.2s', textAlign: 'center', backgroundColor: isDarkMode ? '#1F2937' : 'white', color: isDarkMode ? 'white' : 'black' }}
                                        value={weight}
                                        onChange={e => setWeight(Math.max(0.01, Number(e.target.value)))}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <AddToCartButton
                                handleAddToCart={handleAddToCart}
                                isLoading={isLoading}
                                selectedProduct={selectedProduct}
                            />

                        </div>

                        {/* وضعیت نمایش تعداد محصول */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: isDarkMode ? NEON_COLOR : '#4B5563' }}>
                                {isLoading ? "..." : `نمایش ${filteredProducts.length} کالا`}
                            </h3>
                            {isLoading && <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#4F46E5' }} size={20} />}
                        </div>

                        {/* لیست محصولات */}
                        <div style={{ height: '24rem', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                            {filteredProducts.length === 0 && !isLoading ? (
                                <motion.p
                                    key="no-result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', color: isDarkMode ? '#A1A1AA' : '#6B7280', padding: '1rem', border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`, borderRadius: '0.5rem' }}
                                >
                                    محصولی با این نام یافت نشد.
                                </motion.p>
                            ) : (
                                filteredProducts.map((p) => (
                                    <div key={p.id}>
                                        <ProductCard
                                            product={p}
                                            onSelect={handleSelectProduct}
                                            selected={selectedProduct && selectedProduct.id === p.id}
                                            isDarkMode={isDarkMode}
                                        />
                                    </div>
                                ))
                            )}

                        </div>
                    </div>

                    {/* ستون ۲: سبد خرید */}
                    <div style={{
                        flex: isLargeScreen ? 1 : 'none', paddingRight: isLargeScreen ? '1.5rem' : '0', borderRight: isLargeScreen
                            ? (isDarkMode ? '1px solid rgba(0, 255, 200, 0.1)' : '1px solid #E5E7EB')
                            : 'none',
                    }}>
                        <h2 style={neonHeaderStyle}>
                            <ShoppingCart size={24} /> سبد خرید
                        </h2>
                        <div style={{ height: '24rem', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <AnimatePresence>
                                {cart.length === 0 ? (
                                    <motion.p
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ textAlign: 'center', color: isDarkMode ? '#A1A1AA' : '#6B7280', padding: '1rem', border: `1px dashed ${isDarkMode ? '#374151' : '#E5E7EB'}`, borderRadius: '0.5rem' }}
                                    > سبد خرید شما خالی است. </motion.p>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div
                                            key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#1F2937' : '#E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: isLargeScreen ? '1rem' : '0.875rem' }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: isDarkMode ? 'white' : 'black' }}>
                                                <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                                                <span style={{ fontSize: '0.875rem', color: isDarkMode ? '#A1A1AA' : '#4B5563' }}>
                                                    {item.quantity} عدد * {item.weight} کیلوگرم = {(item.totalPrice).toLocaleString()} تومان
                                                </span>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemoveFromCart(item.id)}
                                                style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: '#EF4444', color: 'white', cursor: 'pointer' }}
                                            > <Trash2 size={16} /> </motion.button>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                        <div style={{ paddingTop: '1rem', borderTop: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: isDarkMode ? NEON_COLOR : '#4F46E5' }}>
                                جمع کل: {totalCartPrice.toLocaleString()} تومان
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                                <CardToCardButton
                                    onClick={() => handleOrder("cardToCard")}
                                    disabled={isLoading || cart.length === 0}
                                />


                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => handleOrder("online")} disabled={isLoading || cart.length === 0}
                                    style={{
                                        width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: '#4F46E5', color: 'white', fontWeight: 'bold',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        opacity: (isLoading || cart.length === 0) ? 0.5 : 1, cursor: (isLoading || cart.length === 0) ? 'not-allowed' : 'pointer'
                                    }}
                                > <CreditCard size={20} /> پرداخت آنلاین </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => handleOrder("nesie")} disabled={isLoading || cart.length === 0}
                                    style={{
                                        width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: '#F59E0B', color: 'white', fontWeight: 'bold',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        opacity: (isLoading || cart.length === 0) ? 0.5 : 1, cursor: (isLoading || cart.length === 0) ? 'not-allowed' : 'pointer'
                                    }}
                                > <UserX size={20} /> ثبت سفارش (نسیه) </motion.button>
                                {/* دکمه ارتباط با ما */}
                                <ContactButton />
                            </div>
                        </div>
                    </div>
                    {/* ستون ۳: لاگ‌های سیستم */}
                    <div style={{ flex: isLargeScreen ? 1 : 'none' }}>

                        {/* 🔥🔥🔥 هدر لاگ‌ها و دکمه‌های جدید 🔥🔥🔥 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={neonHeaderStyle}>
                                <Clock size={24} /> لاگ‌های سیستم
                            </h2>

                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>

                                {/* 🔥 جدید: دکمه کاربران آنلاین (بهترین جا) 🔥 */}
                                <OnlineUserIndicator
                                    count={onlineCount}
                                    isDarkMode={isDarkMode}
                                    NEON_COLOR={NEON_COLOR}
                                    NEON_GLOW_SHADOW={NEON_GLOW_SHADOW}
                                />

                                {/* دکمه پاک کردن لاگ‌ها (قبلی) */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={handleClearLogs}
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: isDarkMode ? '#444' : '#E5E7EB', color: isDarkMode ? 'white' : '#4B5563', cursor: 'pointer' }}
                                > <Trash2 size={18} /> </motion.button>
                            </div>
                        </div>
                        {/* 🔥🔥🔥 پایان هدر لاگ‌ها و دکمه‌های جدید 🔥🔥🔥 */}

                        <div
                            style={{
                                height: '30rem', overflowY: 'auto', padding: '0.5rem', borderRadius: '0.5rem',
                                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                                backgroundColor: isDarkMode ? '#0F172A' : '#F9FAFB', fontSize: '0.75rem'
                            }}
                        >
                            <AnimatePresence>
                                {logs.map((log, index) => (
                                    <motion.div
                                        key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ marginBottom: '0.5rem', color: log.owner === "System" ? '#9CA3AF' : log.owner === "User" ? '#F59E0B' : NEON_COLOR, direction: 'rtl' }}
                                    >
                                        <span style={{ fontWeight: 'bold' }}>[{log.time}]</span>
                                        <span> ({log.owner}) - </span>
                                        <span style={{ fontWeight: log.owner !== "System" ? 'bold' : 'normal' }}>{log.message}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={logEndRef} />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => { setStep("login"); setCart([]); setSelectedProduct(null); setSearch(""); setLogs([]); showToast("از سیستم خارج شدید.", "info"); }}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
                                backgroundColor: '#991B1B', color: 'white', fontWeight: 'bold',
                                marginTop: '1rem', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '0.5rem', cursor: 'pointer'
                            }}

                        > <LogOut size={20} /> خروج از پنل </motion.button>
                    </div>

                </motion.div>
            )
            }

            {/* ========================================================== */}
            {/* 🔥 اینجا: محل قرارگیری امضای شیک و نئون (Footer) */}
            {/* ========================================================== */}
            <div
                style={{
                    textAlign: 'center',
                    padding: '1rem',
                    marginTop: '2rem',
                    opacity: 0.7,
                    transition: 'opacity 0.3s ease',
                    cursor: 'default'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
            >
                <p
                    style={{
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: NEON_COLOR,
                        textShadow: NEON_GLOW_SHADOW,
                        margin: 0,
                        letterSpacing: '2px'
                    }}
                >
                    برنامه نویس و طراح: حسن رضاعرب
                </p>
                <p
                    style={{
                        fontFamily: 'sans-serif',
                        fontSize: '9px',
                        color: '#6c757d', // یا هر رنگ دیگری
                        marginTop: '0.25rem'
                    }}
                >
                    Version 1.0.0 (Cyber-Admin Panel)
                </p>
            </div>

        </div >
    );
};

export default ShopPanel;