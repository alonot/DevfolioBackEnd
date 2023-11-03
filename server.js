const express = require('express')
const cors=require('cors')

const app = express()
const UserRouter=require('./Router/routes.js');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({extended:false}))
app.use(express.json())
const corsOptions={
    origin:'https://chaiwala-e9u7.onrender.com',
}
app.all('*',function(req,res,next){
    res.set('Access-Control-Allow-Origin',req.headers.origin)
    res.set('Access-Control-Allow-Credentials','true')
    next()
})
app.use(cors(corsOptions))
app.use(cookieParser())


app.use('/api/v1/user',UserRouter)
app.all('*',(req,res)=>{
    res.status(404).send("Resource Not Found")
})

require('./index.js')

const port = process.env.port || 5000

app.listen(port,()=>{
    console.log("Listening to port ",port,"...")
})
