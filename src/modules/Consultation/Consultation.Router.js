import * as ConsultationController from "./Consultation.Controller.js";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import {Router} from "express";
const router=Router();

router.post('/addAvailableDate',Authentication,Authorization("doctor"),ConsultationController.addDoctorAvailable)
router.get('/getDoctorAvailable',Authentication,Authorization("doctor" ,"Researcher"),ConsultationController.getDoctorAvailable)
router.patch('/updateAvailableDate/:DoctorAvailableId',Authentication,Authorization("doctor"),ConsultationController.updateDoctorAvailable)
router.delete('/deleteAvailableDate/:DoctorAvailableId',Authentication,Authorization("doctor"),ConsultationController.deleteDoctorAvailable)
router.post('/selectAvailableDate/:DoctorAvailableId',Authentication,Authorization("Researcher"),ConsultationController.selectAvailableDate)
router.post('/addConsultation/:doctorId',Authentication,Authorization("Researcher"),ConsultationController.addConsultation)
router.get('/getConsultation',Authentication,Authorization("doctor"),ConsultationController.getConsultation)
router.patch('/updateConsultation/:consultationId',Authentication,Authorization("doctor"),ConsultationController.updateConsultation)
router.get('/getConsultationResearcher',Authentication,Authorization("Researcher"),ConsultationController.getAcceptedConsultation)
router.get('/getOneConsultationById/:ConsultationId',Authentication,Authorization("Researcher"),ConsultationController.getOneConsultationById)

export default router;