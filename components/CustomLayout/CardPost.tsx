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
    <div className="p-6 xs:p-2 rounded-lg shadow-md text-gray-600 dark:text-white">
      <Link href={`/post/${id}`} className="flex flex-col items-center">
        <Image
          src={
            imageSrc ||
            "http://jessieontheroad.com/image1.webp"
          }
          alt={title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          width={700}
          loading="lazy"
          height={400}
          quality={75} // 设置压缩质量，默认为75
          className="w-full h-48 xs:h-32 object-cover rounded-lg"
        />

        <h3 className="mt-4 text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="mt-2 text-left h-20 line-clamp-2 xs:text-sm">{description}</p>
        <button className="mt-4 px-6 py-2 bg-[#4d472f] text-white rounded-full hover:bg-[#5e5639] xs:hidden">
          {t("learnMore")}
        </button>
      </Link>
    </div>
  );
};
export default CardPost;
