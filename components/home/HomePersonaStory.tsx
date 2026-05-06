import { useTranslation } from 'next-i18next';
import HomePageSection from '@/components/home/HomePageSection';

/** 正文排版与 Hero 段落一致：text-sm sm:text-[15px] · leading-[1.75] */
const personaBodyClasses =
  'text-sm sm:text-[15px] leading-[1.75] whitespace-pre-line font-normal';

const HomePersonaStory = () => {
  const { t } = useTranslation('home');

  const aside = t('landing.persona.aside');

  return (
    <HomePageSection aria-label={t('landing.aria.persona')}>
      <div className='grid gap-8 md:grid-cols-[minmax(0,8rem)_1fr] md:gap-12 items-start'>
        <div className='md:pt-0.5'>
          <p className='text-[11px] sm:text-xs font-semibold tracking-wide text-[#62BFAD] leading-snug max-w-[7rem] sm:max-w-none'>
            {t('landing.persona.sectionEyebrow')}
          </p>
          <span
            className='mt-2 block h-px w-10 max-w-full bg-[#62BFAD]/40'
            aria-hidden
          />
        </div>
        <div className={`space-y-5 max-w-2xl ${personaBodyClasses} text-neutral-800 dark:text-neutral-200`}>
          <p>{t('landing.persona.p1')}</p>
          <p>{t('landing.persona.p2')}</p>
          <p>{t('landing.persona.p3')}</p>
          {aside ? (
            <p className='text-neutral-600 dark:text-neutral-400 border-l-2 border-[#62BFAD]/55 pl-5 md:pl-6'>
              {aside}
            </p>
          ) : null}
        </div>
      </div>
    </HomePageSection>
  );
};

export default HomePersonaStory;
