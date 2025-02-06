const express = require("express");
const hash = require("object-hash");
const app = express();
const moment = require("moment");
const { z } = require("zod");

const receiptsMap = {};

const schema = z.object({
  retailer: z.string(),
  purchaseDate: z.string(),
  purchaseTime: z.string(),
  items: z.array(z.object({ shortDescription: z.string(), price: z.string() })),
  total: z.string(),
});

app.use(express.json());

function processReceiptsHandler(req, res) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "The receipt is invalid" });
  }
  receiptsMap[hash(req.body)] = req.body;
  res.json({ id: hash(req.body) });
}

function pointsHandler(req, res) {
  if (req.params.id in receiptsMap) {
    let points = calculatePoints(receiptsMap[req.params.id]);

    res.json({ points: points });
  } else {
    res.send("No receipt found for that ID.");
  }
}

function calculatePoints(receipt) {
  let points = 0;

  let count = receipt["retailer"].match(/[a-zA-Z0-9]/g);

  // One point for every alphanumeric character in the retailer name
  points += count.length;

  // 50 points if the total is a round dollar amount with no cents.
  if (receipt["total"] % 1 == 0) {
    points += 50;
  }

  // 25 points if the total is a multiple of 0.25.
  if (receipt["total"] % 0.25 == 0) {
    points += 25;
  }

  receipt["items"].forEach((item, count) => {});

  receipt["items"].forEach((item, count) => {
    // 5 points for every two items on the receipt.
    if (count % 2 == 1) {
      points += 5;
    }
    const trimmedStr = item["shortDescription"].trim(); // "HelloWorld!"

    //If the trimmed length of the item description is a multiple of 3,
    // multiply the price by 0.2 and round up to the nearest integer.
    // The result is the number of points earned.
    if (trimmedStr.length % 3 == 0) {
      points += Math.ceil(Number(item["price"]) * 0.2);
    }
  });

  if (receipt["purchaseDate"]) {
    const date = new Date(receipt["purchaseDate"]);
    const day = date.getUTCDate();

    //6 points if the day in the purchase date is odd.
    if (day % 2 == 1) {
      points += 6;
    }

    const startTime = moment("14:00", "hh:mm");
    const endTime = moment("16:00", "hh:mm");
    const purchaseTime = moment(receipt["purchaseTime"], "hh:mm");
    let inBetween = purchaseTime.isBetween(startTime, endTime);

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    if (inBetween) {
      points += 10;
    }
  }

  return points;
}

app.post("/receipts/process", processReceiptsHandler);

app.get("/receipts/:id/points", pointsHandler);

module.exports = app;
