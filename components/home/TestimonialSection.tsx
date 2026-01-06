import Image from 'next/image';
import { useTranslation } from 'next-i18next';

const TestimonialSection = () => {
  const { t } = useTranslation('home');

  const testimonials = [
    {
      image: 'https://img.jessieontheroad.com/IMG_1083.jpeg',
      content: t('testimonials.reviews.1.content'),
      author: t('testimonials.reviews.1.author'),
    },
    {
      image:
        'https://img.jessieontheroad.com/A16EBBE4-6ADD-4B4D-BEAA-22D92CB54C05.jpeg',
      content: t('testimonials.reviews.2.content'),
      author: t('testimonials.reviews.2.author'),
    },
    {
      image: 'https://img.jessieontheroad.com/IMG_1575.jpeg',
      content: t('testimonials.reviews.3.content'),
      author: t('testimonials.reviews.3.author'),
    },
  ];

  return (
    <section className='py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900'>
      <div className='container mx-auto px-4'>
        <h2 className='text-2xl md:text-3xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100'>
          {t('testimonials.title')}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className='bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300 group'
            >
              {/* 头像 */}
              <div className='relative w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md group-hover:scale-110 transition-transform'>
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  fill
                  className='object-cover'
                  sizes='100px'
                />
              </div>

              {/* 引号图标 */}
              <div className='mb-4 text-[#62BFAD]/30 flex justify-center'>
                <svg
                  width='30'
                  height='30'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H16.017C15.4647 18 15.017 18.4477 15.017 19V21H14.017ZM5.01691 21L5.01691 18C5.01691 16.8954 5.91234 16 7.01691 16H10.0169C10.5692 16 11.0169 15.5523 11.0169 15V9C11.0169 8.44772 10.5692 8 10.0169 8H6.01691C5.46462 8 5.01691 7.55228 5.01691 7V3H10.0169C11.6738 3 13.0169 4.34315 13.0169 6V15C13.0169 16.6569 11.6738 18 10.0169 18H7.01691C6.46462 18 6.01691 18.4477 6.01691 19V21H5.01691Z' />
                </svg>
              </div>

              <div className='text-gray-600 dark:text-gray-300 italic mb-6 text-sm leading-relaxed'>
                &ldquo;{testimonial.content}&rdquo;
              </div>

              <div className='font-bold text-gray-900 dark:text-gray-100'>
                {testimonial.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
