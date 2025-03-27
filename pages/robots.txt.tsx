import { GetServerSideProps } from "next";
import SiteConfig from "@/site.config";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const content = `# *
User-agent: *
Allow: /

# Host
Host: ${SiteConfig.siteUrl}

# Sitemaps
Sitemap: ${SiteConfig.siteUrl}/sitemap.xml`;

  res.setHeader("Content-Type", "text/plain");
  res.write(content);
  res.end();

  return {
    props: {},
  };
};

export default function Robots() {
  return null;
}
