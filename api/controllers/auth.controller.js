import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    //   next(errorHandler(550, 'error from function we created for the sign in')); // we dont need here now
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email: email }); // { database ka attribute : req.body wala var}
    if (!validUser) return next(errorHandler(404, "User not Found!!")); // error is handled by the custom middleware in error.js
    const validPassword = bcryptjs.compareSync(password, validUser.password); //jo user hai uska respectie password
    if (!validPassword) return next(errorHandler(401, "Wrong Credential"));

    // when both email and password are correct then add cookie into the browser
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    //Destructure the password
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest); //only a session
    // rest is the new json array passed to fronten with no password appended to it
    // {httpOnly: true, expires: new Date(Date.now()+24*60*60secs*1000days)}
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc; // seperating the password and not sending it back to the page
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } 
    else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next)=>{
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
  } catch (error) {
    next(error)
  }
}
