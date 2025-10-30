// ContactPopup.jsx
import React from "react";
import { motion } from "framer-motion";
import { Phone, Smartphone, Send } from "lucide-react";

const ContactPopup = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(0,0,0,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 999
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "linear-gradient(135deg, #1d1f4b, #2b1055, #4b0e6b)",
                    padding: "2rem",
                    width: "90%",
                    maxWidth: "380px",
                    borderRadius: "1rem",
                    position: "relative",
                    border: "4px solid transparent",
                    boxShadow: "0 0 30px #9f1eff",
                    backgroundClip: "padding-box",
                }}
            >
                <motion.div
                    animate={{ x: ["-150%", "150%"] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    style={{
                        position: "absolute", top: 0, left: 0,
                        width: "100%", height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                        pointerEvents: "none"
                    }}
                />

                <h2 style={{ color: "#fff", textAlign: "center", fontSize: "1.4rem", marginBottom: "1.5rem", fontWeight: 700 }}>
                    ارتباط با ما 💬
                </h2>

                <div style={{ color: "white", fontSize: "1rem", lineHeight: "2rem" }}>
                    <p><Phone size={20} style={{ display: "inline-block", marginLeft: 6 }} /> تلفن فروشگاه: <b>051-54191111</b></p>
                    <p><Smartphone size={20} style={{ display: "inline-block", marginLeft: 6 }} /> همراه: <b>09120000000</b></p>
                    <p><Send size={20} style={{ display: "inline-block", marginLeft: 6 }} /> تلگرام: <b>@rahgozar_ho1368</b></p>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        marginTop: "1.5rem",
                        width: "100%", padding: "0.7rem",
                        borderRadius: "0.5rem", border: "none",
                        background: "#ff4fa3", color: "white",
                        fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 0 12px #ff4fa3"
                    }}
                >
                    بستن
                </button>
            </motion.div>
        </motion.div>
    );
};

export default ContactPopup;
