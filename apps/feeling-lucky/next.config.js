const env = process.env.NODE_ENV;
const isProd = env === "production";

module.exports = {
  // required to have several apps on single route
  basePath: isProd ? "/feeling-lucky" : "",
  assetPrefix: isProd ? "/feeling-lucky" : "",
  trailingSlash: false,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 300,
  },
};
