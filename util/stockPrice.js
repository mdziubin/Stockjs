const fetch = require("node-fetch");
require("dotenv").config({ path: "../.env" });

const getQuote = async (symbol) => {
  const response = await fetch(
    `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.IEX_API_KEY}`
  );
  const json = await response.json();

  return json.latestPrice;
};

getQuote("AAPL");
