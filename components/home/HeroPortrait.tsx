import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import styles from './HeroMotion.module.css';

export default function HeroPortrait() {
  const { t } = useTranslation('home');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(true);
  const x = useSpring(0, { stiffness: 100, damping: 22 });
  const y = useSpring(0, { stiffness: 100, damping: 22 });
  const rotate = useSpring(0, { stiffness: 100, damping: 22 });
  const active = inView && pageVisible && !reduceMotion;

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!active) { x.set(0); y.set(0); rotate.set(0); }
  }, [active, x, y, rotate]);

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    x.set(horizontal * 7);
    y.set(vertical * 4);
    rotate.set(horizontal * 2);
  };

  return (
    <div ref={ref} className={styles.portrait} onPointerMove={followPointer}
      onPointerLeave={() => { x.set(0); y.set(0); rotate.set(0); }}>
      <motion.div className={styles.pointerLayer} style={{ x, y, rotate }}>
        <div className={styles.breathing} style={{ animationPlayState: active ? 'running' : 'paused' }}>
          <Image src='/images/home/jessie-editorial.webp' alt={t('landing.hero.portraitAlt')} fill priority sizes='(max-width: 767px) 100vw, (max-width: 1152px) 50vw, 544px' className='object-contain' />
          <div className={styles.blink} data-active={active} aria-hidden='true' style={{ animationPlayState: active ? 'running' : 'paused' }}>
            <Image src='/images/home/jessie-blink.webp' alt='' fill sizes='(max-width: 767px) 100vw, (max-width: 1152px) 50vw, 544px' className='object-contain' />
          </div>
        </div>
      </motion.div>

    </div>
  );
}
