// app.test.js
const request = require("supertest");
const app = require("./server");
const hash = require("object-hash");

const exampleJSON = {
  retailer: "Target",
  purchaseDate: "2022-01-01",
  purchaseTime: "13:01",
  items: [
    {
      shortDescription: "Mountain Dew 12PK",
      price: "6.49",
    },
    {
      shortDescription: "Emils Cheese Pizza",
      price: "12.25",
    },
    {
      shortDescription: "Knorr Creamy Chicken",
      price: "1.26",
    },
    {
      shortDescription: "Doritos Nacho Cheese",
      price: "3.35",
    },
    {
      shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
      price: "12.00",
    },
  ],
  total: "35.35",
};

describe("POST /receipts/process", () => {
  it("should return an ID that is the object hash of the JSON, and the correct points", async () => {
    const res = await request(app)
      .post("/receipts/process")
      .send(exampleJSON)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.text).toBe(`{"id":"${hash(exampleJSON)}"}`);
  });

  it("should return the correct points", async () => {
    const res2 = await request(app)
      .get(`/receipts/${hash(exampleJSON)}/points`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res2.text).toBe(`{"points":28}`);
  });
});
