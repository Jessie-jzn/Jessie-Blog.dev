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
        src={imageSrc || require("@/public/images/image1.jpg")}
        alt={title}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        width={700}
        loading="lazy"
        height={400}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h3 className="mt-4 text-lg font-semibold line-clamp-1">{title}</h3>
      <p className="mt-2 text-left h-20 line-clamp-2">{description}</p>
      <button className="mt-2 px-6 py-2 bg-[#4d472f] text-white rounded-full hover:bg-[#5e5639]">
        <Link href={`/post/${id}`}>{t("learnMore")}</Link>
      </button>
    </div>
  );
};
export default CardPost;
