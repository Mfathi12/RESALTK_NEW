import {Router} from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import * as contactController from "./ContactUs.Controller.js";

const router=Router();

router.post('/contact',Authentication,Authorization("Researcher","Service Provider"),contactController.sendContact)
router.get('/contact',Authentication,Authorization("admin"),contactController.getContact)
export default router;