import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface Props {
  title: string;
  subtitle: string;
  readMoreLink?: string;
}

const SectionHeader = ({ title, subtitle, readMoreLink = '/blog' }: Props) => {
  const { t } = useTranslation('home');

  return (
    <div className='flex items-center justify-between mb-8 md:mb-12'>
      <div>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 border-l-4 border-[#62BFAD] pl-4'>
          {title}
        </h2>
        <div className='mt-2 pl-4 text-sm md:text-base text-gray-600 dark:text-gray-400'>
          {subtitle}
        </div>
      </div>
      <Link href={readMoreLink}>
        <button className='hidden md:inline-flex group items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full hover:bg-[#62BFAD] hover:text-white transition-all duration-300 text-sm'>
          <span className='font-medium'>{t('explore.readMore')}</span>
          <svg
            className='w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M17 8l4 4m0 0l-4 4m4-4H3'
            />
          </svg>
        </button>
      </Link>
    </div>
  );
};

export default SectionHeader;
