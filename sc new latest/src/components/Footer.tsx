
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-6 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with <Heart className="inline-block h-4 w-4 text-red-500 fill-red-500 mx-1" /> by SkillCoders Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
