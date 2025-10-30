// ContactButton.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Howl } from "howler";
import ContactPopup from "./ContactPopup"; // مسیر به فایل پاپ‌آپ

const useButtonSounds = (hoverSrc, clickSrc) => {
    const hoverSound = React.useRef(new Howl({ src: [hoverSrc], volume: 0.5 }));
    const clickSound = React.useRef(new Howl({ src: [clickSrc], volume: 0.5 }));

    const playHover = () => { hoverSound.current.stop(); hoverSound.current.play(); };
    const playClick = () => { clickSound.current.stop(); clickSound.current.play(); };

    return { playHover, playClick };
};

const ContactButton = () => {
    const [showContact, setShowContact] = useState(false);
    const { playHover, playClick } = useButtonSounds(
        "/sounds/button-hover.mp3",
        "/sounds/button-click.mp3"
    );

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={playHover}
                onClick={() => { playClick(); setShowContact(true); }}
                style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '0.7rem',
                    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 0 15px rgba(109, 40, 217, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    fontSize: '1rem',
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <Sparkles size={22} />
                ارتباط با ما

                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(circle, rgba(255,255,255,0.4) 2px, transparent 3px)`,
                        backgroundSize: "18px 18px",
                        pointerEvents: "none"
                    }}
                />
            </motion.button>

            <ContactPopup show={showContact} onClose={() => setShowContact(false)} />
        </>
    );
};

export default ContactButton;
