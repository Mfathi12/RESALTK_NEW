import { Router } from "express";
import * as TeamSchema from "./Team.Schema.js";
import * as TeamController from "./Team.Controller.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { validate } from "../../MiddleWare/Validation.js";
//import { fileUpload } from "../../Utils/multer.js";

const router = Router();
router.post('/addTeam',Authentication,Authorization("Researcher"),
    //fileUpload.single('image'),
    validate(TeamSchema.AddTeamSchema),
    TeamController.AddTeam
);
router.get('/:teamId',Authentication, validate(TeamSchema.GetTeamSchema),Authorization("Researcher","admin","Service Provider","company"),TeamController.GetTeam)
router.get('/',Authentication,Authorization("Researcher","admin","Service Provider","company"),TeamController.GetTeams)
router.post('/:teamId/join/:userId',Authentication,Authorization("Researcher"),validate(TeamSchema.sendJoinRequestSchema),TeamController.sendJoinRequest)
router.post('/:teamId/action/:requestId',Authentication,Authorization("Researcher"),validate(TeamSchema.handleJoinRequestSchema),TeamController.handleJoinRequest)
router.delete('/:teamId',Authentication,Authorization("Researcher"),validate(TeamSchema.DeleteTeamSchema),TeamController.DeleteTeam)
router.delete('/:teamId/:userId',Authentication,Authorization('Researcher') ,validate(TeamSchema.LeaveTeamSchema),TeamController.LeaveTeam)
export default router;
