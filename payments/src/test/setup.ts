
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


jest.mock("../nats-wrapper");

process.env.STRIPE_KEY = "sk_test_51MlpHBKZwbqzMIkXRTdtozx5KtomB82NFfdBMfHC9uD64umsU6cbHWchgdvC8nbH3y6Dew20MCyOcn0RkZuqs2oY00SuHpGIWz";

let mongo: any;

beforeAll(async () =>{
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {    
  //   useNewUrlParser: true,
  //   useUnifieldTopology: true
  });
});

beforeEach( async () =>{
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});


afterAll( async () =>{
  await mongo.stop();
  await mongoose.connection.close(); 
});

global.signin =  (id?: string) => {
  // Build a jwt paylod. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  };
  
  //  Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. {jwt: MY_KEY}
  const session = { jwt: token };

  // turn session Object into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64.
  const base64 = Buffer.from(sessionJSON).toString("base64"); 

  //  Return a string thats the cookie with the  encoded data;

  return [`session=${base64}`];
  // return [`express:sess=${base64}`];
}