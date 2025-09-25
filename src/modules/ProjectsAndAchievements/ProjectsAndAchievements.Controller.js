import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Team } from "../../../DB/models/Team.js";
import { Achievement, Project } from "../../../DB/models/ProjectsAndAchievements.js";

export const addProject=asyncHandler(async(req,res,next)=>{

    const {projectTitle,projectDescription,fieldOfResearch,projectType}=req.body;
    const {teamId}=req.params
    const team=await Team.findById(teamId)
    if(!team)
    {
        return next(new Error("team not found"))
    }
    if(!team.teamLeader.equals(req.user._id))
    {
        return next(new Error("only team leader can add project"))
    }
    const project=await Project.create({projectTitle,projectDescription,fieldOfResearch,projectType});
    team.projects.push(project._id);
    await team.save();
    return res.json({message:"project created succefuully",project })
})

export const addAchievement=asyncHandler(async(req,res,next)=>{

    const {achievementTitle,achievementDescription,fieldOfResearch}=req.body;
    const {teamId}=req.params
    const team=await Team.findById(teamId)
    if(!team)
    {
        return next(new Error("team not found"))
    }
    if(!team.teamLeader.equals(req.user._id))
    {
        return next(new Error("only team leader can add Achievement"))
    }
    const achievement=await Achievement.create({achievementTitle,achievementDescription,fieldOfResearch});
    team.Achievements.push(achievement._id);
    await team.save();
    return res.json({message:"achievement created succefuully",achievement })
})

export const getProjects=asyncHandler(async(req,res,next)=>{
    const {teamId}=req.params
    const team = await Team.findById(teamId).populate("projects");
    if(!team)
    {
        return next(new Error("team not found"))
    }
    
if (!team.projects || team.projects.length  === 0) {
    return res.json({message:"no projects found for this team"})
}

    return res.json({message:"projects fetched succefuully",projects:team.projects })
})

export const getAchievements=asyncHandler(async(req,res,next)=>{
    const {teamId,AchievementId}=req.params

    const team = await Team.findById(teamId).populate("Achievements");
    if(!team)
    {
        return next(new Error("team not found"))
    }
    
if (!team.Achievements || team.Achievements.length  === 0) {
    return res.json({message:"no Achievements found for this team"})
}

    return res.json({message:"Achievements fetched succefuully",Achievements:team.Achievements })
})

export const getProject=asyncHandler(async(req,res,next)=>{
    const {teamId,projectId}=req.params
    const team = await Team.findById(teamId);
    if(!team)
    {
        return next(new Error("team not found"))
    }
    if(!team.projects.includes(projectId)){
        return next(new Error("this project does not belong to this team"))
    }
    const project=await Project.findById(projectId)
    if(!project)
    {
        return next(new Error("project not found"))
    }   
    return res.json({message:"project fetched succefuully",project })
})

export const getAchievement=asyncHandler(async(req,res,next)=>{
    const {teamId,AchievementId}=req.params
    const team = await Team.findById(teamId);   
    if(!team)
    {
        return next(new Error("team not found"))
    }   
    if(!team.Achievements.includes(AchievementId)){
        return next(new Error("this Achievement does not belong to this team"))
    }
    const achievement=await Achievement.findById(AchievementId)
    if(!achievement)
    {
        return next(new Error("Achievement not found"))
    }   
    return res.json({message:"Achievement fetched succefuully",achievement })
})

export const deleteProject=asyncHandler(async(req,res,next)=>{
    const {teamId,projectId}= req.params;
    const team=await Team.findById(teamId);
    const project=await Project.findById(projectId);
    if(!team){
        return next(new Error("team not found"))
    }
    if(!project){
        return next(new Error("project not found"))
    }
    if(!team.teamLeader.equals(req.user._id)){
        return next(new Error("only team leader can delete project"))
    }

    await Project.findByIdAndDelete(projectId);
    await Team.findByIdAndUpdate(teamId, {$pull:{projects:projectId}});

    return res.json({message:"project deleted successufuly"})
})

export const deleteAchievement=asyncHandler(async(req,res,next)=>{
    const {teamId,AchievementId}= req.params;
    const team=await Team.findById(teamId);
    const achievement=await Achievement.findById(AchievementId);
    if(!team){
        return next(new Error("team not found"))
    }
    if(!achievement){
        return next(new Error("achievement not found"))
    }
    if(!team.teamLeader.equals(req.user._id)){
        return next(new Error("only team leader can delete achievement"))
    }

    await Achievement.findByIdAndDelete(AchievementId);
    await Team.findByIdAndUpdate(teamId, {$pull:{Achievements:AchievementId}});

    return res.json({message:"achievement deleted successufuly"})
})


