import React from "react";
import Image from "next/image";
import SiteConfig from "@/site.config";
import SocialContactIcon from "@/components/SocialContactIcon";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

const Sidebar = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 text-center flex items-center flex-col">
        <div className="relative w-20 h-20 mx-auto">
          <Image
            src={
              `${SiteConfig.imageDomainUrl}/avatar.png` ||
              "https://www.dropbox.com/scl/fi/w25dass9uvsie54sp61gp/avatar.png?rlkey=822a5h3lo1jh120dr0q53i9zg&st=rzw9h6j0&dl=0"
            }
            alt="Author avatar"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{SiteConfig.author}</h2>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {SiteConfig.summary}
        </p>

        {/* 统计信息 */}
        <div className="flex justify-center gap-4 mt-3 mb-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">120</div>
            <div className="text-xs text-gray-500">文章</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">1.2k</div>
            <div className="text-xs text-gray-500">访问</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">89</div>
            <div className="text-xs text-gray-500">订阅</div>
          </div>
        </div>
        {/* <SocialContactIcon /> */}
        <NewsletterSubscribe />
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
