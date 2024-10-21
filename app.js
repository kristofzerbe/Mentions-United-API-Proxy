import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

const corsOptions = { 
  origin: process.env.CORS_URLS.split(","),
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));

//////////////////////////////////////////////////////////////

function getProxy(providerName) {
  return createProxyMiddleware({
    target: process.env[providerName.toUpperCase() + "_API_URL"],
    changeOrigin: true,
    pathRewrite: (path, req) => {
      if (process.env.LOG) { console.log("Proxying " + process.env[providerName.toUpperCase() + "_API_URL"] + path); }
      return path.replace("/" + providerName, "");
    },
    headers: { Authorization: "Bearer " + process.env[providerName.toUpperCase() + "_API_TOKEN"] }
  });
}

// ---------------------------------------------

const provider = ["pixelfed", "mastodon"];

provider.forEach((key) => {
  app.use("/" + key, getProxy(key));
})

//////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`API Proxy listening on port ${PORT} for ${provider.join(", ")}`);
});