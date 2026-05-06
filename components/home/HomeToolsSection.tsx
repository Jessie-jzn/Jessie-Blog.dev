import { useTranslation } from 'next-i18next';
import AffiliateToolbox from '@/components/home/AffiliateToolbox';
import HomePageSection from '@/components/home/HomePageSection';

const HomeToolsSection = () => {
  const { t } = useTranslation('home');

  return (
    <HomePageSection aria-label={t('landing.aria.tools')}>
      <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-[#62BFAD] mb-2'>
        {t('landing.tools.kicker')}
      </p>
      <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-6 max-w-lg leading-relaxed'>
        {t('landing.tools.body')}
      </p>
      <AffiliateToolbox />
    </HomePageSection>
  );
};

export default HomeToolsSection;
