import express from "express";
import bodyParser from "body-parser";
import { SignJWT, importPKCS8 } from "jose";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000", // 允许的域
    methods: "GET,POST,PUT,DELETE", // 允许的 HTTP 方法
    allowedHeaders: "Content-Type,Authorization", // 允许的请求头
    credentials: true, // 允许携带 Cookies
  })
);

const PrivateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIBL0J1gOxSWihaxKShEFnzTY6fE8Ts4jAor0kqsNDgpo
-----END PRIVATE KEY-----`;

const KEY_ID = "KHB3UF6274";
const PROJECT_ID = "478AWPW2GU";

// 登录接口，验证用户并生成 JWT
app.get("/login", (req, res) => {
  importPKCS8(PrivateKey, "EdDSA")
    .then((key) => {
      const customHeader = {
        alg: "EdDSA",
        kid: KEY_ID,
      };
      const iat = Math.floor(Date.now() / 1000) - 30;
      const exp = iat + 2 * 60 * 60;
      const customPayload = {
        sub: PROJECT_ID,
        iat: iat,
        exp: exp,
      };
      new SignJWT(customPayload)
        .setProtectedHeader(customHeader)
        .sign(key)
        .then((token) => {
          return res.json({ code: "200", token, expire: exp });
        });
    })
    .catch((error) => {
      console.error(error);
      return res.status(401).json({ msg: "token生成错误" });
    });
});

app.get("/geo/city/lookup", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!req.query.location) {
    return res.json({ code: 1, msg: "must have location" });
  }
  axios
    .get("https://n23wry46u3.re.qweatherapi.com/geo/v2/city/lookup", {
      headers: {
        Authorization: authHeader,
      },
      params: req.query,
    })
    .then((response) => {
      if (response.data.code === "200") {
        return res.json({ code: "200", data: response.data.location });
      } else {
        console.log(response.data);
      }
    })
    .catch((e) => {
      if (e.status === 404) {
        return res.json({ code: "200", data: [] });
      } else if (e.status === 401) {
        return res.status(401).json({ msg: "没有权限" });
      } else {
        console.log(e);
      }
    });
});

app.listen(PORT, () => {
  console.log(`server run on http://localhost:${PORT}`);
});
