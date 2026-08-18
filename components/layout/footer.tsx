import Link from "next/link";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/icons/social";
import { footerNav, siteConfig } from "@/constants/site";
import { cn } from "@/utils/cn";
import { Container } from "./container";
import { Logo } from "./logo";

const socialLinks = [
  {
    label: "X",
    href: `https://x.com/${siteConfig.socials.twitter.replace("@", "")}`,
    icon: XIcon,
    hoverClassName: "hover:text-foreground",
  },
  {
    label: "Instagram",
    href: siteConfig.socials.instagram,
    icon: InstagramIcon,
    hoverClassName: "hover:text-[#E1306C]",
  },
  {
    label: "Facebook",
    href: siteConfig.socials.facebook,
    icon: FacebookIcon,
    hoverClassName: "hover:text-[#1877F2]",
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <Container className="py-section-sm">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
            <Logo />
            <p className="max-w-xs text-body-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon, hoverClassName }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn("text-muted-foreground transition-colors", hoverClassName)}
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-body-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-caption text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
