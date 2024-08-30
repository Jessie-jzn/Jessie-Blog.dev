import React from "react";
import Image from "next/image";

interface Lesson {
  title: string;
  duration: string;
  description: string;
}

interface Chapter {
  title: string;
  lessons: Lesson[];
}

interface CardChapterListProps {
  chapters: Chapter[];
}

const CardChapterList: React.FC<CardChapterListProps> = ({ chapters }) => {
  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => (
        <div key={index} className="bg-yellow-50 rounded-lg shadow p-4">
          <h2 className="text-2xl font-bold mb-2 text-gray-600">
            {chapter.name}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {chapter.articles.length} Posts
          </p>
          <ul className="space-y-2">
            {chapter.articles.map((article) => (
              <li
                key={article.id}
                className="flex items-center space-x-4 space-y-4"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={article.pageCoverThumbnail}
                    alt="Lesson"
                    width={700}
                    height={400}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-600">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600">{article.slug}</p>
                  <p className="text-sm text-gray-500">{article.publishDay}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CardChapterList;
