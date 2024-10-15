import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";

const CardPost = ({
  imageSrc,
  title = "",
  description,
  id = "",
}: {
  id?: string;
  imageSrc?: string;
  title?: string;
  description?: string;
}) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col items-center p-6 rounded-lg shadow-md text-gray-600 dark:text-white">
      <Image
        src={imageSrc || 'https://www.dropbox.com/scl/fi/p5jykwuc23gopzf7dnpnd/image1.webp?rlkey=q59ji1f207siy21n7t27uatdx&st=7r1p4qlj&raw=1'}
        alt={title}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        width={700}
        loading="lazy"
        height={400}
        quality={75} // 设置压缩质量，默认为75
        
        className="w-full h-48 object-cover rounded-lg"
      />

      <h3 className="mt-4 text-lg font-semibold line-clamp-1">{title}</h3>
      <p className="mt-2 text-left h-20 line-clamp-2">{description}</p>
      <Link
        href={`/post/${id}`}
        className="w-full flex items-center justify-center"
      >
        <button className="mt-2 px-6 py-2 bg-[#4d472f] text-white rounded-full hover:bg-[#5e5639]">
          {t("learnMore")}
        </button>
      </Link>
    </div>
  );
};
export default CardPost;
