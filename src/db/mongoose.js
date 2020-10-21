const mongoose=require('mongoose')
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})

const Task=mongoose.model('Task',{
    description:{
        type:String
    },
    completed:{
        type:Boolean
    }  
})
