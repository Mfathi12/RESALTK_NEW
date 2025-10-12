import { model, Schema ,Types } from "mongoose";

export const EventSchema = new Schema({
    eventTitle:{
        type:String,
        required:true
    },
    eventDescription:{
        type:String,
        required:true
    },
    eventDate:{
        type:Date,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    totalPositionNeeded:{
        type:Number,
        required:true
    }
},{
    timestamps: true
});
export const NewsSchema = new Schema({
    newsTitle:{
        type:String,
        required:true
    },
    newsDescription:{
        type:String,
        required:true
    },
    image:{
        type:String,
        //required:true
    }
},{
    timestamps: true
});

const ApplicationSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  eventId: { type: Types.ObjectId, ref: "Event", required: true },
  Name: String,
  educationalLevel: String,
  university: String,
  degree: String,
  major: String,
  cv: String,
}, { timestamps: true });

export const Event=model("Event",EventSchema);
export const News=model("News",NewsSchema);
export const Application = model("Application", ApplicationSchema);
