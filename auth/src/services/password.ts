import { scrypt, randomBytes} from "crypto";
//import scrypt/randombytes from build in node libry of crypto
import { promisify} from "util";


const scryptAsync = promisify(scrypt);
/* going from a callback base implementation to promise base implementation*/

export class Password {
  static async toHash(password: string)  {
    /* static methods are methods we can access without creating and instance of a class*/

    const salt = randomBytes(8).toString("hex");

    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;

  }
  
  
  static  async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPassword;


  }
}