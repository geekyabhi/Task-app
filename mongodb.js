const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
const ObjectID=mongodb.ObjectID

const id=new ObjectID("5f81c2d0611a100db4752893")

console.log(id)
console.log(id.getTimestamp())

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to the database')
    }
    const db=client.db(databaseName)
    db.collection('users').deleteMany({
        age:20
    }).then(result=>{
        console.log(result)
    }).catch(error=>{
        console.log(error)
    })
})
