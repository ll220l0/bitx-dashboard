import type { NextConfig } from "next";

const isFastBuild = process.env.NEXT_FAST_BUILD === "1";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: isFastBuild,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  experimental: {
    // Speeds up repeated `next build` runs by persisting Turbopack cache on disk.
    turbopackFileSystemCacheForBuild: true,
    // Reduces compile work for large UI/icon libraries by rewriting full imports.
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
      "@heroui/react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tooltip",
    ],
    // Parallelize server compilation/tracing where possible.
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
};

export default nextConfig;
