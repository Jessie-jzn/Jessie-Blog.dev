/** 使用 react-share 提供多平台文章分享入口。 */
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WeiboShareButton,
  WeiboIcon,
} from "react-share";
import { FaWeixin } from "react-icons/fa"; // 引入微信图标
import { SiXiaohongshu } from "react-icons/si"; // 引入小红书图标

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export const ShareButtons = ({
  url,
  title,
  description,
}: ShareButtonsProps) => {
  return (
    <div className="editorial-surface flex flex-col items-center gap-2 rounded-xl p-2">
      <FacebookShareButton
        url={url}
        hashtag={title}
        aria-label="Share on Facebook"
        className="editorial-focus inline-flex h-10 w-10 items-center justify-center rounded-full"
      >
        <FacebookIcon size={28} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={title}
        aria-label="Share on Twitter"
        className="editorial-focus inline-flex h-10 w-10 items-center justify-center rounded-full"
      >
        <TwitterIcon size={28} round />
      </TwitterShareButton>
      <LinkedinShareButton
        url={url}
        title={title}
        summary={description}
        aria-label="Share on LinkedIn"
        className="editorial-focus inline-flex h-10 w-10 items-center justify-center rounded-full"
      >
        <LinkedinIcon size={28} round />
      </LinkedinShareButton>
      <WeiboShareButton
        url={url}
        title={title}
        aria-label="Share on Weibo"
        className="editorial-focus inline-flex h-10 w-10 items-center justify-center rounded-full"
      >
        <WeiboIcon size={28} round />
      </WeiboShareButton>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          alert("链接已复制到剪贴板！");
        }}
        aria-label="Copy link for WeChat"
        className="editorial-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-primary text-ink transition-colors hover:bg-primaryStrong hover:text-surface"
      >
        <FaWeixin size={20} />
      </button>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          alert("链接已复制到剪贴板！可以粘贴到小红书分享");
        }}
        aria-label="Copy link for Xiaohongshu"
        className="editorial-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-primary text-ink transition-colors hover:bg-primaryStrong hover:text-surface"
      >
        <SiXiaohongshu size={20} />
      </button>
    </div>
  );
};
