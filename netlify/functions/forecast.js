import fetch from "node-fetch";

export const handler = async (event, context) => {
  
  const date = event.queryStringParameters.date;

  const serviceKey = process.env.AIR_FORECAST_KEY;

  const url =
    `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth?` +
    `serviceKey=${serviceKey}&returnType=json&informCode=PM10&searchDate=${date}`;

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
