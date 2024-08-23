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
        src={imageSrc || require("../../data/images/image1.jpg")}
        alt={title}
        width={700}
        height={400}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-center ">{description}</p>
      <button className="mt-4 px-6 py-2 bg-[#4d472f] text-white rounded-full hover:bg-[#5e5639]">
        <Link href={`/post/${id}`}>{t("learnMore")}</Link>
      </button>
    </div>
  );
};
export default CardPost;
