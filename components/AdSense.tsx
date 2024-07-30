import { useEffect } from "react";
import {
  ADSENSE_GOOGLE_ID,
  ADSENSE_GOOGLE_SLOT_IN_ARTICLE,
  IsPROD,
} from "@/lib/constants";

const AdSense = () => {
  useEffect(() => {
    if (IsPROD) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      } catch (err) {
        console.error("Adsense error:", err);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={`ca-${ADSENSE_GOOGLE_ID}`} // 替换为你的广告客户端ID
      data-ad-slot={ADSENSE_GOOGLE_SLOT_IN_ARTICLE} // 替换为你的广告位ID
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSense;
