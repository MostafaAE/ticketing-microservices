import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "12345678" })
    .expect(201);
});

it("returns a 400 on invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@", password: "12345678" })
    .expect(400);
});

it("returns a 400 on invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "aa" })
    .expect(400);
});

it("returns a 400 missing email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);
  return request(app)
    .post("/api/users/signup")
    .send({ password: "12345678" })
    .expect(400);
});

it("returns a 400 when email is already in use", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "12345678" })
    .expect(201);
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "12345678" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test2@test.com", password: "12345678" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
