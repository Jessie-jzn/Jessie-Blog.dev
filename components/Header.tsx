import SiteConfig from "../site.config";
import menuList from "@/data/menuList";
import Link from "./Link";
import MobileNav from "./MobileNav";
import ThemeSwitch from "./ThemeSwitch";
import Image from "next/image";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={SiteConfig.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Image
                src={require("../data/images/avatar.png")}
                alt="avatar"
                width={192}
                height={192}
                className="h-16 w-16 rounded-full"
              />
            </div>
            {typeof SiteConfig.headerTitle === "string" ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {SiteConfig.headerTitle}
              </div>
            ) : (
              SiteConfig.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {menuList
          .filter((link) => link.href !== "/")
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
            >
              {link.title}
            </Link>
          ))}

        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
