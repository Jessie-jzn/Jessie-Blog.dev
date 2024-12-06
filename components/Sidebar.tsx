import React from "react";
import Image from "next/image";
import SiteConfig from "@/site.config";
import SocialIcon from "@/components/SocialIcon";

const Sidebar = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src={SiteConfig.siteLogo}
          alt={SiteConfig.author}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h3 className="font-semibold">{SiteConfig.author}</h3>
            <p className="text-sm text-gray-500">{SiteConfig.summary}</p>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">120</div>
              <div className="text-xs text-gray-500">文章</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">1.2k</div>
              <div className="text-xs text-gray-500">访问</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">89</div>
              <div className="text-xs text-gray-500">订阅</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <SocialIcon kind="github" href={SiteConfig.github} size={6} />
        <SocialIcon kind="linkedin" href={SiteConfig.linkedin} size={6} />
        <SocialIcon kind="instagram" href={SiteConfig.instagram} size={6} />
        <SocialIcon kind="x" href={SiteConfig.twitter} size={6} />
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
