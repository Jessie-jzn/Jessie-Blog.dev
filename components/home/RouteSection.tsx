import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/common/SectionHeader';
import { useTranslation } from 'next-i18next';

const RouteSection = () => {
  const { t } = useTranslation('home');

  const routeCards = [
    {
      href: '/travel/classic-city',
      image: 'https://img.jessieontheroad.com/IMG_0482.jpeg',
      titleKey: 'routes.classicCity.title',
      descriptionKey: 'routes.classicCity.description',
    },
    {
      href: '/travel/nature',
      image: 'https://img.jessieontheroad.com/IMG_1177.jpeg',
      titleKey: 'routes.nature.title',
      descriptionKey: 'routes.nature.description',
    },
    {
      href: '/travel/family',
      image: 'https://img.jessieontheroad.com/IMG_4648.jpeg',
      titleKey: 'routes.family.title',
      descriptionKey: 'routes.family.description',
    },
    {
      href: '/travel/adventure',
      image: 'https://img.jessieontheroad.com/DSC03146.jpeg',
      titleKey: 'routes.adventure.title',
      descriptionKey: 'routes.adventure.description',
    },
  ];

  return (
    <section className='py-16 bg-white dark:bg-gray-950'>
      <div className='container mx-auto px-4'>
        <SectionHeader
          title={t('routes.title')}
          subtitle={t('routes.subtitle')}
          readMoreLink='/routes'
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {routeCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className='group block relative rounded-2xl overflow-hidden aspect-[4/5]'
            >
              {/* 图片层 */}
              <Image
                src={card.image}
                alt={t(card.titleKey)}
                fill
                className='object-cover transform group-hover:scale-110 transition-transform duration-700'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
              />

              {/* 遮罩层 (Hover变深) */}
              <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300' />

              {/* 文字内容层 */}
              <div className='absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent'>
                <h3 className='text-xl font-bold text-white mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                  {t(card.titleKey)}
                </h3>
                {/* 描述文字 (Hover上浮显示) */}
                <div className='text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0'>
                  {t(card.descriptionKey)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RouteSection;
