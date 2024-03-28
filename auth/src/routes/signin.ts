import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { Password } from "../services/password";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new BadRequestError("Invalid credentials");

    const passwordsMatch = await Password.compare(user.password, password);

    if (!passwordsMatch) throw new BadRequestError("Invalid credentials");

    // generate json web token
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // store jwt in session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
