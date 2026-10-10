import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from './HeroMotion.module.css';

/** Reserve full text width, retaining readable static content before hydration. */
export default function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const characters = Array.from(text);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(characters.length);

  useEffect(() => {
    const length = Array.from(text).length;
    if (reduceMotion !== false) {
      setVisible(length);
      return;
    }
    setVisible(0);
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      let count = 0;
      interval = setInterval(() => {
        count += 1;
        setVisible(Math.min(count, length));
        if (count >= length) clearInterval(interval);
      }, 60);
    }, delay * 1000);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, delay, reduceMotion]);

  return (
    <span aria-label={text}>
      <span aria-hidden='true'>
        {characters.map((character, index) => (
          <span key={index} className={styles.character}
            data-caret={visible > 0 && visible < characters.length && index === visible - 1}
            style={{ visibility: index < visible ? 'visible' : 'hidden' }}>
            {character}
          </span>
        ))}
      </span>
    </span>
  );
}
