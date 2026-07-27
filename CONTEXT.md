# Jessie Blog

Jessie Blog publishes articles about working holidays, travel, life, and technology in Chinese and English.

## Language

**Article**:
A published piece of blog content with a category and a stable Notion page identity.
_Avoid_: Post, page

**Article Slug**:
A human-readable Article identifier that is unique across the entire site, independent of category. Duplicate slugs among published Articles are invalid content and must not resolve to either Article.
_Avoid_: Alias, short link

**Canonical Article URL**:
The single lowercase public URL that represents an Article: `/{currentCategory}/{slug}/`, falling back to `/{currentCategory}/{notionPageId}/` with a lowercase, unhyphenated 32-character ID when no slug exists. Surrounding whitespace and extra slashes are not part of the identity; a recognizable non-canonical URL permanently redirects here without otherwise rewriting the slug text.
_Avoid_: Post URL, article link

**Legacy Article URL**:
An older `/post/{id}` URL that permanently redirects to the Canonical Article URL.
_Avoid_: Old route
