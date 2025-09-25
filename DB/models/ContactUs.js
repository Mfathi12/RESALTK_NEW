import { model, Schema } from "mongoose";

export const contactSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export const Contact=model("Contact",contactSchema);
