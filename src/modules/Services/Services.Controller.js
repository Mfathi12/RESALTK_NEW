import { User } from "../../../DB/models/User.js";
import { Team } from "../../../DB/models/Team.js";
import { Plan } from "../../../DB/models/plan.js";
import { chooseServiceSchema } from "./Services.Schema.js";
import mongoose from "mongoose";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Services } from "../../../DB/models/Services.js";
import { WaitingProviders } from "../../../DB/models/WaitingProviders.js";

//request service by researcher or by teamLeader
/* export const AddService = asyncHandler(async (req, res, next) => {

    //const { teamId, serviceType } = req.params;
    const { teamId, serviceType: serviceTypeParam } = req.params;
    const { serviceType: serviceTypeBody } = req.body;
    const userId = req.user._id;

    let ownerType = "user";
    let ownerId = userId;

    const user = await User.findById(userId);
    if (!user) {
        return next(new Error("User not found"));
    }
    if (teamId) {
        const team = await Team.findById(teamId)
        if (!team) {
            return next(new Error("team not found"))
        }
        if (!team.teamLeader.equals(userId)) {
            return next(new Error("Only team leader can request service for the team"));
        }
        ownerType = "team";
        ownerId = teamId;

    }
    const ServiceData = {
        ownerId,
        serviceType,
        requestName: req.body.requestName,
        uploadFile: req.body.uploadFile,
        description: req.body.description,
        deadline: req.body.deadline,
        status: "new-request",
        details: req.body.details || {}
    };
    const Service = await Services.create(ServiceData);
    if (ownerType === "user") {
        await User.findByIdAndUpdate(
            userId,
            { $push: { services: { name: Service.serviceType } } }
        );
    }

    if (ownerType === "team") {
        await Team.findByIdAndUpdate(teamId, { $push: { services: Service._id } });
    }
    return res.json({
        message: "service request added successfully",
        Service
    })

}) */
export const AddService = asyncHandler(async (req, res, next) => {
    const { teamId, serviceType: serviceTypeParam } = req.params;
    const { serviceType: serviceTypeBody } = req.body;
    const userId = req.user._id;

    const serviceType = serviceTypeParam || serviceTypeBody;
    if (!serviceType) {
        return next(new Error("Service type is required"));
    }

    let ownerType = "user";
    let ownerId = userId;

    const user = await User.findById(userId);
    if (!user) return next(new Error("User not found"));

    if (teamId) {
        const team = await Team.findById(teamId);
        if (!team) return next(new Error("Team not found"));
        if (!team.teamLeader.equals(userId)) {
            return next(new Error("Only team leader can request service for the team"));
        }
        ownerType = "team";
        ownerId = teamId;
    }

    const ServiceData = {
        ownerId,
        serviceType,
        requestName: req.body.requestName,
        uploadFile: req.body.uploadFile,
        description: req.body.description,
        deadline: req.body.deadline,
        amount: 0, // لسه البروفايدر محطش سعر
        paidAmount: 0,
        status: "new-request",
        details: req.body.details || {}
    };

    const Service = await Services.create(ServiceData);

    if (ownerType === "user") {
        await User.findByIdAndUpdate(
            userId,
            { $push: { services: { name: Service.serviceType } } }
        );
    } else {
        await Team.findByIdAndUpdate(teamId, { $push: { services: Service._id } });
    }

    return res.json({
        message: "service request added successfully",
        Service
    });
});

