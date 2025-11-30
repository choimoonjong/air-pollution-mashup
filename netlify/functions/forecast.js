import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

export const handler = async (event, context) => {
  try {
    const date = event.queryStringParameters.date;
    const serviceKey = process.env.API_KEY;

    const url =
      `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth` +
      `?serviceKey=${serviceKey}&returnType=xml&searchDate=${date}&InformCode=PM10`;

    const res = await fetch(url);
    const xml = await res.text();

    const parser = new XMLParser();
    const json = parser.parse(xml);

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
