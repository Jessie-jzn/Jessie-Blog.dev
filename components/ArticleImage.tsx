import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import {
  ARTICLE_IMAGE_FALLBACK,
  articleImageSource,
} from "@/lib/images/articleImageSource";

type ArticleImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export default function ArticleImage({
  src,
  alt,
  onError,
  ...props
}: ArticleImageProps) {
  const normalizedSource = articleImageSource(src);
  const [currentSource, setCurrentSource] = useState(normalizedSource);

  useEffect(() => {
    setCurrentSource(normalizedSource);
  }, [normalizedSource]);

  return (
    <Image
      {...props}
      src={currentSource}
      alt={alt}
      onError={(event) => {
        if (currentSource !== ARTICLE_IMAGE_FALLBACK) {
          setCurrentSource(ARTICLE_IMAGE_FALLBACK);
        }
        onError?.(event);
      }}
    />
  );
}
