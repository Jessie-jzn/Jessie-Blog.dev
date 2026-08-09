/** 使用 home i18n 文案展示首页个人故事与补充说明。 */
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
      <div className='grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8 md:grid-cols-[minmax(0,6rem)_minmax(0,1fr)] md:gap-12'>
        <div className='border-t border-line pt-3'>
          <p className='max-w-[5.5rem] text-[11px] font-semibold leading-snug tracking-wide text-primaryStrong sm:text-xs'>
            01
          </p>
        </div>
        <div
          className={`max-w-2xl space-y-5 ${personaBodyClasses} text-ink`}
        >
          <p>{t('landing.persona.p1')}</p>
          <p>{t('landing.persona.p2')}</p>
          <p>{t('landing.persona.p3')}</p>
          {aside ? (
            <p className='border-t border-line pt-5 text-subtle'>
              {aside}
            </p>
          ) : null}
        </div>
      </div>
    </HomePageSection>
  );
};

export default HomePersonaStory;
