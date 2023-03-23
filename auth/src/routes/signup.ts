import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
 // we use the validation result to pull that validation information off
import { validateRequest , BadRequestError} from "@keepklinticket/common/build";
import { User } from "../models/user";
// import { BadRequestError } from "../errors/bad-request-errror";



const router = express.Router();

router.post("/api/users/signup", [
  body("email")
  .isEmail()
  .withMessage("email must be valid !!!!!!"),
  body("password")
  .trim()
  .isLength({min: 4, max: 20})
  .withMessage("password must be between 4 to 20 characters!!!!")
],
validateRequest,
 async (req: Request, res: Response) =>{

  //  const errors = validationResult(req);
  //  if (!errors.isEmpty()) {
  //   // throw new Error("invalide email or password");
  //   throw new RequestValidationError(errors.array());
  //  }::: Note this errror check was removed bcs we intorduced ValidateRequest.

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email })

    if(existingUser){
      throw new  BadRequestError("email in used")
    }
  
  const user = User.build({ email, password});

   await user.save();

   // generate JWt

   const userJwt = jwt.sign({
    id: user.id,
    email: user.email
   },
    process.env.JWT_KEY!
    );

   // Store is on session object

   req.session = {
    jwt: userJwt
   };


  res.status(201).send(user);

});


export { router as signupRouter};
