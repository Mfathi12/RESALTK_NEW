import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Services } from "../../../DB/models/Services.js";
import { Team } from "../../../DB/models/Team.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  // الحالة الوحيدة اللي بنحسب فيها إحصائيات خاصة
  if (user.accountType === "Service Provider") {
    const completedServices = await Services.find({
      providerId: user._id,
      status: "completed",
    });

    const completedCount = completedServices.length;
    const totalEarnings = completedServices.reduce(
      (sum, service) => sum + (service.amount || 0),
      0
    );

    const providedCount = user.providedServices
      ? user.providedServices.length
      : 0;

    user.stats = {
      completedServices: completedCount,
      earnings: totalEarnings,
      providedServicesCount: providedCount,
    };
  }

  // غير كده.. رجّع كل التفاصيل زي ما هي
  return res.json({
    message: "User retrieved successfully",
    user,
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
export const AddDoctor = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const existingDoctor = await User.findOne({ email });
  if (existingDoctor) {
    return next(new Error("Doctor already exists"));
  }

  let profilePic = null;
  if (req.file) {
    profilePic = req.file.filename;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const doctor = await User.create({
    ...req.body,
    password: hashedPassword,
    accountType: "doctor",
    profilePic,
    isApproved: true,
  });

  return res.json({ message: "Doctor added successfully", doctor });
});

export const getPendingProvidersPendingTeams = asyncHandler(async (req, res, next) => {
  // 1️⃣ Pending Providers
  const pendingProviders = await User.find({
    accountType: 'Service Provider',
    isApproved: false,
    isBanned: false
  }).select("name providedServices.serviceName");

  // 2️⃣ Pending Teams
  const pendingTeams = await Team.find({
    isApproved: false,
    isBanned: false
  })
    .select("teamName description fieldOfResearch teamLeader members")
    .populate("teamLeader", "name profilePic")
    .populate("members.user", "name profilePic");

  // 3️⃣ Return merged response
  return res.json({
    message: "Pending entities fetched successfully",
    pending: {
      providers: pendingProviders,
      teams: pendingTeams
    }
  });
});

export const updateProviderAccountStatus =asyncHandler(async(req,res,next)=>{
    const {providerId}=req.params;
    const provider=await User.findById(providerId);
    const {state}=req.body;
    if(!provider  || provider.accountType !== "Service Provider"){
        return next(new Error("provider not found"))
    }
    if(state=== 'approve')
    {
        provider.isApproved=true;
        provider.isBanned=false;
    }else if(state==='ban'){
        provider.isApproved=false;
        provider.isBanned=true;
    } else {
        return next(new Error("Invalid state"));
    }

    await provider.save()
   return res.json({
  message: `Provider account has been ${state}d successfully`,
  provider,
});
})

export const updateTeamStatus = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;
  const { state } = req.body; // ممكن تكون "approve" أو "ban"

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new Error("Team not found"));
  }

  if (state === "approve") {
    team.isApproved = true;
    team.isBanned = false;
  } else if (state === "ban") {
    team.isApproved = false;
    team.isBanned = true;
  } else {
    return next(new Error("Invalid state value"));
  }

  await team.save();

  return res.json({
    message: `Team has been ${state}d successfully`,
    team
  });
});
export const getApprovedProvidersAndTeams = asyncHandler(async (req, res, next) => {
  // ✅ Approved Providers
  const approvedProviders = await User.find({
    accountType: 'Service Provider',
    isApproved: true,
    isBanned: false
  }).select("name providedServices.serviceName");

  // ✅ Approved Teams
  const approvedTeams = await Team.find({
    isApproved: true,
    isBanned: false
  })
    .select("teamName description fieldOfResearch teamLeader members")
    .populate("teamLeader", "name profilePic")
    .populate("members.user", "name profilePic");

  return res.json({
    message: "Approved entities fetched successfully",
    approved: {
      providers: approvedProviders,
      teams: approvedTeams
    }
  });
});
