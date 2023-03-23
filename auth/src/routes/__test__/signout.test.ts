import request from "supertest";
import { app } from "../../app";

it("clears cookis after signing out", async () => {
  process.env.JWT_KEY = "asdfasdf";

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@tes.com",
      password: "password"
    })
    .expect(201);


    const response = await request(app)
      .post("/api/users/signout")
      .send({})
      .expect(200)

      console.log(response.get("Set-Cookie"));
});