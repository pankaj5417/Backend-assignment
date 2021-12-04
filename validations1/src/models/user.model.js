const {Schema, model }=require("mongoose")

const userSchema=new Schema({

    first_name: { type: String, required: true},

    last_name: { type: String, required: true },

    email: { type: String, required: true },

    age: {type:Number, required: true },

     gender: { type:String, required:true},

     pincode: {type:Number, required: true },

},{
    versionKey:false,
    timestamps:true
    
})

module.exports=model("user", userSchema)