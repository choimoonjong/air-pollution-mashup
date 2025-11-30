const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 정적 파일 제공
app.use(express.static("public"));

// 실시간 대기오염 정보 API
app.get("/api/dust", async (req, res) => {
    const sido = req.query.sido;
    const apiKey = process.env.API_KEY;

    const url =
        `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty` +
        `?sidoName=${encodeURIComponent(sido)}` +
        `&returnType=json` +
        `&serviceKey=${apiKey}` +
        `&numOfRows=100` +
        `&pageNo=1`;

    try {
        const response = await fetch(url);
        const json = await response.json();
        res.send(json);
    } catch (err) {
        console.log("Dust API Error:", err);
        res.status(500).json({ error: "dust api error" });
    }
});

// 예보통보 API
app.get("/api/forecast", async (req, res) => {
    const searchDate = req.query.date;
    const apiKey = process.env.API_KEY;

    // 파라미터 순서 절대 바꾸면 안됨!
    const url =
        `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth` +
        `?searchDate=${searchDate}` +
        `&returnType=json` +
        `&serviceKey=${apiKey}` +
        `&numOfRows=100` +
        `&pageNo=1`;

    try {
        const response = await fetch(url);
        const json = await response.json();
        res.send(json);
    } catch (err) {
        console.log("Forecast API Error:", err);
        res.status(500).json({ error: "forecast api error" });
    }
});

app.listen(8081, () => {
    console.log("Proxy server running on http://localhost:8081");
});
