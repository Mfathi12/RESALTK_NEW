import {Router} from "express";
import * as UserController from "./User.Controller.js";
import * as UserSchema from "./User.Schema.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { validate } from "../../MiddleWare/Validation.js";
//import { fileUpload } from "../../Utils/multer.js";

const router =Router();
router.get('/getProviderServices',Authentication,UserController.getProviderServices);

router.get("/:id",Authentication,validate( UserSchema.UserIdSchema), UserController.getUserById);
router.post("/admin/account/doctor",Authentication,Authorization("admin"),
//fileUpload().single("image"), 
validate(UserSchema.AddDoctor),UserController.AddDoctor)
router.get("/providers",Authentication,Authorization("admin"), UserController.getProviders);
router.patch("/update", Authentication,validate(UserSchema.updateUserSchema), UserController.updateUser);

router.post("/updateProviderAccountStatus/:providerId",Authentication,Authorization("admin"), UserController.updateProviderAccountStatus)
router.get("/getPendingProviders",Authentication,Authorization("admin"), UserController.getPendingProviders)
//router.delete("/:id",validate(UserSchema.UserIdSchema), UserController.deleteUser);

export default router;
