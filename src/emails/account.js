const sgMail=require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'thakurabhinav17122001@gmail.com',
        subject:'Congratulations !!',
        text:`${name}  welcome to the Task App , hope you will like the app !`
    }).then(r=>{
        // console.log('Sent')
        // console.log(r)
    }).catch(e=>{
        console.log('Not sent')
        console.log(e)
    })    
}


const sendCancelEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'thakurabhinav17122001@gmail.com',
        subject:'GoodBye !!',
        text:`${name} its sorry to see you go !! `
    }).then(r=>{
        // console.log('Sent')
        // console.log(r)
    }).catch(e=>{
        console.log('Not sent')
        console.log(e)
    })
}
module.exports={
    sendWelcomeEmail,sendCancelEmail
}