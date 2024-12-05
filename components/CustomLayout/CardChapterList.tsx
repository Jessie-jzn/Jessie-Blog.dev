import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Types from "@/lib/type";
import { motion } from "framer-motion";

interface CardChapterListProps {
  article: Types.Post;
  index: number;
  category: string;
}

const CardChapterList: React.FC<CardChapterListProps> = ({
  article,
  index,
  category,
}) => {
  return (
    <Link href={`/${category}/${article.id}`}>
      <motion.article
        className="flex items-start py-4 hover:bg-gray-50 border-b border-gray-100 dark:border-gray-800"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {article.slug}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{article.publishDay}</span>
            <span className="mx-2">·</span>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>{article.views || 0}</span>
            </div>
          </div>
        </div>
        {article.pageCoverThumbnail && (
          <div className="flex-shrink-0 ml-4">
            <Image
              src={article.pageCoverThumbnail}
              alt={article.title || ''}
              width={120}
              height={80}
              className="object-cover rounded-lg w-24 h-16 md:w-32 md:h-20"
            />
          </div>
        )}
      </motion.article>
    </Link>
  );
};

export default CardChapterList;
