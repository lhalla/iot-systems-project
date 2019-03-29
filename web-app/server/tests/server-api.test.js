const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test-helper");
const app = require("../app");

const api = supertest(app);

describe("all data", () => {
  test("are returned as JSON", async () => {
    await api
      .get("/api/data")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("are of the correct format", async () => {
    const data = await helper.dataInDB();

    expect(
      data.every(
        datum =>
          datum.temperature !== undefined &&
          datum.humidity !== undefined &&
          datum.eCO2 !== undefined &&
          datum.VOC !== undefined
      )
    ).toBe(true);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
