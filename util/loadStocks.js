const fetch = require("node-fetch");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const Exchange = require("../models/exchange");
const Stock = require("../models/stock");

const loadtoDb = async () => {
  // Parse json of all listed stock on specified exchange
  const res = await fetch(
    "https://pkgstore.datahub.io/core/nasdaq-listings/nasdaq-listed-symbols_json/data/5c10087ff8d283899b99f1c126361fa7/nasdaq-listed-symbols_json.json"
  );
  const body = await res.json();

  // Rename keys of stock objects and add exchange db ref
  let stockArray = body.map(({ ["Company Name"]: name, Symbol: symbol }) => ({
    name,
    symbol,
    exchange: "NASDAQ",
  }));

  // Test saving a few stocks to the db for now
  const sampleArray = stockArray.slice(0, 5);
  console.log(sampleArray);

  sampleArray.forEach(async (element) => {
    const stock = new Stock(element);
    await stock.save();
  });
};

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    loadtoDb();
  });
