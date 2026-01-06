import Image from 'next/image';
import SectionHeader from '@/components/common/SectionHeader';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';

const GallerySection = () => {
  const { t } = useTranslation('home');

  // 直接使用 R2 直链
  const galleryImages = [
    { url: 'https://img.jessieontheroad.com/IMG_0482.jpeg', alt: 'Sunset' },
    { url: 'https://img.jessieontheroad.com/IMG_1177.jpeg', alt: 'City' },
    { url: 'https://img.jessieontheroad.com/IMG_4648.jpeg', alt: 'Beach' },
    { url: 'https://img.jessieontheroad.com/DSC03146.jpeg', alt: 'Castle' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className='py-16 bg-gray-50 dark:bg-gray-900/30'
    >
      <div className='container mx-auto px-4'>
        <SectionHeader
          title={t('gallery.title')}
          subtitle={t('gallery.subtitle')}
          readMoreLink='/gallery'
        />

        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 h-[400px] md:h-[500px]'>
          {/* 图1：左侧大图 (占2列2行) */}
          <div className='col-span-2 row-span-2 relative rounded-lg overflow-hidden group'>
            <Image
              src={galleryImages[0].url}
              alt={galleryImages[0].alt}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-700'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>

          {/* 图2：右上小图 */}
          <div className='col-span-1 row-span-1 relative rounded-lg overflow-hidden group'>
            <Image
              src={galleryImages[1].url}
              alt={galleryImages[1].alt}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-700'
              sizes='(max-width: 768px) 50vw, 25vw'
            />
          </div>

          {/* 图3：右下高图 (占1列2行) */}
          <div className='col-span-1 row-span-2 relative rounded-lg overflow-hidden group'>
            <Image
              src={galleryImages[2].url}
              alt={galleryImages[2].alt}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-700'
              sizes='(max-width: 768px) 50vw, 25vw'
            />
          </div>

          {/* 图4：右中填充图 */}
          <div className='col-span-1 row-span-1 relative rounded-lg overflow-hidden group'>
            <Image
              src={galleryImages[3].url}
              alt={galleryImages[3].alt}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-700'
              sizes='(max-width: 768px) 50vw, 25vw'
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default GallerySection;
