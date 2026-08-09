import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { PROJECTS } from '@/lib/projects';
import HomePageSection from '@/components/home/HomePageSection';

export default function HomeProjectsPreview() {
  const { t } = useTranslation('home');

  return (
    <HomePageSection aria-label={t('landing.projects.aria')}>
      <div className='flex flex-wrap items-end justify-between gap-5'>
        <div>
          <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-primaryStrong'>
            {t('landing.projects.eyebrow')}
          </p>
          <h2 className='mt-3 text-2xl font-semibold tracking-tight text-ink'>
            {t('landing.projects.title')}
          </h2>
          <p className='mt-2 max-w-xl text-sm leading-relaxed text-subtle'>
            {t('landing.projects.description')}
          </p>
        </div>
        <Link
          href='/projects'
          className='editorial-focus inline-flex min-h-11 items-center whitespace-nowrap rounded-md text-sm font-medium text-primaryStrong transition hover:underline active:translate-y-px motion-reduce:transform-none'
        >
          {t('landing.projects.allProjects')}
        </Link>
      </div>

      <div className='mt-8 divide-y divide-line border-y border-line'>
        {PROJECTS.map((project, index) => (
          <article
            key={project.id}
            className='grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-3 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_minmax(12rem,0.45fr)] sm:items-start sm:gap-x-8'
          >
            <p className='text-xs font-semibold tabular-nums tracking-[0.16em] text-primaryStrong'>
              {String(index + 1).padStart(2, '0')}
            </p>
            <div>
              <h3 className='text-base font-semibold text-ink'>{project.title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-subtle'>
                {project.summary}
              </p>
            </div>
            <p className='col-start-2 text-xs font-medium uppercase leading-relaxed tracking-[0.1em] text-subtle sm:col-start-3 sm:text-right'>
              {project.role}
            </p>
          </article>
        ))}
      </div>
    </HomePageSection>
  );
}
