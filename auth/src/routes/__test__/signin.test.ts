import request from "supertest";
import { app } from "../../app";

it("returns a 200 on successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test3@test.com", password: "12345678" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test3@test.com", password: "12345678" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("fails when email does not exist is supplied", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "notexist@test.com", password: "12345678" })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test4@test.com", password: "12345678" })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({ email: "test4@test.com", password: "dfgdfgdf" })
    .expect(400);
});
