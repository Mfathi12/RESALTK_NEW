import {Router} from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { validate } from "../../MiddleWare/Validation.js";
import * as ServicesController from "./Services.Controller.js";
import * as ServicesSchema from "./Services.Schema.js";
import { Authorization } from "../../MiddleWare/Authorization.js";

const router = Router();
router.get('/getProviderEarnings',Authentication,Authorization("Service Provider"),ServicesController.getProviderEarnings);
router.post('/RE/AddService',Authentication,Authorization("Researcher"),ServicesSchema.validateService, ServicesController.AddService);

router.post('/RE/:teamId/:serviceType',Authentication,Authorization("Researcher"),ServicesSchema.validateService, ServicesController.AddService);
router.get('/admin',Authentication,Authorization("admin"),validate(ServicesSchema.validateStatus),ServicesController.GetServicesByAdmin)
router.get('/RE/Services',Authentication,Authorization("Researcher"),ServicesController.GetUserServices)
router.get('/RE/:teamId/Services',Authentication,Authorization("Researcher"),validate(ServicesSchema.GetTeamServices), ServicesController.GetUserServices);
router.get('/:serviceId',Authentication,validate(ServicesSchema.getSpecificService), ServicesController.GetService)
router.get('/admin/providers/:requestId', Authentication, Authorization("admin"),ServicesController.GetProviders);
router.patch('/admin/assign-provider/:requestId', Authentication, Authorization("admin"),validate(ServicesSchema.AssignProviderByAdmin),ServicesController.AssignProviderByAdmin);
router.post('/provider/:requestId/:providerId/price',Authentication,Authorization("Service Provider"),validate(ServicesSchema.SetProviderPrice),ServicesController.SetProviderPrice);
router.get('/RE/:serviceId/providersAssigned',Authentication,Authorization("Researcher"),validate(ServicesSchema.getprovidersAssigned),ServicesController.getprovidersAssigned)
router.post('/select-provider/:requestId', Authentication, Authorization("Researcher"), ServicesController.SelectProviderByUser);
router.get('/provider/:providerId/allRequests',Authentication,Authorization("Service Provider"),validate(ServicesSchema.GetAllProviderRequests),ServicesController.GetAllProviderRequests);
router.get('/provider/allProviderRequestsAsssigned',Authentication,Authorization("Service Provider"),ServicesController.GetAllProviderRequestsAssigned);

router.post('/provider/providerAddService', Authentication, Authorization("Service Provider"), ServicesController.providerAddService);

router.post('/RE/AddPlan',Authentication,Authorization("Researcher"), ServicesController.AddPlan);
router.get('/admin/Plans',Authentication,Authorization("admin"),ServicesController.GetPlansByAdmin);
router.get('/RE/Plans',Authentication,Authorization("Researcher"),ServicesController.GetUserPlans);
router.patch('/admin/assign-plan-provider/:planId/:serviceId', Authentication, Authorization("admin"),ServicesController.AssignPlanProviderByAdmin);
router.get('/:providerId/services',Authentication,Authorization("Service Provider"),ServicesController.GetservicesByProvider);
router.delete('/removeProvidedService/:serviceId',Authentication,Authorization("Service Provider"),ServicesController.removeProvidedService);
router.post('/provider/handleServiceRequest/:serviceId',Authentication,Authorization("Service Provider"),ServicesController.HandleServiceState )
router.post('/provider/MarkServiceAsCompleted/:serviceId',Authentication,Authorization("Service Provider"), ServicesController.MarkServiceAsCompleted);

router.get('/admin/ProviderActiveProjects/:providerId',Authentication,Authorization("admin"), ServicesController.GetProviderActiveProjects);

export default router;