import { model, Schema, Types } from "mongoose";
export const TeamSchema = new Schema({
    teamName: {
        type: String,
        required: true
    },
    teamLeader: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    teamLeaderRole: {
        type: String
    },
    fieldOfResearch: {
        type: String
    },
    members: [{
        user: { type: Types.ObjectId, ref: "User" },
        role: { type: String }
    }],
    projects: [{
        type: Types.ObjectId,
        ref: "Project"
    }],
    Achievements: [{
        type: Types.ObjectId,
        ref: "Achievement"
    }],
    Events: [{
        type: Types.ObjectId,
        ref: "Event"
    }],
    News: [{
        type: Types.ObjectId,
        ref: "News"
    }],
    services: [{
        type: Types.ObjectId,
        ref: "Services"
    }],
    description: {
        type: String
    },
    teamFormation: {
        type: String,
        enum: ["I Have My Team", "I Need to Hire Members"]
    },
    jobTitle: {
        type: String,
    },
    requiredSkills: {
        type: String,
    },
    image: {
        type: String
    },

    pendingRequests: [{
        user: { type: Types.ObjectId, ref: "User", },
        name: String,
        university: String,
        educationLevel: String,
        degree: String,
        major: String,
        cv: String,
    }]

}, {
    timestamps: true
})

export const Team = model("Team", TeamSchema)