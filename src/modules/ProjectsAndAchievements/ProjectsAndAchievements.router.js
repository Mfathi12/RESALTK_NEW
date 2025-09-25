import { Router } from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import * as ProjectsAndAchievementsController from "./ProjectsAndAchievements.Controller.js";
import * as ProjectsAndAchievementsSchema from "./ProjectsAndAchievements.Schema.js";
import { validate } from "../../MiddleWare/Validation.js";
const router = Router();

router.post('/:teamId/addProject',Authentication,Authorization("Researcher"),validate(ProjectsAndAchievementsSchema.addProjectSchema),ProjectsAndAchievementsController.addProject)
router.post('/:teamId/addAchievement',Authentication,Authorization("Researcher"),validate(ProjectsAndAchievementsSchema.addAchievement),ProjectsAndAchievementsController.addAchievement)

router.get('/:teamId/getProjects',Authentication,Authorization("Researcher","admin","Service Provider","company"),validate(ProjectsAndAchievementsSchema.getProjects),ProjectsAndAchievementsController.getProjects)
router.get('/:teamId/getAchievements',Authentication,Authorization("Researcher","admin","Service Provider","company"),validate(ProjectsAndAchievementsSchema.getProjects),ProjectsAndAchievementsController.getAchievements)

router.get('/:teamId/getProject/:projectId',Authentication,Authorization("Researcher","admin","Service Provider","company"),validate(ProjectsAndAchievementsSchema.getProject),ProjectsAndAchievementsController.getProject)
router.get('/:teamId/getAchievement/:AchievementId',Authentication,Authorization("Researcher","admin","Service Provider","company"),validate(ProjectsAndAchievementsSchema.getAchievement),ProjectsAndAchievementsController.getAchievement)

router.delete('/:teamId/:projectId', Authentication, Authorization("Researcher"), validate(ProjectsAndAchievementsSchema.getProject), ProjectsAndAchievementsController.deleteProject)
router.delete(':teamId/:AchievementId',Authentication,Authorization("Researcher"),validate(ProjectsAndAchievementsSchema.getAchievement),ProjectsAndAchievementsController.deleteAchievement)

export default router; 