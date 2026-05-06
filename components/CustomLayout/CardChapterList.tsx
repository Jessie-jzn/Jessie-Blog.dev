import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Types from "@/lib/type";
import { motion } from "framer-motion";

interface CardChapterListProps {
  article: Types.Post;
  index?: number;
  category?: string;
}

const CardChapterList: React.FC<CardChapterListProps> = ({ article }) => {
  return (
    <Link
      href={`${article?.category}/${article?.slug || article.id}`}
      className="block"
    >
      <motion.article
        className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-neutral-900/70 ring-1 ring-black/[0.05] dark:ring-white/[0.07] hover:ring-black/[0.1] dark:hover:ring-white/[0.12] hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] transition-all duration-300"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <h3 className="text-[15px] md:text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 line-clamp-2 leading-snug">
            {article.title}
          </h3>
          {article.summarize?.trim() ? (
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {article.summarize}
            </p>
          ) : null}
          <div className="flex items-center text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
            <span>{article.publishDay}</span>
            {/* <span className="mx-2">·</span>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>{article.views || 0}</span>
            </div> */}
          </div>
        </div>
        {article.pageCoverThumbnail && (
          <div className="flex-shrink-0">
            <Image
              src={article.pageCoverThumbnail}
              alt={article.title || ""}
              width={120}
              height={80}
              className="object-cover rounded-xl w-24 h-16 md:w-28 md:h-[4.75rem] ring-1 ring-black/[0.04] dark:ring-white/[0.08]"
            />
          </div>
        )}
      </motion.article>
    </Link>
  );
};

export default CardChapterList;
