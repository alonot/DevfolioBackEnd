const { MongoClient }= require('mongodb')

const url = "mongodb+srv://Alonot:vv1CN5TlXbNRKlev@cluster0.a64ie0q.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(url)

const dao=require('./DAO/dbDao')

dao.injectDb(client)

module.exports=client
