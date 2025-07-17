import React, { useState, useEffect } from 'react';
import './SpeedTypingGame.css';
import TypingArea from './TypingArea';

const SpeedTypingGame = () => {
    const paragraphs = [
        "A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on. Parts of Plants: The part of the plant that developed beneath the soil is referred to as root and the part that grows outside of the soil is known as shoot. The shoot consists of stems, branches, leaves, fruits, and flowers. Plants are made up of six main parts: roots, stems, leaves, flowers, fruits, and seeds.",
        "The root is the part of the plant that grows in the soil. The primary root emerges from the embryo. Its primary function is to provide the plant stability in the earth and make other mineral salts from the earth available to the plant for various metabolic processes. There are three types of roots i.e. Tap Root, Adventitious Roots, and Lateral Root. The roots arise from the parts of the plant and not from the rhizomes roots.",
        "Stem is the posterior part that remains above the ground and grows negatively geotropic. Internodes and nodes are found on the stem. Branch, bud, leaf, petiole, flower, and inflorescence on a node are all those parts of the plant that remain above the ground and undergo negative subsoil development. The trees have brown bark and the young and newly developed stems are green. The roots arise from the parts of the plant and not from the rhizomes roots.",
        "It is the blossom of a plant. A flower is the part of a plant that produces seeds, which eventually become other flowers. They are the reproductive system of a plant. Most flowers consist of 4 main parts: sepals, petals, stamens, and carpels. The female portion of the flower is the carpels. The majority of flowers are hermaphrodites, meaning they have both male and female components. Others may consist of one of two parts and may be male or female.",
        "An aunt is a bassoon from the right perspective. As far as we can estimate, some posit the melic Myanmar to be less than kutcha. One cannot separate foods from blowzy bows. The scampish closet reveals itself as a sclerous llama to those who look. A hip is the skirt of a peak. Some hempy laundries are thought of simply as orchids. A gum is a trumpet from the right perspective. A freebie flight is a wrench of the mind. Some posit the croupy."
    ];

    const [typingText, setTypingText] = useState([]);
    const [inpFieldValue, setInpFieldValue] = useState('');
    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);

    const loadParagraph = () => {
        const ranIndex = Math.floor(Math.random() * paragraphs.length);
        const inputField = document.getElementsByClassName('input-field')[0];
        document.addEventListener("keydown", () => inputField && inputField.focus());

        const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
            <span
                key={index}
                className={`char ${index === 0 ? 'active' : ''}`}
                style={{ color: letter !== ' ' ? 'black' : 'transparent' }}
            >
                {letter !== ' ' ? letter : '_'}
            </span>
        ));

        setTypingText(content);
        setInpFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setIsTyping(false);
        setTimeLeft(maxTime);
    };

    const handleKeyDown = (event) => {
        const characters = document.querySelectorAll('.char');
        if (event.key === 'Backspace' && charIndex > 0 && charIndex <= characters.length && timeLeft > 0) {
            const prevChar = characters[charIndex - 1];
            prevChar.classList.remove('correct', 'wrong');
            characters[charIndex].classList.remove('active');
            prevChar.classList.add('active');
            setCharIndex(charIndex - 1);
            if (prevChar.classList.contains('wrong')) {
                setMistakes(mistakes - 1);
            }

            updateWPMCPM(charIndex - 1, mistakes);
        }
    };

    const updateWPMCPM = (index, mistakeCount) => {
        const timePassed = maxTime - timeLeft;
        let wpm = Math.round(((index - mistakeCount) / 5) / (timePassed / 60));
        let cpm = Math.round((index - mistakeCount) * (60 / timePassed));
        if (!isFinite(wpm)) wpm = 0;
        if (!isFinite(cpm)) cpm = 0;
        setWPM(wpm);
        setCPM(cpm);
    };

    const initTyping = (event) => {
        const characters = document.querySelectorAll('.char');
        const typedChar = event.target.value.slice(-1); // only latest char
        setInpFieldValue(event.target.value);

        if (charIndex < characters.length && timeLeft > 0) {
            let currentChar = characters[charIndex].innerText;
            if (currentChar === '_') currentChar = ' ';

            if (!isTyping) {
                setIsTyping(true);
            }

            if (typedChar === currentChar) {
                characters[charIndex].classList.add('correct');
            } else {
                characters[charIndex].classList.add('wrong');
                setMistakes((prev) => prev + 1);
            }

            characters[charIndex].classList.remove('active');
            if (charIndex + 1 < characters.length) {
                characters[charIndex + 1].classList.add('active');
            }

            const newIndex = charIndex + 1;
            setCharIndex(newIndex);
            updateWPMCPM(newIndex, mistakes);
        } else {
            setIsTyping(false);
        }
    };

    const resetGame = () => {
        const characters = document.querySelectorAll('.char');
        characters.forEach(span => span.classList.remove("correct", "wrong", "active"));
        loadParagraph();
        setWPM(0);
        setCPM(0);
    };

    useEffect(() => {
        loadParagraph();
    }, []);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                updateWPMCPM(charIndex, mistakes);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTyping(false);
        }
        return () => clearInterval(interval);
    }, [isTyping, timeLeft]);

    return (
        <div className="container">
            <input
                type="text"
                className="input-field"
                value={inpFieldValue}
                onChange={initTyping}
                onKeyDown={handleKeyDown}
            />
            <TypingArea
                typingText={typingText}
                inpFieldValue={inpFieldValue}
                timeLeft={timeLeft}
                mistakes={mistakes}
                WPM={WPM}
                CPM={CPM}
                initTyping={initTyping}
                handleKeyDown={handleKeyDown}
                resetGame={resetGame}
            />
        </div>
    );
};

export default SpeedTypingGame;
