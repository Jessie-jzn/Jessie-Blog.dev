import * as React from "react";
import * as types from "notion-types";
/**
 * 块组件的属性接口
 */
interface BlockProps {
    block: types.Block;
    level: number;
    className?: string;
    bodyClassName?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    pageHeader?: React.ReactNode;
    pageFooter?: React.ReactNode;
    pageTitle?: React.ReactNode;
    pageAsideTop?: React.ReactNode;
    pageAsideBottom?: React.ReactNode;
    pageCover?: React.ReactNode;
    hideBlockId?: boolean;
    disableHeader?: boolean;
    children?: React.ReactNode;
}
/**
 * Notion块渲染组件
 * 负责根据不同的块类型渲染对应的内容
 */
export declare const Block: React.FC<BlockProps>;
export {};
