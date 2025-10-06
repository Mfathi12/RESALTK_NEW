import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Services } from "../../../DB/models/Services.js";

export const countTotalRequests = asyncHandler(async (req, res, next) => {
    const totalRequests = await Services.countDocuments({ status: "completed" })
    const totalRevenue = await Services.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);
    const totalPayments = await Services.aggregate([
        { $match: { status: "completed", paymentStatus: "paid" } },
        { $group: { _id: null, sum: { $sum: "$paidAmount" } } }
    ]);
    res.json({
        success: true,
        totalRequests,
        totalRevenue: totalRevenue[0]?.sum || 0,
        totalPayments: totalPayments[0]?.sum || 0,
    });
})

export const recentPayments = asyncHandler(async (req, res) => {
        const payments = await Services.find({ status: "completed" })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select("userName amount description");

        res.json({ success: true, payments });
        res.status(500).json({ success: false, message: err.message });
    
})

export const yearlyReport = asyncHandler(async (req, res) => {

        const report = await Services.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json({ success: true, report });

        res.status(500).json({ success: false, message: err.message });
    
})

export const mostUsedServices = asyncHandler(async (req, res) => {

        const mostUsed = await Services.aggregate([
            { $group: { _id: "$serviceType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({ success: true, mostUsed });

        res.status(500).json({ success: false, message: err.message });
    
})
