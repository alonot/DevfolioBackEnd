const { MongoClient }= require('mongodb')

const url = "mongodb+srv://Alonot:vv1CN5TlXbNRKlev@cluster0.a64ie0q.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(url)

const dao=require('./DAO/dbDao')

dao.injectDb(client)

// const getDb=async()=>{
//     coll=client.db('Details').collection('user_details')
//     console.log(await coll.findOne({username:"akk"}))
//     console.log("Here")
//     return coll
// }
module.exports=client