import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "about"])),
    },
  };
};

const About = () => {
  const { t } = useTranslation("about");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 sm:mb-20">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            {t("hero.subtitle")}
          </p>
          <button className="w-full md:w-auto bg-black text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            {t("hero.connect")}
          </button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center xs:hidden">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            <Image
              src="https://qiniu.jessieontheroad.com/avatar.png"
              alt="Profile"
              fill
              className="rounded-full"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </div>

      {/* What to expect section */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left">
          {t("sections.findHere.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {t("sections.findHere.tech.title")}
            </h3>
            <p className="text-gray-600">{t("sections.findHere.tech.desc")}</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {t("sections.findHere.travel.title")}
            </h3>
            <p className="text-gray-600">
              {t("sections.findHere.travel.desc")}
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {t("sections.findHere.photo.title")}
            </h3>
            <p className="text-gray-600">{t("sections.findHere.photo.desc")}</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">
              {t("sections.findHere.whv.title")}
            </h3>
            <p className="text-gray-600">{t("sections.findHere.whv.desc")}</p>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left">
          {t("sections.techStack.title")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {t("sections.techStack.frontend")}
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li>React & Next.js</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Redux & React Query</li>
            </ul>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {t("sections.techStack.backend")}
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li>Node.js</li>
              <li>Express</li>
              <li>MongoDB</li>
              <li>PostgreSQL</li>
            </ul>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {t("sections.techStack.tools")}
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li>Git & GitHub</li>
              <li>VS Code</li>
              <li>Docker</li>
              <li>Figma</li>
            </ul>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {t("sections.techStack.photography")}
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li>Sony A7 III</li>
              <li>Adobe Lightroom</li>
              <li>Photoshop</li>
              <li>DaVinci Resolve</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Journey Section */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left">
          {t("sections.journey.title")}
        </h2>
        <div className="space-y-6 sm:space-y-8">
          <div>
            <p className="text-base sm:text-lg text-gray-700">
              {t("sections.journey.description")}
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              {t("sections.journey.background.title")}
            </h3>
            <ul className="space-y-3 text-base sm:text-lg text-gray-700">
              {["experience", "skills", "photography", "whv"].map((item) => (
                <li key={item} className="flex items-center">
                  <span className="w-4 h-4 bg-black rounded-full mr-3"></span>
                  {t(`sections.journey.background.${item}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div className="mb-12 sm:mb-20 bg-gray-50 rounded-lg p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center md:text-left">
          {t("sections.location.title")}
        </h2>
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          <div className="w-full md:w-2/3">
            <p className="text-base sm:text-lg text-gray-700 mb-4">
              {t("sections.location.desc")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:mt-6">
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  {t("sections.location.recent")}:
                </h3>
                <ul className="space-y-1 text-sm sm:text-base text-gray-600">
                  <li>• {t("sections.location.cities.sydney")} 悉尼, NSW</li>
                  <li>
                    • {t("sections.location.cities.goldCoast")} 黄金海岸, QLD
                  </li>
                  <li>
                    • {t("sections.location.cities.melbourne")} 墨尔本, VIC
                  </li>
                  <li>
                    • {t("sections.location.cities.byronBay")} 拜伦湾, NSW
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  {t("sections.location.next")}:
                </h3>
                <ul className="space-y-1 text-sm sm:text-base text-gray-600">
                  <li>{t("sections.location.cities.perth")} 珀斯, WA</li>
                  <li>{t("sections.location.cities.adelaide")} 阿德莱德, SA</li>
                  <li>{t("sections.location.cities.tasmania")}</li>
                  <li>{t("sections.location.cities.gbr")}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div
              className="relative aspect-[16/9] md:aspect-[4/3] w-full 
                          border border-gray-200 rounded-lg shadow-lg overflow-hidden
                          -mt-10"
            >
              <Image
                src="/images/australia-map.JPG"
                alt="Australia Travel Map"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={true}
                className="rounded-lg object-cover hover:scale-105 transition-transform duration-300"
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 6'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Cimage preserveAspectRatio='none' filter='url(%23b)' x='0' y='0' height='100%25' width='100%25' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABASURBVAiZY/z//z8DMvj14+s/BgYGRXRxRkZGhv///zMie4QRZgADAwMjuhwLugATAwMDAwMjIyMjshwjAwMDAwBrBwvUX2PaKQAAAABJRU5ErkJggg=='/%3E%3C/svg%3E"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="mb-12 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left">
          {t("sections.philosophy.title")}
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src="https://qiniu.jessieontheroad.com/icon/Telecommuting-cuate.png"
                alt="Philosophy Image"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={90}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-center md:text-left">
                {t("sections.philosophy.slogan")}
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {["codeDesc", "lifeDesc", "shareDesc"].map((key) => (
                <p key={key} className="text-base sm:text-lg text-gray-700">
                  {t(`sections.philosophy.${key}`)}
                </p>
              ))}
            </div>

            <div className="space-y-4 mt-6 sm:mt-8">
              <blockquote className="border-l-4 border-black pl-4 italic">
                <p className="text-base sm:text-lg">
                  {t("sections.philosophy.quote")}
                </p>
                <footer className="text-sm sm:text-base text-gray-600 mt-2">
                  {t("sections.philosophy.quoteAuthor")}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Section */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
          {t("sections.connect.title")}
        </h2>
        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          {t("sections.connect.desc")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          {["GitHub", "LinkedIn", "Instagram"].map((platform) => (
            <a
              key={platform}
              href={`https://${platform.toLowerCase()}.com/yourusername`}
              className="w-full sm:w-auto bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>

      {/* Notion Content */}
      {/* <div className="prose max-w-none">
        <NotionPage recordMap={post} />
      </div> */}
    </div>
  );
};

export default About;
