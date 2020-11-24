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
    try{
        const token=req.cookies.jwt
        if(token){
            jwt.verify(token,process.env.JWT_SECRET,async(err,decodedToken)=>{
                if(err){
                    res.locals.user=null
                    next()
                }else{
                    let user=await User.findById(decodedToken._id)
                    res.locals.user=user
                    next()
                }
            })
        }else{
            res.locals.user=null
            next()
        }
    }catch(e){
        console.log('Error in checkuser in middleware',e)
    }
}

let objectSent=[auth,checkUser]

module.exports=objectSent