//get services by admin in four status depand on query(in progress,new request ....)
export const GetServicesByAdmin = asyncHandler(async (req, res, next) => {
    const { status } = req.query;
    let filter = {};
    if (filter)
        filter.status = status;
    let projection = {};
    let populateOptions = [];
    switch (status) {
        case "new-request":
            projection = { requestName: 1, serviceType: 1, ownerId: 1 }
        case "provider-selection":
            projection = { requestName: 1, serviceType: 1, ownerId: 1 }
        case "in-progress":
            projection = { requestName: 1, serviceType: 1, deadline: 1, createdAt: 1 };
            break;
        case "completed":
            projection = { requestName: 1, serviceType: 1, selectedProvider: 1, updatedAt: 1 };
            populateOptions = [{ path: "selectedProvider", select: "name email" }];
            break;

        default:
            projection = {};

    }
    let query = Services.find(filter, projection)
    if (populateOptions.length > 0) {
        populateOptions.forEach((p) => {
            query = query.populate(p);
        });
    }

    const services = await query;
    if (status === "in-progress") {
        services.forEach((s) => {
            s = s.toObject();
            s.durationDays = Math.ceil((new Date(s.deadline) - new Date(s.createdAt)) / (1000 * 60 * 60 * 24));
        });
    }
    return res.json({
        message: "All Services requests",
        services
    });
})

//get all services to spesfic user (team or user)
export const GetUserServices = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;
    const userId = req.user._id;
    let services = [];
    if (teamId) {
        const team = await Team.findById(teamId)
        if (!team) {
            return next(new Error("team not found"))
        }
        services = await Services.find({ _id: { $in: team.services } })
            .select('requestName serviceType status description deadline details');

    } else {
        const user = await User.findById(userId)
        if (!user) {
            return next(new Error("User not found"))
        }
        services = await Services.find({ ownerId: userId })
            .select('requestName serviceType status description deadline');
    }

    return res.json({
        message: "User services retrieved successfully",
        count: services.length,
        services
    })
})

//get specific service 
export const GetService = asyncHandler(async (req, res, next) => {

    const { serviceId } = req.params;
    const service = await Services.findById(serviceId)
        .populate('ownerId', 'name email')
        .populate('providerId', 'name email');

    return res.json({
        message: "service that you required",
        service
    })
})

//Get All Providers 
export const GetProviders = asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;

    // 1️⃣ تأكيد وجود الخدمة
    const request = await Services.findById(serviceId);
    if (!request) {
        return next(new Error("Service not found"));
    }

    // 2️⃣ فلترة البروفايدرز اللي بيقدموا نفس نوع الخدمة
    const providers = await User.find({
        accountType: "Service Provider",
        providedServices: request.serviceType
    });

    return res.json({ message: "Providers are available", providers });
});


export const AssignProviderByAdmin = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const { providerIds } = req.body;
    const Service = await Services.findById(requestId);
    if (!Service) {
        return next(new Error("Service request not found", { cause: 404 }));
    }
    const providerObjectIds = providerIds.map(id => new mongoose.Types.ObjectId(id));
    const providers = await User.find({ _id: { $in: providerObjectIds }, accountType: "Service Provider" });
    if (providers.length !== providerIds.length) {
        return next(new Error("One or more providers not found or invalid"));
    }
    Service.candidates.push(...providerObjectIds);
    Service.status = "provider-selection";
    await Service.save();

    const waitingEntries = providerObjectIds.map(id => ({
        requestId: new mongoose.Types.ObjectId(requestId),
        providerId: id
    }));

    const waitingProviders = await WaitingProviders.insertMany(waitingEntries);
    return res.json({
        message: "Providers assigned successfully",
        waitingProviders,
        Service
    });

})

export const SetProviderPrice = asyncHandler(async (req, res, next) => {
    const { requestId, providerId } = req.params;
    const { price , implementationtime} = req.body;

    const entry = await WaitingProviders.findOne({
        providerId: new mongoose.Types.ObjectId(providerId),
        requestId: new mongoose.Types.ObjectId(requestId)
    });

    if (!entry) {
        return next(new Error("No assignment found for this provider and request"));
    }
    const service = await Services.findById(requestId);
    if (!service) {
        return next(new Error("Service not found"));
    }

    if (service.state !== "accept") {
        return next(new Error("Provider not accepted for this service"));
    }
    entry.price = price;
    service.implementationtime=implementationtime;
    service.state="submitted"
    await service.save();

    await entry.save();
    await Services.findByIdAndUpdate(requestId, { $set: { amount: price } })
    return res.json({ message: "Price added successfully", entry });
});

