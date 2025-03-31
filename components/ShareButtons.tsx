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
    <div className="flex flex-col items-center gap-4 p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <FacebookShareButton url={url} hashtag={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title} summary={description}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <WeiboShareButton url={url} title={title}>
        <WeiboIcon size={32} round />
      </WeiboShareButton>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          alert("链接已复制到剪贴板！");
        }}
        className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full shadow hover:bg-green-600"
      >
        <FaWeixin size={20} />
      </button>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          alert("链接已复制到剪贴板！可以粘贴到小红书分享");
        }}
        className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full shadow hover:bg-red-600"
      >
        <SiXiaohongshu size={20} />
      </button>
    </div>
  );
};
