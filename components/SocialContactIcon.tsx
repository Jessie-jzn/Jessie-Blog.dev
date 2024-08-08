import SocialIcon from "./SocialIcon";
import SiteConfig from "../site.config";

const SocialContactIcon = ({ prop }: any) => {
  return (
    <div className="flex space-x-4 mt-4" {...prop}>
      <SocialIcon
        kind="mail"
        href={`mailto:${SiteConfig.email}`}
        size={6}
        theme={prop?.theme}
      />
      <SocialIcon
        kind="github"
        href={SiteConfig.github}
        size={6}
        theme={prop?.theme}
      />
      <SocialIcon
        kind="facebook"
        href={SiteConfig.facebook}
        size={6}
        theme={prop?.theme}
      />
      <SocialIcon
        kind="youtube"
        href={SiteConfig.youtube}
        size={6}
        theme={prop?.theme}
      />
      <SocialIcon
        kind="linkedin"
        href={SiteConfig.linkedin}
        size={6}
        theme={prop?.theme}
      />
      {/* <SocialIcon kind="twitter" href={SiteConfig.twitter} size={6} /> */}
      <SocialIcon
        kind="x"
        href={SiteConfig.twitter}
        size={6}
        theme={prop?.theme}
      />
      <SocialIcon
        kind="instagram"
        href={SiteConfig.instagram}
        size={6}
        theme={prop?.theme}
      />
    </div>
  );
};
export default SocialContactIcon;
