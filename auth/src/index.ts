import mongoose, {ConnectOptions} from "mongoose";
import { app } from "./app";

mongoose.set('strictQuery', false);

 const start = async () =>{
  console.log("starting ......up");
  if(!process.env.JWT_KEY) {
    throw new Error("JWT must be defined");
  }
  if(!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
  } as ConnectOptions);
  console.log("connected to mongodb");
  } catch (err) {
  console.error(err);
}

app.listen(3000, () =>{
  console.log("listening to port 3000");
  });

 };

 start();