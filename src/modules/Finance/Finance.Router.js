import {Router} from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import * as FinanceController from "./Finance.Controller.js"

const router=Router();
router.get("/countTotalRequests",Authentication,Authorization("admin"),FinanceController.countTotalRequests)
router.get("/recent-payments",Authentication,Authorization("admin"),FinanceController.recentPayments)
router.get("/yearly-report",Authentication,Authorization("admin"),FinanceController.yearlyReport) 
router.get("/most-used-services",Authentication,Authorization("admin"),FinanceController.mostUsedServices)

export default router;