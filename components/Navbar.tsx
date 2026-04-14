import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SiteConfig from '@/site.config';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SpeedInsights } from '@vercel/speed-insights/next';

const NavMobile = dynamic(() => import('@/components/NavMobile'));
const ThemeSwitch = dynamic(() => import('@/components/ThemeSwitch'));
const LanguageSwitch = dynamic(() => import('@/components/LanguageSwitch'));

interface NavbarProp {
  btnColor?: string;
  className?: string;
  isFull?: boolean;
  currentTheme?: 'light' | 'dark';
}

const Navbar = ({
  btnColor,
  className,
  currentTheme = 'light',
  isFull = false,
}: NavbarProp) => {
  const { t } = useTranslation('common');
  const [NavbarTitle, setNavbarTitle] = useState<string | undefined>(undefined);
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isFull) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isFull]);

  const navigationLinks = useMemo(
    () => [
      { id: 'home', href: '/', title: t('nav.home') },
      { id: 'travel', href: '/travel', title: t('nav.travel') },
      { id: 'whv', href: '/whv', title: t('nav.whv') },
      { id: 'life', href: '/life', title: t('nav.life') },
      { id: 'technical', href: '/technical', title: t('nav.technical') },
      { id: 'about', href: '/about', title: t('nav.about') },
      {
        id: 'tools',
        href: '/tools',
        title: t('nav.tools.title'),
        children: [
          { id: 'resume', href: '/tools/resume', title: t('nav.tools.resume') },
        ],
      },
    ],
    [t]
  );

  const menuItemVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { scale: 1.1 },
    active: { scale: 1.2 },
  };

  const isActiveLink = useCallback(
    (href: string): boolean => {
      if (href === '/') {
        return router.asPath === '/';
      }
      const basePath = href.replace(/^\/|\/$/g, '');
      const currentPath = router.asPath.replace(/^\/|\/$/g, '');
      return (
        currentPath === basePath ||
        currentPath.startsWith(`${basePath}/`) ||
        currentPath.startsWith(`${basePath}-`) ||
        currentPath.includes(`/${basePath}-`)
      );
    },
    [router]
  );

  useEffect(() => {
    setNavbarTitle(SiteConfig.headerTitle);
  }, []);

  const showSolidBg = !isFull || scrolled;

  // 滚动后统一用深色文字；未滚动的沉浸式模式跟随 currentTheme
  const textColor = showSolidBg
    ? 'text-gray-900 dark:text-gray-100'
    : currentTheme === 'dark'
      ? 'text-gray-100'
      : 'text-gray-900';

  const underlineColor = showSolidBg
    ? 'bg-slate-950 dark:bg-slate-50'
    : currentTheme === 'dark'
      ? 'bg-slate-50'
      : 'bg-slate-950';

  return (
    <motion.div
      initial={false}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={[
        'fixed top-0 left-0 w-full z-[999]',
        'transition-colors duration-300',
        showSolidBg
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className='max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3 xs:px-3 xs:py-2'>
        <Link href='/' aria-label={NavbarTitle}>
          <div className='flex items-center'>
            <div className='mr-3'>
              <Image
                src='https://img.jessieontheroad.com/avatar.png'
                alt='avatar'
                width={192}
                height={192}
                quality={75}
                priority
                className='h-10 w-10 rounded-full xs:h-8 xs:w-8'
              />
            </div>
            <div className={`text-xl font-bold xs:text-sm ${textColor}`}>
              {NavbarTitle}
            </div>
          </div>
        </Link>

        <div className='flex items-center space-x-5 leading-5 sm:space-x-6'>
          {navigationLinks.map((link) => (
            <motion.div
              key={link.id}
              className={`relative group hidden sm:block font-medium text-sm ${textColor}`}
              variants={menuItemVariants}
              initial='initial'
              animate={isActiveLink(link.href || '') ? 'active' : 'initial'}
              whileHover='hover'
            >
              {link.children ? (
                <span className='cursor-default'>{link.title}</span>
              ) : (
                <Link href={link.href}>{link.title}</Link>
              )}

              {!link.children && (
                <motion.div
                  className={`absolute bottom-[-4px] left-0 right-0 h-[2px] rounded ${underlineColor}`}
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: isActiveLink(link.href || '') ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {link.children && (
                <div className='absolute top-full left-0 mt-1 bg-white text-gray-900 dark:text-gray-100 dark:bg-slate-900 shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200 ease-in-out z-50'>
                  <ul className='min-w-[160px] py-2 px-0'>
                    {link.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm'
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}

          <motion.div
            initial='initial'
            whileHover='hover'
            variants={menuItemVariants}
            className='cursor-pointer'
          >
            <ThemeSwitch />
          </motion.div>

          <motion.div
            initial='initial'
            whileHover='hover'
            variants={menuItemVariants}
            className='cursor-pointer'
          >
            <LanguageSwitch btnColor={btnColor} />
          </motion.div>

          <div className='cursor-pointer block sm:hidden'>
            <NavMobile />
          </div>
          <Analytics />
          <SpeedInsights />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
