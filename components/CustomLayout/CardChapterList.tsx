import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Types from "@/lib/type";
import { motion } from "framer-motion";

interface CardChapterListProps {
  chapter: Types.Tag;
  index: number;
  category: string;
}

const CardChapterList: React.FC<CardChapterListProps> = ({
  chapter,
  index,
  category,
}) => {
  return (
    <motion.div
      key={index}
      className="bg-yellow-50 rounded-lg shadow p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      id={`chapter-${index}`}
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-600 xs:text-xl">
        {chapter.name}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {chapter.articles.length} Posts
      </p>
      <ul className="space-y-2">
        {chapter.articles.map((article: any) => (
          <Link href={`/${category}/${article.id}`} key={article.id}>
            <motion.li
              key={article.id}
              className="flex items-center space-x-4 space-y-4"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex-shrink-0">
                <Image
                  src={article.pageCoverThumbnail}
                  alt="Lesson"
                  width={700}
                  height={400}
                  quality={75} // 设置压缩质量，默认为75
                  loading="lazy"
                  
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-600 xs:text-sm">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600">{article.slug}</p>
                <p className="text-sm text-gray-500">{article.publishDay}</p>
              </div>
            </motion.li>
          </Link>
        ))}
      </ul>
    </motion.div>
  );
};

export default CardChapterList;
