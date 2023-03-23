
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// declare global {
//   namespace NODEJS {
//     interface Global {
//       signin(): string[]
//     }
//   }
// }

// declare module globalThis {
//   var signin: () => string[];
// }

// export interface global {}
// declare global {
//   var signin: () => string[]
// }

jest.mock("../nats-wrapper");

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

global.signin =  () => {

  // Build a jwt paylod. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
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