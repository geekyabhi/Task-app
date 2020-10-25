const express=require('express')
const path=require('path')
const hbs=require('hbs')
const objectSent=require('./middleware/auth')
const auth=objectSent[0]
const checkUser=objectSent[1]
const cookieParser=require('cookie-parser')

require('./db/mongoose')
require('dotenv').config({
    path: './config/dev.env'
})
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const app=express()
const port=process.env.PORT


const publicPath=path.join(__dirname,'../public')
const viewPath=path.join(__dirname,'../template/views')
const partialPath=path.join(__dirname,'../template/partials')

app.set('view engine','hbs')
app.set('views',viewPath)
hbs.registerPartials(partialPath)
app.use(express.static(publicPath))

app.use(express.json())
app.use(cookieParser())
app.get('/',checkUser,(req,res)=>{
    res.render('home')
})

app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('Server is on port '+port)
})
