export const QiniuImageKeys = {
  about: {
    profile: "about/profile.jpg",
    gallery: {
      image1: "about/gallery/1.jpg",
      image2: "about/gallery/2.jpg",
      image3: "about/gallery/3.jpg",
      image4: "about/gallery/4.jpg",
    },
  },
  home: {
    hero: "home/hero.jpg",
    featured: {
      tech: "home/featured/tech.jpg",
      travel: "home/featured/travel.jpg",
    },
  },
  blog: {
    default: "blog/default-cover.jpg",
  },
  fallback: {
    profile: "fallback/profile.jpg",
    post: "fallback/post-cover.jpg",
    gallery: "fallback/gallery.jpg",
  },
} as const;

// 类型定义，用于获取所有可能的图片键值
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? DeepKeys<T[K]> | `${K & string}/${DeepKeys<T[K]>}`
        : K;
    }[keyof T]
  : never;

export type QiniuImageKey = DeepKeys<typeof QiniuImageKeys>;

// 辅助函数：获取完整的图片键值
export function getImageKey(...parts: string[]): string {
  return parts.join("/");
}
