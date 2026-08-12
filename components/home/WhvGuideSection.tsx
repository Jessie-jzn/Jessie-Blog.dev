/** 渲染 WHV 流程入口与可配置的指南文章栏目。 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import SectionHeader from '@/components/common/SectionHeader';
import GuidePostCards from '@/components/home/GuidePostCards';
import HomePageSection from '@/components/home/HomePageSection';
import * as Types from '@/lib/type';

const whvSteps = [
  { title: '行前', link: '/tag/preparation', desc: '签证' },
  { title: '落地', link: '/tag/landing', desc: '卡 / 税号' },
  { title: '工作', link: '/tag/jobs', desc: '求职' },
  { title: '离境', link: '/tag/tax', desc: '退税' },
];

interface WhvGuideSectionProps {
  posts: Types.Post[];
  sectionId?: string;
  title?: string;
  subtitle?: string;
  editorialKicker?: string;
  intro?: ReactNode;
}

const WhvGuideSection = ({
  posts,
  sectionId = 'whv-guides',
  title,
  subtitle,
  editorialKicker,
  intro,
}: WhvGuideSectionProps) => {
  const { t, i18n } = useTranslation('home');

  const ttl = title ?? t('landing.whv.title');
  const sub = subtitle ?? t('landing.whv.subtitle');
  const kicker = editorialKicker ?? t('landing.whv.kicker');
  const defaultIntro = (
    <p>{t('landing.whv.intro')}</p>
  );

  const stepTitles =
    i18n.language === 'en'
      ? ['Prep', 'Landing', 'Jobs', 'Exit']
      : whvSteps.map((s) => s.title);
  const stepDescs =
    i18n.language === 'en'
      ? ['Visa', 'Cards / TFN', 'Finding work', 'Tax / depart']
      : whvSteps.map((s) => s.desc);

  return (
    <HomePageSection id={sectionId} aria-label={t('landing.aria.whv')}>
      <div className='mb-8 border-b border-line pb-8 md:mb-10 md:pb-10'>
        <SectionHeader
          variant='editorial'
          editorialKicker={kicker}
          title={ttl}
          subtitle={sub}
          readMoreLink='/whv'
        />
      </div>

      <div className='mb-10 grid grid-cols-2 gap-x-6 md:mb-12 md:grid-cols-4'>
        {whvSteps.map((step, i) => (
          <Link
            key={step.link}
            href={step.link}
            className='editorial-focus group border-t border-line py-5 transition-colors duration-300 hover:border-primaryStrong focus-visible:border-primaryStrong'
          >
            <div className='flex items-start gap-3'>
              <span className='text-xs font-medium tabular-nums tracking-[0.12em] text-primaryStrong'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className='text-sm font-semibold text-ink transition-colors group-hover:text-primaryStrong'>
                  {stepTitles[i] ?? step.title}
                </h3>
                <p className='mt-1 text-xs leading-5 text-subtle'>
                  {stepDescs[i]}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <GuidePostCards posts={posts} />
    </HomePageSection>
  );
};

export default WhvGuideSection;
