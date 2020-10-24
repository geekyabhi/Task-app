const mongoose=require('mongoose')
require('dotenv').config({
    path: './config/dev.env'
})
const connectDB=async ()=>{
    try{            
        const conn=await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log(`MongoDB connected at ${conn.connection.host}`)
    }catch(e){
        console.log('Cannot connect MongoDB',e)
    }
}
connectDB()

const Task=mongoose.model('Task',{
    description:{
        type:String
    },
    completed:{
        type:Boolean
    }  
})
