import request from "supertest";
import { app } from "../../app";
import { signupRouter } from "../signup";

it("respond with details of the current user", async () =>{
  process.env.JWT_KEY = "asdfasdf";

    // const cookie = await global.signin();

    const cookie =  await global.signin();
    
  const response = await request(app)
    .get("/api/users/currentuser")
    .send({})
    .set("Cookie", cookie)
    .expect(400)

    expect(response.body.currentUser.email).toEqual("test@test.com");

});

it("Respond with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200)


    expect(response.body.currentUser).toEqual(null);
});