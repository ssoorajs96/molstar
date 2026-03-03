import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['molstar'],
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
};

export default nextConfig;