//get provider assigened to service to user
export const getprovidersAssigned = asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const service = await Services.findById(serviceId)
    if (!service) {
        return next(new Error('service not found'))
    }
    if (!service.candidates || service.candidates.length === 0) {
        return next(new Error('No providers assigned yet'))
    }
    const providersAssigned = await User.find({ _id: { $in: service.candidates } })
    return res.json({ message: "provider assigned for this Services", providersAssigned })


})

export const SelectProviderByUser = asyncHandler(async (req, res, next) => {
    const { requestId } = req.params;
    const userId = req.user._id;
    const { providerId } = req.body;
    const Service = await Services.findById(requestId);
    if (!Service) {
        return next(new Error("Service not found", { cause: 404 }));
    }
    if (!Service.ownerId) {
        return next(new Error("Service owner not found"));
    }
    if (Service.ownerId.toString() !== userId.toString()) {
        return next(new Error("Unauthorized action", { cause: 403 }));
    }
    if (!Service.candidates.map(id => id.toString()).includes(providerId)) {
        return next(new Error("Selected provider is not in the candidate list", { cause: 400 }));
    }
    Service.providerId = providerId;
    Service.status = "in-progress";
    await Service.save();
    return res.json({
        message: "Provider selected successfully",
        Service
    });
});

export const GetAllProviderRequests = asyncHandler(async (req, res, next) => {
    const { providerId } = req.params;
    const provider = await User.findOne({ _id: providerId })
    if (!provider) {
        return next(new Error("provider not found"))
    }
    const services = await Services.find({ providerId })
    return res.json({ message: "services", services })
})
export const GetAllProviderRequestsAssigned = asyncHandler(async (req, res, next) => {
    const providerId = req.user._id;

    const provider = await User.findById(providerId);
    if (!provider) {
        return next(new Error("provider not found"));
    }

    const services = await Services.find({ 
        candidates: providerId, 
        status: "provider-selection" 
    });

    const formatted = services.map(service => ({
        _id: service._id,
        title: service.requestName,
        description: service.description,
        deadline: service.deadline,
        serviceType: service.serviceType
    }));

    return res.json({ message: "services", services: formatted });
});

//add plan
export const AddPlan = asyncHandler(async (req, res, next) => {
    const { planName, services } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return next(new Error("User not found"));

    const plan = await Plan.create({
        userId,
        planName,
        services: [],
        status: "new-request"
    });

    for (const s of services) {
        // validate data according to type
        const { error } = chooseServiceSchema(s.serviceType).validate(s);
        if (error) return next(new Error(error.details[0].message));

        const serviceData = {
            ownerId: userId,
            serviceType: s.serviceType,
            requestName: s.requestName,
            description: s.description,
            status: "new-request",
            details: s.details || {}
        };

        const service = await Services.create(serviceData);
        plan.services.push(service._id);
    }

    await plan.save();
    await User.findByIdAndUpdate(userId, { $push: { plan: plan._id } });

    return res.json({
        message: "Plan added successfully",
        plan
    });
});

//get service of plan by admin
export const GetPlansByAdmin = asyncHandler(async (req, res, next) => {
    const plans = await Plan.find()
        .populate({
            path: "services",
            select: "serviceType status requestName description"
        })

    return res.json({
        message: "Plan details",
        plans,

    });
});

//get plan by user 
export const GetUserPlans = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const plans = await Plan.find({ userId });

    return res.json({
        message: "Plans details",
        plans
    });
});

