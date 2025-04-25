// components/Comment.tsx
"use client";
import Giscus from '@giscus/react';
import { useEffect, useRef } from "react";
import { COMMENT_REPO_ID, COMMENT_REPO_URL, COMMENT_REPO_NAME, COMMENT_CATEGORY_ID } from "@/lib/constants";

// interface GiscusProps {
//     repo?: string;         // your-username/your-repo
//     repoId?: string;
//     category?: string;     // Name of the category (not ID)
//     categoryId?: string;
//     mapping?: "pathname" | "url" | "title" | "og:title" | "specific";
//     theme?: "light" | "dark" | "preferred_color_scheme";
//     lang?: string;
// }

const GiscusComments = () => {
    return <Giscus
        id="comments"
        repo="Jessie-jzn/Jessie-Blog.dev"
        repoId={COMMENT_REPO_ID}
        category="General"
        categoryId="DIC_kwDOMc9Yl84CpcYd"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="noborder_light"
        lang="en"
        loading="lazy"
    />;
};

export default GiscusComments;