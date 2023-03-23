import request from "supertest";
import { app } from "../../app";

it("faild when a mail that doesnt exist is supplied", async () =>{
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "paswdmf"
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () =>{

  process.env.JWT_KEY = "asdfasdf";

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "chrkikdjfjfjfjgj"
    })
    .expect(400);
});

it("respond with a cookie when given a valid credential", async () =>{

  process.env.JWT_KEY = "asdfasdf";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "passwordhh"
    })
    .expect(201);

    

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "passwordhh"
    })
    .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();

});