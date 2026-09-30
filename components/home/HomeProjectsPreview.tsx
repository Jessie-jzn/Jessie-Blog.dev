/** 展示公开开源项目和带查询日期的星标快照。 */
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { FiGithub, FiStar, FiArrowUpRight } from 'react-icons/fi';
import { OPEN_SOURCE_PROJECTS, OPEN_SOURCE_STARS_AS_OF, GITHUB_PROFILE_URL } from '@/lib/home/openSourceProjects';
import HomePageSection from '@/components/home/HomePageSection';

export default function HomeProjectsPreview() {
  const { t } = useTranslation('home');

  return (
    <HomePageSection id='open-source' aria-label={t('landing.projects.aria')} tone='muted'>
      <div className='flex flex-wrap items-end justify-between gap-5'>
        <div>
          <h2 className='text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-[1.9rem]'>
            {t('landing.projects.eyebrow')}
          </h2>
          <p className='mt-1.5 text-base font-medium text-ink'>
            {t('landing.projects.title')}
          </p>
        </div>
        <a
          href={GITHUB_PROFILE_URL} target='_blank' rel='noreferrer'
          className='editorial-focus inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-md text-xs font-medium text-primaryStrong transition hover:underline focus-visible:outline-ink active:translate-y-px motion-reduce:transform-none'
        >
          <FiGithub aria-hidden='true' className='h-4 w-4' /> Jessie-jzn <FiArrowUpRight aria-hidden='true' />
        </a>
      </div>

        <div className='mt-7 grid gap-4 md:grid-cols-2'>
          {OPEN_SOURCE_PROJECTS.map((project) => (
              <article
                key={project.id}
                className='flex min-w-0 gap-4 rounded-xl border border-line bg-surface p-4 sm:gap-5 sm:p-5'
              >
                <div aria-hidden='true' className='relative w-20 shrink-0 overflow-hidden rounded-lg bg-primarySoft sm:w-28 lg:w-36'>
                  <Image src={project.image} alt='' fill sizes='(max-width: 639px) 80px, (max-width: 1023px) 112px, 144px' className='object-cover' />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='break-all font-mono text-[10px] leading-5 text-primaryStrong'>{project.repository}</p>
                    <span className='inline-flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] text-subtle'><FiStar aria-hidden='true' />{project.stars}</span>
                  </div>
                  <h3 className='mt-2 text-base font-medium text-ink'>{t(`landing.openSource.items.${project.id}.title`)}</h3>
                  <p className='mt-2 text-xs leading-6 text-subtle'>{t(`landing.openSource.items.${project.id}.description`)}</p>
                  <div className='mt-4 flex flex-wrap items-center justify-between gap-2'>
                    <span className='rounded-full bg-primarySoft px-2.5 py-1 text-[10px] text-primaryStrong'>{project.language || t('landing.openSource.guide')}</span>
                    <a href={`${GITHUB_PROFILE_URL}/${project.repository}`} target='_blank' rel='noreferrer' className='editorial-focus inline-flex min-h-11 items-center gap-1 rounded-md text-xs font-medium text-primaryStrong hover:underline'>
                      {t('landing.openSource.source')} <FiArrowUpRight aria-hidden='true' />
                    </a>
                  </div>
                </div>
              </article>
          ))}
        </div>
      <p className='mt-4 text-right text-[10px] text-subtle'>{t('landing.openSource.starsAsOf', { date: OPEN_SOURCE_STARS_AS_OF })}</p>
    </HomePageSection>
  );
}
