const path = require("path");
require("dotenv").config();

/**
 * Environment flags
 */
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === "true",
  enableVisualEdits: process.env.REACT_APP_ENABLE_VISUAL_EDITS === "true",
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
  isProduction: process.env.NODE_ENV === "production",
};

/**
 * Optional modules (loaded only when enabled)
 */
let babelMetadataPlugin;
let setupDevServer;

if (config.enableVisualEdits) {
  babelMetadataPlugin = require("./plugins/visual-edits/babel-metadata-plugin");
  setupDevServer = require("./plugins/visual-edits/dev-server-setup");
}

let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

/**
 * CRACO configuration
 */
const cracoConfig = {
  // 🔴 REQUIRED for react-scripts v5
  reactScriptsVersion: "react-scripts",

  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },

    configure: (webpackConfig) => {
      // Production builds should be clean and minimal
      if (!config.isProduction) {
        if (config.disableHotReload) {
          webpackConfig.plugins = webpackConfig.plugins.filter(
            (plugin) =>
              plugin.constructor.name !== "HotModuleReplacementPlugin"
          );

          webpackConfig.watch = false;
          webpackConfig.watchOptions = { ignored: /.*/ };
        } else {
          webpackConfig.watchOptions = {
            ...webpackConfig.watchOptions,
            ignored: [
              "**/node_modules/**",
              "**/.git/**",
              "**/build/**",
              "**/dist/**",
              "**/coverage/**",
              "**/public/**",
            ],
          };
        }
      }

      if (!config.isProduction && config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }

      return webpackConfig;
    },
  },
};

/**
 * Optional Babel plugin
 */
if (config.enableVisualEdits) {
  cracoConfig.babel = {
    plugins: [babelMetadataPlugin],
  };
}

/**
 * DevServer configuration (DEV ONLY)
 */
cracoConfig.devServer = (devServerConfig) => {
  if (config.isProduction) {
    return devServerConfig;
  }

  const useProxy = process.env.USE_WEBPACK_PROXY === "true";

  if (useProxy) {
    const backendProtocol = process.env.BACKEND_PROTOCOL || "http:";
    const backendHost = process.env.BACKEND_HOST || "localhost:8001";
    const backendTarget = `${backendProtocol}//${backendHost}`;

    devServerConfig.proxy = {
      "/api": {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: "debug",
      },
    };

    console.log(`[Proxy] /api → ${backendTarget}`);
  }

  if (config.enableVisualEdits && setupDevServer) {
    devServerConfig = setupDevServer(devServerConfig);
  }

  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetup = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (originalSetup) {
        middlewares = originalSetup(middlewares, devServer);
      }

      setupHealthEndpoints(devServer, healthPluginInstance);
      return middlewares;
    };
  }

  return devServerConfig;
};

module.exports = cracoConfig;
