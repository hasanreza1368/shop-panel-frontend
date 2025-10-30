import { useRef } from "react";
import { Howl } from "howler";

const useButtonSounds = (hoverSrc, clickSrc) => {
    const hoverSound = useRef(new Howl({ src: [hoverSrc], volume: 0.5 }));
    const clickSound = useRef(new Howl({ src: [clickSrc], volume: 0.5 }));

    const playHover = () => {
        hoverSound.current.stop();
        hoverSound.current.play();
    };

    const playClick = () => {
        clickSound.current.stop();
        clickSound.current.play();
    };

    return { playHover, playClick };
};

export default useButtonSounds;
