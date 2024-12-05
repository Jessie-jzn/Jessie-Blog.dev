import React from 'react';
import Image from 'next/image';
import SiteConfig from '@/site.config';
import SocialIcon from '@/components/SocialIcon';

const Sidebar = () => {
  return (
    <div className="sticky top-[120px] bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src={SiteConfig.siteLogo}
          alt={SiteConfig.author}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold">{SiteConfig.author}</h3>
          <p className="text-sm text-gray-500">{SiteConfig.summary}</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <SocialIcon kind="github" href={SiteConfig.github} size={6} />
        <SocialIcon kind="twitter" href={SiteConfig.twitter} size={6} />
        <SocialIcon kind="linkedin" href={SiteConfig.linkedin} size={6} />
      </div>
    </div>
  );
};

export default React.memo(Sidebar); 