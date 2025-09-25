import { model, Schema } from "mongoose";

export const ProjectSchema = new Schema({
    projectTitle: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    fieldOfResearch: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        enum: ["Thesis", "Research Paper", "Experiment", "Case Study", "Other"],
        required: true
    },
    /*  uploadFile:{
         type:String,
         required:true
     }, */
},
    {
        timestamps: true
    })

export const AchievementSchema = new Schema({
    achievementTitle: {
        type: String,
        required: true
    },
    achievementDescription: {
        type: String,
        required: true
    },
    fieldOfResearch: {
        type: String,
        required: true
    },
    /*   uploadFile:{
    type:String,
      required:true } */
},
    {
        timestamps: true
    })

export const Project = model("Project", ProjectSchema);
export const Achievement = model("Achievement", AchievementSchema);
