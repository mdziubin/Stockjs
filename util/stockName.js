const fetch = require("node-fetch");

stockName = async (symbol) => {
  const res = await fetch(
    "https://pkgstore.datahub.io/core/nasdaq-listings/nasdaq-listed-symbols_json/data/5c10087ff8d283899b99f1c126361fa7/nasdaq-listed-symbols_json.json"
  );
  const body = await res.json();
  return body.find((element) => element.Symbol === symbol)["Company Name"];
};

module.exports = stockName;
