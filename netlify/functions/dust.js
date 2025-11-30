import fetch from "node-fetch";

export const handler = async (event, context) => {

  const sido = event.queryStringParameters.sido;

  const serviceKey = process.env.API_KEY;

  const url = 
    `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?` +
    `serviceKey=${serviceKey}&returnType=json&numOfRows=100&pageNo=1&sidoName=${encodeURIComponent(sido)}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(json)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