//assign plan to provider
export const AssignPlanProviderByAdmin = asyncHandler(async (req, res, next) => {
    const { planId, serviceId } = req.params;
    const { providerIds } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
        return next(new Error('plan not found'))
    }

    console.log("Plan services:", plan.services);
    console.log("ServiceId from params:", serviceId);

    if (!plan.services.some(s => s.equals(serviceId))) {
        return next(new Error("Service not part of this plan"));
    }

    const service = await Services.findById(serviceId);
    if (!service) return next(new Error("Service not found"));

    const providerObjectIds = providerIds.map(id => new mongoose.Types.ObjectId(id));
    const providers = await User.find({ _id: { $in: providerObjectIds }, accountType: "Service Provider" });
    if (providers.length !== providerIds.length) {
        return next(new Error("One or more providers not found or invalid"));
    }

    service.candidates.push(...providerObjectIds);
    service.status = "provider-selection";
    await service.save();

    const waitingEntries = providerObjectIds.map(id => ({
        requestId: new mongoose.Types.ObjectId(serviceId),
        providerId: id
    }));

    const waitingProviders = await WaitingProviders.insertMany(waitingEntries);
    return res.json({
        message: "Providers assigned successfully",
        waitingProviders,
        plan
    });
});

export const providerAddService = asyncHandler(async (req, res, next) => {
    const providerId = req.user._id;
    const { serviceName, description, languages, tools } = req.body;

    const provider = await User.findOne({ _id: providerId, accountType: "Service Provider" });
    if (!provider) {
        return next(new Error("Provider not found or not authorized"));
    }

    provider.providedServices.push({
        serviceName,
        description,
        languages: languages || [],
        tools: tools || []
    });

    await provider.save();

    return res.json({
        message: "Service added successfully",
        providedServices: provider.providedServices
    });
});

export const removeProvidedService = asyncHandler(async (req, res, next) => {
    const providerId = req.user._id;
    const { serviceId } = req.params;

    const provider = await User.findOne({ _id: providerId, accountType: "Service Provider" });
    if (!provider) {
        return next(new Error("Provider not found or not authorized"));
    }
    const updateProviderServices = await User.findByIdAndUpdate({ _id: providerId }, { $pull: { providedServices: { _id: serviceId } } }, {
        new: true
    });



    return res.json({
        message: "Service deleted successfully",
        providedServices: updateProviderServices.providedServices
    });
})

export const GetservicesByProvider = asyncHandler(async (req, res, next) => {
    const providerId = req.user._id;
    const provider = await User.findOne({ _id: providerId })
    if (!provider) {
        return next(new Error("provider not found"))
    }
    const services = await Services.find({ providerId })
    return res.json({ message: "services", services })
})

export const getProviderEarnings = asyncHandler(async (req, res, next) => {
    const providerId = req.user._id;

    const completedServices = await Services.find({
        providerId,
        status: "completed"
    });

    if (!completedServices.length) {
        return res.json({
            message: "No completed services found",
            totalEarnings: 0,
            services: []
        });
    }

    let totalEarnings = 0;
    const services = completedServices.map((s) => {
        totalEarnings += s.amount || 0;

        return {
            date: s.createdAt,
            serviceName: s.requestName || s.serviceType,
            description: s.description || "",
            earnings: s.amount || 0
        };
    });

    return res.json({
        message: "Provider services with earnings",
        totalEarnings,
        services
    });
});

export const HandleServiceState = asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const providerId = req.user._id;
    const { state } = req.body;
    const service = await Services.findById(serviceId)
    if (!providerId) {

    }
    if (!service) {
        return next(new Error("service not found"))
    }
    if (state === "accept") {
        service.state = "accept";
        await service.save()
        return res.json({
            message: "Provider accepted successfully, waiting for price submission",
            service
            
        });
    }
    if (state === "reject") {
        await Services.findByIdAndUpdate(serviceId , { $pull: { candidates: providerId } })
        await WaitingProviders.findOneAndDelete({
            requestId: serviceId,
            providerId: providerId,
        });
        await service.save()

        return res.json({
            message: "Provider rejected successfully and removed from candidates/waiting list",
        });
    }
    return next(new Error("Invalid state, must be 'accept' or 'reject'"));

})