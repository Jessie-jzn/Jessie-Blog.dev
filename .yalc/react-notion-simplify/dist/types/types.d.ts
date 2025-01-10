import * as React from "react";
import * as types from "notion-types";
/**
 * URL映射函数类型
 */
export type MapPageUrlFn = (pageId: string, recordMap?: types.ExtendedRecordMap) => string;
/**
 * 图片URL映射函数类型
 */
export type MapImageUrlFn = (url: string, block: types.Block) => string;
/**
 * Notion搜索函数类型
 */
export type SearchNotionFn = (params: types.SearchParams) => Promise<types.SearchResults>;
/**
 * 组件覆盖函数类型
 */
export type ComponentOverrideFn = (props: any, defaultValueFn: () => React.ReactNode) => React.ReactNode;
/**
 * 基础组件Props接口
 */
export interface BaseComponentProps {
    block?: types.Block;
    className?: string;
    [key: string]: any;
}
/**
 * Notion组件接口
 */
export interface NotionComponents {
    Image: React.FC<{
        src: string;
        alt?: string;
        className?: string;
        [key: string]: any;
    }>;
    Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    PageLink: React.FC<{
        href: string;
        className?: string;
        children?: React.ReactNode;
        style?: any;
        target?: any;
    }>;
    Checkbox: React.FC<{
        isChecked: boolean;
        blockId: string;
    }>;
    Code: React.FC<BaseComponentProps & {
        language?: string;
    }>;
    Equation: React.FC<BaseComponentProps>;
    Callout?: React.FC<BaseComponentProps>;
    Collection: React.FC<BaseComponentProps & {
        ctx: any;
    }>;
    Property?: React.FC<BaseComponentProps>;
    propertyTextValue: ComponentOverrideFn;
    propertySelectValue: ComponentOverrideFn;
    propertyRelationValue: ComponentOverrideFn;
    propertyFormulaValue: ComponentOverrideFn;
    propertyTitleValue: ComponentOverrideFn;
    propertyPersonValue: ComponentOverrideFn;
    propertyFileValue: ComponentOverrideFn;
    propertyCheckboxValue: ComponentOverrideFn;
    propertyUrlValue: ComponentOverrideFn;
    propertyEmailValue: ComponentOverrideFn;
    propertyPhoneNumberValue: ComponentOverrideFn;
    propertyNumberValue: ComponentOverrideFn;
    propertyLastEditedTimeValue: ComponentOverrideFn;
    propertyCreatedTimeValue: ComponentOverrideFn;
    propertyDateValue: ComponentOverrideFn;
    Pdf: React.FC<BaseComponentProps>;
    Tweet: React.FC<BaseComponentProps>;
    Modal: React.FC<BaseComponentProps>;
    Embed: React.FC<BaseComponentProps>;
    Header: React.FC<{
        block: types.Block;
    }>;
    PageAside?: React.FC<{
        block: types.Block;
    }>;
    pageAsideTop?: React.FC<{
        block: types.Block;
    }>;
    pageAsideBottom?: React.FC<{
        block: types.Block;
    }>;
    nextImage?: any;
    nextLink?: any;
}
/**
 * 集合视图Props接口
 */
export interface CollectionViewProps {
    collection: types.Collection;
    collectionView: types.CollectionView;
    collectionData: types.CollectionQueryResult;
    padding?: number;
    width?: number;
}
/**
 * 集合卡片Props接口
 */
export interface CollectionCardProps {
    collection: types.Collection;
    block: types.PageBlock;
    cover: types.CollectionCardCover;
    coverSize: types.CollectionCardCoverSize;
    coverAspect: types.CollectionCardCoverAspect;
    properties?: Array<{
        property: types.PropertyID;
        visible: boolean;
    }>;
    className?: string;
}
/**
 * 集合分组Props接口
 */
export interface CollectionGroupProps {
    collection: types.Collection;
    collectionViewComponent: React.ElementType;
    collectionGroup: any;
    hidden: boolean;
    schema: any;
    value: any;
    summaryProps: any;
    detailsProps: any;
}
