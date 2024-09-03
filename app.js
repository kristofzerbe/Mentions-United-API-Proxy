import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

const corsOptions = { 
  origin: process.env.MENTIONS_UNITED_SOURCE_DOMAIN,
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));

//////////////////////////////////////////////////////////////

const pixelfedProxy = createProxyMiddleware({
  target: process.env.PIXELFED_API_URL,
  changeOrigin: true,
  pathRewrite: (path, req) => { 
    if (process.env.LOG) { console.log("Proxying " + process.env.PIXELFED_API_URL + path); }
    return path.replace("/pixelfed", "")
  },
  headers: { Authorization: "Bearer " + process.env.PIXELFED_API_TOKEN }
});
app.use('/pixelfed', pixelfedProxy);

//////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`API Proxy listening on port ${PORT}`);
});