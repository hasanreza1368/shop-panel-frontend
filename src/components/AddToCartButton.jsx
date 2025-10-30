import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Howl } from "howler";

const useButtonSounds = (hoverSrc, clickSrc) => {
    const hoverSound = useRef(new Howl({ src: [hoverSrc], volume: 0.5 }));
    const clickSound = useRef(new Howl({ src: [clickSrc], volume: 0.5 }));

    const playHover = () => { hoverSound.current.stop(); hoverSound.current.play(); };
    const playClick = () => { clickSound.current.stop(); clickSound.current.play(); };

    return { playHover, playClick };
};

const AddToCartButton = ({ handleAddToCart, isLoading, selectedProduct }) => {
    const { playHover, playClick } = useButtonSounds(
        "/sounds/button-hover.mp3",
        "/sounds/button-click.mp3"
    );

    const disabled = isLoading || !selectedProduct;

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={playHover}
            onClick={() => { if (!disabled) { playClick(); handleAddToCart(); } }}
            disabled={disabled}
            style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.6rem",
                background: "linear-gradient(135deg, #059669, #10B981)",
                color: "white",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                position: "relative",
                overflow: "hidden",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                boxShadow: "0 0 12px rgba(16,185,129,0.6), 0 0 25px rgba(5,150,105,0.6)",
                textShadow: "0 0 5px #fff",
            }}
        >
            <ShoppingCart size={20} />
            افزودن به سبد

            {/* ⭐ ستاره‌های درخشان */}
            <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle, rgba(255,255,255,0.35) 2px, transparent 3px)",
                    backgroundSize: "16px 16px",
                    pointerEvents: "none",
                }}
            />

            {/* نور متحرک */}
            <motion.div
                animate={{ x: ["-120%", "120%"] }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    pointerEvents: "none",
                    filter: "blur(6px)",
                }}
            />
        </motion.button>
    );
};

export default AddToCartButton;
