import * as React from "react";
import * as types from "notion-types";
/**
 * Header组件属性接口
 */
interface HeaderProps {
    block: types.Block;
}
/**
 * Notion页面头部组件
 */
export declare const Header: React.FC<HeaderProps>;
export default Header;
