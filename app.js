import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const PORT = process.env.PORT || 3000;
const LOG = process.env.LOG || false;

const app = express();

app.use(cors({ 
  origin: process.env.CORS_URLS.split(","),
  optionsSuccessStatus: 200
}));

//////////////////////////////////////////////////////////////

function getProxy(provider) {
  return createProxyMiddleware({
    target: process.env[provider.toUpperCase() + "_API_BASEURL"],
    changeOrigin: true,
    pathRewrite: (path, req) => {
      if (LOG) { console.log("Proxying " + process.env[provider.toUpperCase() + "_API_BASEURL"] + path); }
      return path.replace("/" + provider, "");
    },
    headers: { Authorization: "Bearer " + process.env[provider.toUpperCase() + "_API_TOKEN"] }
  });
}

// ---------------------------------------------

for(const provider of process.env.PROVIDERS.split(",")) {
  app.use("/" + provider, getProxy(provider));
}

//////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`API Proxy listening on port ${PORT} for ${provider.join(", ")}`);
});