import {Router } from "express";
import * as AuthController from "./Auth.Controller.js";
import * as AuthSchema from "./Auth.Schema.js";
//import { fileUpload } from "../../Utils/multer.js";
import { validate } from "../../MiddleWare/Validation.js";

const router = Router();


router.post(
  "/register",
  //fileUpload().single("cv"), 
  AuthSchema.chooseSchema, 
  AuthController.register
);
router.post("/login",validate(AuthSchema.LoginSchema) ,AuthController.login);
router.post("/forget-password",validate(AuthSchema.forgetPasswordSchema),AuthController.forgetPassword);
router.post("/reset-password",validate(AuthSchema.resetPasswordSchema),AuthController.resetPassword);
router.post("/verify-otp",validate(AuthSchema.resetPasswordSchema),AuthController.verifyOTP);


export default router;