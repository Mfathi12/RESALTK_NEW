import { Team } from "../../../DB/models/Team.js";
import { Event, News ,Application} from "../../../DB/models/EventsAndNews.js";
import { Achievement } from "../../../DB/models/ProjectsAndAchievements.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { User } from "../../../DB/models/User.js";


export const addEvent = asyncHandler(async(req,res,next)=>{
    const { teamId } = req.params;
    const { eventTitle, eventDescription, eventDate, location, totalPositionNeeded } = req.body;
    const team = await Team.findById(teamId);
    if (!team) {
        return next(new Error("Team not found"));
    }
        if (team.teamLeader.toString() !== req.user._id.toString()) {
    return next(new Error("Only the team leader can handle join requests"));}

    const newEvent=await Event.create({ eventTitle, eventDescription, eventDate, location, totalPositionNeeded });
    team.Events.push(newEvent._id);
    await team.save();
    return res.json({ message: "Event added successfully", event: newEvent })
})

export const addNews= asyncHandler(async(req,res,next)=>{
    const {newsTitle,newsDescription,image}=req.body;
    const newNews=await News.create({newsTitle,newsDescription,image});
    return res.json({message:"News added successfully",news:newNews}) 
})
//get all news,events and achievements
export const getAllNews=asyncHandler(async(req,res,next)=>{
    const news=await News.find();
    const events=await Event.find();
    const Achievements=await Achievement.find();
    if(!news ||news.length===0)
    {
        return res.json({message:"no news found"})
    }
    return res.json({message:"news fetched successfully",news ,events ,Achievements})
})

export const getAllEvents=asyncHandler(async(req,res,next)=>{
    const events=await Event.find();        
    if(!events || events.length===0)
    {
        return res.json({message:"no events found"})
    }       
    return res.json({message:"events fetched successfully",events })
})

export const getEvent=asyncHandler(async(req,res,next)=>{
    const {eventId}=req.params;
    const updates=req.body;
    const event=await Event.findById(eventId);
    if (!event) return next(new Error("Event not found", { cause: 404 }));

    return res.json({messags:"event showed successfully", event})
})

export const updateNew=asyncHandler(async(req,res,next)=>{
    const {newId}=req.params;
    const updates=req.body;
    const New = await News.findById(newId);
    if(!New){
        return next(new Error("new not found"))
    }

    Object.keys(updates).forEach((key)=>{
        New[key]=updates[key];
    });
    await New.save();
    return res.json({message:"News updated successfully",New})


})

export const deleteEvent=asyncHandler(async(req,res,next)=>{
    const {eventId}=req.params;
    const user=req.user;
    const event=await Event.findById(eventId);
    if(!event){
        return next(new Error("Event not found"))
    }
    if(user.role!==event.createdBy.toString()){
        return next(new Error("Only admin can delete events or only the creator can delete the event"))
    }
    await event.deleteOne();
    return res.json({message:"Event deleted successfully"})
})

export const deleteNew=asyncHandler(async(req,res,next)=>{
    const {newId}=req.params;
    const user=req.user;
    const neww=await News.findById(newId);
    if(!neww){
        return next(new Error("News not found"))
    }
    await neww.deleteOne();
    return res.json({message:"New deleted successfully"})
})

export const ApplyForEvent=asyncHandler(async(req,res,next)=>{
    const {eventId}=req.params;
    const userId = req.user._id;
    const event=await Event.findById(eventId) 
    if(!event){
        return next(new Error("event not found"))
    }
    const user=await User.findById(userId);
    if(!user){
        return next (new Error("user not found"))
    }
    const existingUser=await User.findOne({userId,eventId})
      if (existingApplication) {
    return next(new Error("You already applied for this event"));
  }
    const application=await Application.create({
    userId,
    eventId,
    fullName: user.name,
    educationalLevel: user.educationLevel,
    university: user.university,
    degree: user.degree,
    major: user.major,
    //cv: user.cv,
    })
      return res.json({
    message: "Apply done successfully",
    application
  });
})



