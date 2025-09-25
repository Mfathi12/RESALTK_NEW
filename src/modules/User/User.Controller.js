import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Services } from "../../../DB/models/Services.js";

export const getAllUsers=asyncHandler(async (req, res,next) => {
    const users = await User.find().select("-password -otp -__v");
    return res.json({
        message: "Users retrieved successfully",
        users
    })
})

export const getUserById = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id)
        .select("-password -otp -__v")
        .lean();

    if (!user) {
        return next(new Error("User not found"));
    }

    if (user.accountType === "Service Provider") {
        const completedServices = await Services.find({
            providerId: user._id,
            status: "completed"
        });

        const completedCount = completedServices.length;
        const totalEarnings = completedServices.reduce(
            (sum, service) => sum + (service.amount || 0),
            0
        );

        const providedCount = user.providedServices ? user.providedServices.length : 0;

        user.stats = {
            completedServices: completedCount,
            earnings: totalEarnings,
            providedServicesCount: providedCount
        };
    }

    return res.json({
        message: "User retrieved successfully",
        user
    });
});

export const updateUser=asyncHandler(async (req, res,next) => {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new Error("User not found"));
    }

    return res.json({
        message: "User updated successfully",
        user
    });
})           

export const getProviderServices = asyncHandler(async (req, res, next) => {
    const providerId = req.user._id; 
    const provider = await User.findOne({ _id: providerId, accountType: "Service Provider" });
    if (!provider) {
        return next(new Error("Provider not found or not authorized"));
    }

    return res.json({
        message: "Services provided by the provider",
        providedServices: provider.providedServices
    });
});
/* export const deleteUser=asyncHandler(async (req, res ,next) => {
    const user = await User.findByIdAndDelete(req.params.id);   
    if (!user) {
        return next (new Error ("User not found" ));
    }   
    return res.json({
        message: "User deleted successfully",
        user
    });
}) */

export const getProviders=asyncHandler(async (req, res,next) => {
    const providers = await User.find({ accountType: "provider" }).select("-password -otp -__v");
    return res.json({
        message: "Providers retrieved successfully",
        providers
    });
}) 

export const AddDoctor=asyncHandler(async (req,res,next)=>{
    const {email,password}= req.body;
    const doctor=await User.findOne(email)
    if(doctor)
    {
        return next(new Error("docto is already exsist"))
    }
        let profileImage = null;
    if (req.file) {
    profileImage = req.file.filename; 
    }
    const Doctor =await User.create(req.body)
    return res.json({message:"doctor added succefully",Doctor})
})