import * as React from "react";
/**
 * 懒加载图片组件
 * 支持渐进式加载和模糊效果
 */
export declare const LazyImage: React.FC<{
    src?: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
    height?: number;
    zoomable?: boolean;
    priority?: boolean;
}>;
