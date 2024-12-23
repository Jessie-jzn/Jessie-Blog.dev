import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";

const CardPost = ({
  imageSrc,
  title = "",
  description,
  id = "",
  date = "",
  tag = "",
}: {
  id?: string;
  imageSrc?: string;
  title?: string;
  description?: string;
  date?: string;
  tag?: string;
}) => {
  const { t } = useTranslation("common");
  return (
    <div className="group cursor-pointer">
      <Link href={`/post/${id}`} className="flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={
              imageSrc 
                ? `/api/image-proxy?url=${encodeURIComponent(imageSrc)}`
                : "/images/default.webp"
            }
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            {tag && <span>{tag}</span>}
            {date && (
              <>
                <span className="text-gray-300">•</span>
                <span>{date}</span>
              </>
            )}
          </div>
          
          <h3 className="text-xl font-medium line-clamp-2 text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          
          <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CardPost;
