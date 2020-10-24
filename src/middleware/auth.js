const jwt=require('jsonwebtoken')
const User=require('../models/user')
 
const auth=async (req,res,next)=>{
    try{
        // const token=req.header('Authorization').replace('Bearer ','')
        const token=req.cookies.jwt
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token=token
        req.user=user
        next()
    }catch(e){
        // res.status(401).send({error:'Please authenticate'})
        res.redirect('/users/login')
        console.log(e)
    }
}

const checkUser=(req,res,next)=>{
    const token=req.cookies.jwt
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,async(err,decodedToken)=>{
            if(err){
                // console.log(err.message)
                res.locals.user=null
                next()
            }else{
                // console.log(decodedToken._id)
                let user=await User.findById(decodedToken._id)
                res.locals.user=user
                // console.log('Hello',user.name)
                next()
            }
        })
    }else{
        res.locals.user=null
        next()
    }
}

let objectSent=[auth,checkUser]

module.exports=objectSent