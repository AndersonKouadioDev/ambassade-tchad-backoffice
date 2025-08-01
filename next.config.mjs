import createNextIntlPlugin from "next-intl/plugin";
import nextra from "nextra";

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin();

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api.lorem.space",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "fr.pinterest.com",
      },
      {
        protocol: "https",
        hostname: "pinterest.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "http",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "api.ambassade-tchad.com",
      },
      {
        protocol: "http",
        hostname: "api.ambassade-tchad.com",
      },
    ],
  },
};

export default withNextIntl(withNextra(nextConfig));
