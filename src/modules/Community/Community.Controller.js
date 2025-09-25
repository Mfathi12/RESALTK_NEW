import { asyncHandler } from "../../Utils/asyncHandler.js";
import { User } from "../../../DB/models/User.js";
import { Community } from "../../../DB/models/Community.js";
import { Reply } from "../../../DB/models/Community.js";


export const AddPost=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id;
    const {post}=req.body;
    const user=await User.findById(userId);
    if(!user){
        return next(new Error("user not found"));

    }
    const Post= await Community.create(
        {researchId:userId,
        post,}
    )
    return res.json({message:"post created successufully",Post})
})

export const AddReply=asyncHandler(async(req,res,next)=>{
    const {postId}=req.params;
    const userId=req.user._id;
    const {text}=req.body;

    const user=await User.findById(userId);
    if(!user){
        return next(new Error("user not found"));
    }

    const Post=await Community.findById(postId)
    if(!Post)
    {
        return next (new Error("post not found"))
    }

    Post.replies.push({userId,text})
    await Post.save()
return res.json({message:"repley add successufully",Post})


})

export const GetPost=asyncHandler(async(req,res,next)=>{
    const {postId}=req.params;
    const Post =await Community.findById(postId).populate("researchId","name profilePic").populate("replies.userId","name profilePic")
    if(!Post){
        return next (new Error("post not found"))
    }
    return res.json({messags:"post returned successufully",Post })
})

export const GetAllPosts=asyncHandler(async(req,res,next)=>{
    const Posts=await Community.find();
    return res.json({messages:"posts returned successufully",Posts})
})

export const DeletePost=asyncHandler(async(req,res,next)=>{
    const {postId}=req.params
    const researcherId=req.user._id;
    const Post=await Community.findById(postId);
    if(Post.researchId.toString() !== researcherId.toString() && req.user.accountType !== "admin"){
        return next (new Error("not Authorized to delete this post "))
    }
    await Community.findByIdAndDelete(postId);
    return res.json({messages:"post deleted successufully"})
})

export const DeleteReply=asyncHandler(async(req,res,next)=>{
    const {postId ,replyId}=req.params;
    const researcherId=req.user._id; 
    const Post=await Community.findById(postId);
    if (!Post){
        return next(new Error("not found Post"))
    }
    const reply=Post.replies.id(replyId)
    if (!reply){
        return next(new Error("not found reply"))
    }
    if(reply.userId.toString() !== researcherId.toString() && req.user.accountType !== "admin"){
        return next (new Error("not Authorized to delete this reply "))
    }
    reply.deleteOne()
    return res.json({message:"reply deleted succefuuly"})
    
})