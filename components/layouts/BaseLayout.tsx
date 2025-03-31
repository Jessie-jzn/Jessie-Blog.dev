import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShareButtons } from "@/components/ShareButtons";
import SiteConfig from "@/site.config";
import { useTranslation } from "next-i18next";

interface BaseLayoutProps {
  children: React.ReactNode;
  headerProps?: any;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isFull={false} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <div className="fixed left-4 top-1/3 z-50">
        <ShareButtons
          url={SiteConfig.siteUrl}
          title={t("site.title")}
          description={t("site.description")}
        />
      </div>
    </div>
  );
};

export default BaseLayout;
