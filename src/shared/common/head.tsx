// @ts-ignore

// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { mobileViewPortContent } from "onefx/lib/iso-react-render/root/mobile-view-port-content";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React from "react";
import { assetURL } from "./asset-url";
import { colors } from "./styles/style-color";

export function Head({ locale }: { locale: string }): JSX.Element {
  return (
    <Helmet
      title={`${t("meta.title")} - ${t("meta.description")}`}
      meta={[
        { name: "viewport", content: mobileViewPortContent },
        { name: "description", content: t("meta.description") },
        { name: "theme-color", content: colors.primary },

        // social
        { property: "og:title", content: `${t("meta.title")}` },
        { property: "og:description", content: t("meta.description") },
        { property: "twitter:card", content: "summary" }
      ]}
      link={[
        // PWA & mobile
        { rel: "manifest", href: "/manifest.json" },
        { rel: "apple-touch-icon", href: "/favicon.png" },

        {
          rel: "icon",
          type: "image/png",
          sizes: "any",
          href: assetURL("/favicon.png")
        },

        // styles
        {
          rel: "stylesheet",
          type: "text/css",
          href: assetURL("/stylesheets/main.css")
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: assetURL("/antd.css")
        },
        {
          href:
            "https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic",
          rel: "stylesheet",
          type: "text/css"
        }
      ]}
    >
      <html lang={locale} />
    </Helmet>
  );
}
