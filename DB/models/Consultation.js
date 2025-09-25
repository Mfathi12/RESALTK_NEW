import { model, Schema } from "mongoose";


export const ConsultationSchema= new Schema({
    resercherId:{type:Schema.Types.ObjectId , ref:"User"},
    doctorId:{type:Schema.Types.ObjectId , ref:"User"},
    date:{type:Date},
    contactType:{type :String, enum:["conference","phone"],required:true},
    startTime: { type: Date},
    endTime: { type: Date},
    purpose:{type:String},
    description:{type:String},
    status:{type:String , enum:["pending","upcominng","past","rejected"], default:"pending"},
},
{
    timestamps: true
})
export const Consultation = model("Consultation", ConsultationSchema);
