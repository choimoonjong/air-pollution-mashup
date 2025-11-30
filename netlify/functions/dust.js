const fetch = require("node-fetch");

exports.handler = async (event) => {
    const { sido } = event.queryStringParameters;

    const API_KEY = "5fd6833c558c5b60909e71a8d875164f37e93e23e9a72bf147d98dacec0ef95f";  // Encoding Key
    const url =
        `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty` +
        `?sidoName=${encodeURIComponent(sido)}` +
        `&pageNo=1&numOfRows=100&returnType=json&serviceKey=${API_KEY}&ver=1.0`;

    const response = await fetch(url);
    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};
