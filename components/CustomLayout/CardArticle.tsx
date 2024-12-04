import Image from "next/image";
import SiteConfig from "@/site.config";

const CardArticle = () => {
  return (
    <article className="bg-white shadow-md rounded-lg overflow-hidden">
      <Image
        src={`${SiteConfig.imageDomainUrl}/image1.webp`}
        alt="Article 1"
        className="w-full h-48 object-cover"
        quality={75} // 设置压缩质量，默认为75
        loading="lazy"
        
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Article Title 1</h3>
        <p className="text-gray-700 mb-4">
          A brief summary of the first article goes here. It should be concise
          and engaging to entice readers to click through.
        </p>
        <a
          href="#"
          className="text-indigo-600 hover:text-indigo-400 font-medium"
        >
          Read More →
        </a>
      </div>
    </article>
  );
};
export default CardArticle;
