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
          <p className='max-w-[7rem] text-[11px] font-semibold leading-snug tracking-wide text-primaryStrong sm:max-w-none sm:text-xs'>
            {t('landing.persona.sectionEyebrow')}
          </p>
          <span
            className='mt-2 block h-px w-10 max-w-full bg-primary/40'
            aria-hidden
          />
        </div>
        <div className={`space-y-5 max-w-2xl ${personaBodyClasses} text-ink`}>
          <p>{t('landing.persona.p1')}</p>
          <p>{t('landing.persona.p2')}</p>
          <p>{t('landing.persona.p3')}</p>
          {aside ? (
            <p className='border-l-2 border-primary/60 pl-5 text-subtle md:pl-6'>
              {aside}
            </p>
          ) : null}
        </div>
      </div>
    </HomePageSection>
  );
};

export default HomePersonaStory;
