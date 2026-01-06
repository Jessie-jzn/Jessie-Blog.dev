import React, { useEffect } from 'react';

// 1. 在这里定义 label 属性
type AdBannerProps = {
  label?: string;
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
};

const AdBanner = ({
  label,
  dataAdSlot = '4792455737',
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
}: AdBannerProps) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  return (
    <div className='w-full my-8 text-center min-h-[100px] bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-dashed border-gray-200 dark:border-gray-700 pt-2'>
      {/* 2. 如果传了 label，就显示出来 */}
      {label && (
        <div className='text-gray-400 text-xs uppercase tracking-widest mb-1'>
          {label}
        </div>
      )}

      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-9533100025276131'
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdBanner;
