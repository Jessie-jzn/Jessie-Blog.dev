"use client";
import React from "react";
import Link from "next/link";
import SiteConfig from "@/site.config";
import SocialContactIcon from "@/components/SocialContactIcon";

const Footer: React.FC = () => {
  return (
    <div className="bg-[#bec088] box-border flex flex-col p-10 xs:p-4 items-center w-full border-[#E8E8EA] dark:border-zinc-900 dark:bg-gray-950">
      <div className="mt-16 flex flex-col items-center xs:mt-4">
        <SocialContactIcon
          prop={{ className: "mb-3 flex space-x-4", theme: "white" }}
        />
        <div className="mb-2 flex space-x-2 text-sm text-white dark:text-gray-400">
          © {new Date().getFullYear()}
          {` • `} Built with {SiteConfig.author} &#128293;{" "}
        </div>
        <div className="mb-8 text-sm text-white dark:text-gray-400">
          <Link href="/">{SiteConfig.title}</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
