const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Tasks = require('./task')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not a valid email')
            }
        }
    },
    password:{
        type:String,
        require:true,
        trim:true,
        minlength:7,
        trim:true,
        lowercase:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Cant contain password')
            }
        }
    },
    age:{
        type:Number,
        // required:true,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})
// userSchema.methods.toJSON=async function(){
//     const user=this
//     const userObject=user.toObject()
//     delete userObject.password
//     delete userObject.tokens
//     delete userObject.avatar
//     return userObject
// }

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET,{expiresIn:'7 days'})
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token
}


userSchema.statics.findByCredentials = async (email,password)=>{
    const user=await User.findOne({email:email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch=bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to Login')
    }
    return user
}

//Schema for saving
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    // console.log('just before saving !!')
    next()
})

//Deleting the data of the user that we want to delete

userSchema.pre('remove',async function(next){
    const user=this
    await Tasks.deleteMany({owner:user._id})
    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User
