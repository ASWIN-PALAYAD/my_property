import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//user sign up
export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, password, email } = req.body;

  const userExist = await User.findOne({ username });
  if (userExist) {
    next(errorHandler(508, "user already registerd"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  try {
    await newUser.save();
    res.status(201).json({
      message: "user Created",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

//user sign in
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = await bcrypt.compare(password, validUser?.password);
    if (!validPassword) {
     return next(errorHandler(404, "Invalid Credentials"));
    }

    const token = jwt.sign({ id: validUser?._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    const {password:pass,...userDetails} = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({message:"logged in successfully",userDetails});
  } catch (error) {
    next(error);
  }
};

//google auth
export const google = async (req,res,next) => {
  try {
    const user = await User.findOne({email:req.body.email});
    if(user){
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
      const {password:pass, ...rest} = user._doc;
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    }else{
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatePassword,10);
      const newUser = new User({
        username:req.body.name.split(' ').join('').toLowerCase()+Math.random().toString(36).slice(-4),
        email:req.body.email,
        password:hashedPassword,
        avatar:req.body.photo
      })
      await newUser.save();
      const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
      const {password:pass,...rest} = newUser._doc;
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    }
  } catch (error) {
    next(error)
  }
}

//user signout
export const signout = async(req,res,next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error)
  }
} 
