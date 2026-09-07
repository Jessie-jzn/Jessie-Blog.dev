/** 统一规范文章封面来源，并在图片加载失败时回退到默认封面。 */
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import {
  articleImageSource,
  generatedArticleCoverSource,
} from "@/lib/images/articleImageSource";

type ArticleImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSeed?: string | null;
};

export default function ArticleImage({
  src,
  fallbackSeed,
  alt,
  onError,
  ...props
}: ArticleImageProps) {
  const normalizedSource = articleImageSource(src, fallbackSeed);
  const generatedFallback = generatedArticleCoverSource(fallbackSeed);
  const [currentSource, setCurrentSource] = useState(normalizedSource);

  useEffect(() => {
    setCurrentSource(normalizedSource);
  }, [normalizedSource]);

  return (
    <Image
      {...props}
      src={currentSource}
      alt={alt}
      unoptimized={currentSource === generatedFallback}
      onError={(event) => {
        if (generatedFallback && currentSource !== generatedFallback) {
          setCurrentSource(generatedFallback);
        }
        onError?.(event);
      }}
    />
  );
}
