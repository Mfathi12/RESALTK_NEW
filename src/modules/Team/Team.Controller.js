import { Team } from "../../../DB/models/Team.js";
import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

export const AddTeam = asyncHandler(async (req, res, next) => {
    if (req.file) {
        req.body.image = req.file.path;
    }

    req.body.teamLeader = req.user._id;
    const existingTeam = await Team.findOne({ name: req.body.teamName });
    if (existingTeam) {
        return next(new Error("team already exists"));
    }
    const team = await Team.create(req.body);
    return res.json({ messag: "team created succefuully", team })
})

export const GetTeam = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params
    const team = await Team.findById(teamId).populate('teamLeader', 'name email')
        .populate('projects')
        .populate('Achievements')
        .populate('services');
    if (!team) {
        return next(new Error("team not found"))
    }
    return res.json({ messag: "fetched team", team })
})

export const GetTeams = asyncHandler(async (req, res, next) => {
    const teams = await Team.find().select("teamName description fieldOfResearch teamLeader members")
        .populate("teamLeader", "name profilePic")
        .populate("members.user", "name profilePic");
    //members images
    if (!teams || teams.length === 0) {
        return next(new Error("teams not found"))
    }
    return res.json({ messag: "fetched teams", teams })
})

export const sendJoinRequest = asyncHandler(async (req, res, next) => {
    const { teamId, userId } = req.params;
    const { name, university, educationLevel, degree } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
        return next(new Error("Team not found"));
    }
    if (team.teamFormation !== "I Need to Hire Members") {
        return next(new Error("This team is not open to new members"));
    }
    if (team.teamLeader.toString() === userId) {
        return next(new Error("Team leader cannot send join request to their own team"));
    }
    const user = await User.findById(userId)
    if (!user) {
        return next(new Error("user not found"))
    }
    if (team.members.some(member => member.user.toString() === userId)) {
        return next(new Error("You are already a member of this team"));
    }
    const alreadyRequested = team.pendingRequests.some(request => request.user.toString() === userId);
    if (alreadyRequested) {
        return next(new Error("You have already sent a join request to this team"));
    }
    team.pendingRequests.push({ user: userId, name, university, educationLevel, degree });
    await team.save();
    return res.json({ message: "Join request sent successfully" });

})

export const handleJoinRequest = asyncHandler(async (req, res, next) => {
    const { teamId, requestId } = req.params;
    const { action } = req.body;
    const team = await Team.findById(teamId);
    if (!team) {
        return next(new Error("Team not found"));
    }
    if (team.teamLeader.toString() !== req.user._id.toString()) {
        return next(new Error("Only the team leader can handle join requests"));
    }
    const request = team.pendingRequests.id(requestId);
    if (!request) {
        return next(new Error("Join request not found"));
    }
    if (action === 'accept') {
        team.members.push({ user: request.user });
        request.deleteOne()
    } else if (action === 'deney') {
        request.deleteOne();
    }

    await team.save();
    return res.json({ message: `Join request ${action}ed successfully` });
});

export const DeleteTeam = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;
    const {userId} = req.user._id;
    const team = await Team.findById(teamId);
    if (!team) {
        return next(new Error("team not found"))
    }
    if (team.teamLeader.toString() === userId) {
        return next(new Error("Team leader cannot send join request to their own team"));
    } 
await Team.findByIdAndDelete(teamId);
    return res.json({ messag: "team deleted succefuully", team })
})

export const LeaveTeam = asyncHandler(async (req, res, next) => {
    const { teamId, userId } = req.params;   
    const actingUser = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) {
        return next(new Error("Team not found"));
    }

    
    if (actingUser.toString() === userId) {
        if (team.members.some(member => member.user.toString() === userId)) {
            team.members.pull({ user: userId });
            await team.save();
            return res.json({ message: "You have left the team successfully" });
        } else {
            return next(new Error("You are not a member of this team"));
        }
    }


    if (team.teamLeader.toString() === actingUser.toString()) {
        if (team.members.some(member => member.user.toString() === userId)) {
            team.members.pull({ user: userId });
            await team.save();
            return res.json({ message: "Member removed from the team successfully" });
        } else {
            return next(new Error("This user is not a member of the team"));
        }
    }
    return next(new Error("You are not authorized to remove this member"));
});
