import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(dirname, "../../dist");

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias["@basestack/flags-react"] = path.join(
      distDir,
      "index.js",
    );
    config.resolve.alias["@basestack/flags-react/client"] = path.join(
      distDir,
      "client.js",
    );
    config.resolve.alias["@basestack/flags-react/server"] = path.join(
      distDir,
      "server.js",
    );
    return config;
  },
};

export default nextConfig;
