import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {

  process.env.JWT_KEY = "asdfasdf";

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);
  });


  it("returns a 400 with an invalid email", async () =>{
    return request(app)
     .post("/api/users/signup")
     .send({
        email: "KJJJJJJJJJJ",
        password: "password"
     })
     .expect(400);

  })



  it("returns duplicate email", async () =>{
    await request(app)
     .post("/api/users/signup")
     .send({
        email: "test@test.com",
        password: "password"
     })
     .expect(201);

    await request(app)
     .post("/api/users/signup")
     .send({
        email: "test@test.com",
        password: "password"
     })
     .expect(400);
  });


  it("setting cookie after a successful signup", async () =>{
    const response = await request(app)
     .post("/api/users/signup")
     .send({
        email: "test@test.com",
        password: "password"
     })
     .expect(201);

     expect(response.get("Set-Cookie")).toBeDefined();
  });