import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Consultation } from "../../../DB/models/Consultation.js";
import { User } from "../../../DB/models/User.js";
import { DoctorAvailable } from "../../../DB/models/DoctorAvailable.js";

export const addDoctorAvailable = asyncHandler(async (req, res, next) => {
    const doctorId=req.user._id;
    const user=await User.findById(doctorId);
    if(!user){
        return next(new Error("User not found"))
    }
    const {  date, startTime, endTime } = req.body;
    const doctorAvailable = await DoctorAvailable.create({ doctorId , date, startTime, endTime });
    return res.json({
        message: "Doctor Available Time added successfully",
        doctorAvailable
    })
})

export const getDoctorAvailable = asyncHandler(async (req, res, next) => {
    const doctorId=req.user._id;
    const user=await User.findById(doctorId);
    if(!user){
        return next(new Error("User not found"))
    }
    const doctorAvailable = await DoctorAvailable.find({ doctorId });
    return res.json({
        message: "Doctor Available Time",
        user,
        doctorAvailable
    })
})
export const deleteDoctorAvailable = asyncHandler(async (req, res, next) => {
    const doctorId=req.user._id;
    const user=await User.findById(doctorId);
    if(!user){
        return next(new Error("User not found"))
    }
    const doctorAvailableId = req.params.DoctorAvailableId;
    const doctorAvailable = await DoctorAvailable.findByIdAndDelete(doctorAvailableId);
    return res.json({
        message: "Doctor Available Time deleted successfully",
        doctorAvailable
    })
})
export const updateDoctorAvailable = asyncHandler(async (req, res, next) => {
    const doctorId=req.user._id;
    const user=await User.findById(doctorId);
    if(!user){
        return next(new Error("User not found"))
    }
    const doctorAvailableId = req.params.DoctorAvailableId;
    const { date, startTime, endTime } = req.body;
    const doctorAvailable = await DoctorAvailable.findById(doctorAvailableId);
    if (!doctorAvailable) {
        return next(new Error("Doctor Available Time not found"));
    }
    doctorAvailable.date = date || doctorAvailable.date;
    doctorAvailable.startTime = startTime || doctorAvailable.startTime;
    doctorAvailable.endTime = endTime || doctorAvailable.endTime;
    await doctorAvailable.save();
    return res.json({
        message: "Doctor Available Time updated successfully",
        doctorAvailable
    })
})
export const selectAvailableDate = asyncHandler(async (req, res, next) => {
    const resercherId=req.user._id;
    const doctoravailableId=req.params.DoctorAvailableId;
    const user=await User.findById(resercherId);
    if(!user){
        return next(new Error("User not found"))
    }
    const doctorAvailable = await DoctorAvailable.findById(doctoravailableId);
    if (!doctorAvailable || doctorAvailable.status === "booked") {
        return next(new Error("Doctor is not Available in this time"));
    }

     const { doctorId, date, startTime, endTime } = doctorAvailable;
     const { purpose, description, contactType}=req.body;
      const consultation = await Consultation.create({ resercherId,doctorId ,contactType, date, startTime, endTime ,purpose,description});
    return res.json({
        message: "Consultation added successfully",
        consultation
    })

})

export const addConsultation = asyncHandler(async (req, res, next) => {
    const resercherId=req.user._id;
    const doctorId = req.params.doctorId;
    const user=await User.findById(resercherId);
    if(!user){
        return next(new Error("User not found"))
    }
    const {date, startTime, endTime,purpose, description ,contactType} = req.body;
    const consultation = await Consultation.create({resercherId,doctorId, date, startTime,contactType,endTime ,purpose,description});
    return res.json({
        message: "Consultation added successfully",
        consultation
    })
})

export const getConsultation = asyncHandler(async (req, res, next) => {
    const doctorId=req.user._id;
    const user=await User.findById(doctorId);
    if(!user){
        return next(new Error("User not found"))
    }
    await Consultation.updateMany(
        { status: "upcominng", endTime: { $lt: new Date() } },
        { $set: { status: "past" } }
    );
    const pendingConsultations = await Consultation.find({status:"pending",doctorId}).populate("resercherId","name profilePic");
    const upcominngConsultations = await Consultation.find({status:"upcominng",doctorId}).populate("resercherId","name profilePic");
    const pastConsultations = await Consultation.find({status:"past",doctorId}).populate("resercherId","name profilePic");
    return res.json({
        message: "all Consultations",
        pendingConsultations,
        upcominngConsultations,
        pastConsultations
    })
})

export const updateConsultation = asyncHandler(async (req, res, next) => {
    const consultationId = req.params.consultationId;
    const { status } = req.body;
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
        return next(new Error("Consultation not found"));
    }
    
    consultation.status = status;
    await consultation.save();
    return res.json({
        message: "Consultation updated successfully",
        consultation
    })
})

export const getAcceptedConsultation =asyncHandler(async (req,res,next)=>{
    const resercherId=req.user._id;
    const user=await User.findById(resercherId);
    if(!user){
        return next(new Error("User not found"))
    }
    const upcominngConsultations = await Consultation.find({status:"upcominng",resercherId}).populate("doctorId","name profilePic");
   const doctors = await User.find({accountType:'doctor'})
    return res.json({
        message: "Consultation updated successfully",
        upcominngConsultations,
        doctors
    })
})

export const getOneConsultationById = asyncHandler(async (req, res,next)=>{
    const resercherId=req.user._id;
    const user=await User.findById(resercherId);
    if(!user){
        return next(new Error("User not found"))
    }
    const ConsultationId = req.params.ConsultationId;
    const consultation = await Consultation.findById(ConsultationId)
    return res.json({
        success :true,
        consultation
    })
})
