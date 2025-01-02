import React from "react";
import Image from "next/image";

interface GalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="aspect-square relative">
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
