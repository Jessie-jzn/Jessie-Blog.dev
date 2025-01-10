import * as React from "react";
import { TableOfContentsEntry } from "notion-utils";
export declare const PageAside: React.FC<{
    toc: Array<TableOfContentsEntry>;
    activeSection: string | null;
    setActiveSection: (activeSection: string | null) => unknown;
    hasToc: boolean;
    hasAside: boolean;
    pageAsideTop?: React.ReactNode;
    pageAsideBottom?: React.ReactNode;
    className?: string;
    tocTitle?: string;
}>;
