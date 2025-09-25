import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Contact } from "../../../DB/models/ContactUs.js";
import { User } from "../../../DB/models/User.js";

export const sendContact =asyncHandler(async(req,res,next)=>{
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user){
        return next(new Error("User not found"))
    }
    const {message}=req.body;
    const contact=await Contact.create({message,userId})
    return res.json({
        message:"message sent successfully",
        contact
    })
})

export const getContact=asyncHandler(async(req,res,next)=>{
    const contact=await Contact.find()
    return res.json({
        contact
    })
})