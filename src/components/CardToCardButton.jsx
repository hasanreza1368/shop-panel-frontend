import React from "react";
import { motion } from "framer-motion";
import { Banknote } from "lucide-react";
import { Howl } from "howler";
import useButtonSounds from "./useButtonSounds"; // اگر جدا ساختی

const CardToCardButton = ({ onClick, disabled }) => {
    const { playHover, playClick } = useButtonSounds(
        "/sounds/card-hover.mp3",
        "/sounds/card-click.mp3"
    );

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={playHover}
            onClick={() => { playClick(); onClick(); }}
            disabled={disabled}
            style={{
                width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
                backgroundColor: "#059669", color: 'white', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
                position: 'relative', overflow: 'hidden',
            }}
        >
            <motion.div
                animate={disabled ? {} : { x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{
                    position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    opacity: 0.8,
                    pointerEvents: 'none',
                }}
            />

            <Banknote size={20} style={{ zIndex: 10 }} />
            <span style={{ zIndex: 10 }}>کارت به کارت</span>
        </motion.button>
    );
};

export default CardToCardButton;
