import express, {Request, Response} from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { Password } from "../services/password";
import { User } from "../models/user";
import { validateRequest, BadRequestError } from "@keepklinticket/common/build";
// import { validateRequest } from "../middlewares/validate-request";
// import { BadRequestError } from "../errors/bad-request-errror";

/* Note: body is a method that is goin to be used as a
 middleware to valiate incoming data to the body of this post request*/

const router = express.Router();

router.post("/api/users/signin", 
 [
  body("email")
    .isEmail()
    .withMessage("Email must be Valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("You must supply a password")

 ], 
 validateRequest,

async(req: Request, res: Response) =>{
  const {email, password} = req.body;

  const existingUser = await User.findOne({email});

  if (!existingUser) {
    throw new BadRequestError("Invalid Credential");
  }

  const passwordMatch = await Password.compare(
    existingUser.password,
    password
  );
  
  if (!passwordMatch) {
    throw new BadRequestError("Invalid Credentials");

  }

  // /generate JWt

   const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
   },
    process.env.JWT_KEY!
    );

   // Store is on session object

   req.session = {
    jwt: userJwt
   };


  res.status(200).send(existingUser);


}
);


export { router as signinRouter};
