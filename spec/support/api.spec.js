const request = require("supertest");
const app = require("../../server");

describe("API Routes", () => {
  it("should return 400 if question is missing", async () => {
    const response = await request(app)
      .post("/api/ask")
      .send({ question: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Question is required.");
  });

  it("should serve the homepage", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Petal Prompt");
  });

  it("should serve the results page", async () => {
    const response = await request(app).get("/results");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Your Question");
  });
});