/** 简洁展示公开开发经历与技术方向，链接到个人介绍。 */
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { FiCode, FiBriefcase, FiMonitor, FiArrowRight } from 'react-icons/fi';
import HomePageSection from '@/components/home/HomePageSection';
import HomeSectionHeading from '@/components/home/HomeSectionHeading';

const journey = [
  { id: 'frontend', Icon: FiCode },
  { id: 'whv', Icon: FiBriefcase },
  { id: 'ai', Icon: FiMonitor },
] as const;
const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Agents', 'RAG'];

export default function HomeAboutPreview() {
  const { t } = useTranslation('home');

  return (
    <HomePageSection id='home-about' aria-label={t('landing.profile.title')}>
      <HomeSectionHeading display='A LITTLE ABOUT ME' title={t('landing.profile.title')} />
      <div className='grid gap-8 md:grid-cols-[0.65fr_1.5fr_1fr] md:items-center'>
        <div className='border-line md:border-r md:pr-6'>
          <p className='text-5xl font-medium tracking-tight text-primaryStrong'>8<span className='text-3xl'>+</span></p>
          <p className='mt-2 text-xs text-subtle'>{t('landing.profile.experience')}</p>
        </div>
        <ol className='grid grid-cols-3 gap-3'>
          {journey.map(({ id, Icon }, index) => (
            <li key={id} className='relative pr-3'>
              <Icon aria-hidden='true' className='mb-3 h-5 w-5 text-ink' />
              <p className='text-sm font-medium text-ink'>{t(`landing.profile.journey.${id}.title`)}</p>
              <p className='mt-2 text-xs leading-6 text-subtle'>{t(`landing.profile.journey.${id}.description`)}</p>
              {index < journey.length - 1 ? <FiArrowRight aria-hidden='true' className='absolute right-0 top-1 h-3 w-3 text-primaryStrong' /> : null}
            </li>
          ))}
        </ol>
        <div className='border-line md:border-l md:pl-6'>
          <p className='mb-3 text-xs text-subtle'>{t('landing.profile.skills')}</p>
          <ul className='flex flex-wrap gap-2' aria-label={t('landing.profile.skills')}>
            {skills.map((skill) => <li key={skill} className='rounded-full bg-primarySoft px-3 py-1 text-[11px] text-primaryStrong'>{skill}</li>)}
          </ul>
          <Link href='/about' className='editorial-focus mt-4 inline-flex min-h-11 items-center rounded-md text-xs font-medium text-primaryStrong hover:underline'>
            {t('landing.profile.more')} ↗
          </Link>
        </div>
      </div>
    </HomePageSection>
  );
}
