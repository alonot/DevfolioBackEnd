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
// app.use((req,res,next)=>{
//     console.log(req.headers)
//     res.set('Access-Control-Allow-Origin',req.headers.origin)
//     res.set('Access-Control-Allow-Credentials','true')

//     console.log(res.getHeaders())
//     next()
// })
app.use(cookieParser())



// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
//     next();
//   });

app.use('/api/v1/user',UserRouter)
app.all('*',(req,res)=>{
    res.status(404).send("Resource Not Found")
})

require('./index.js')

// const port = process.env.port || 5000
const port = 5000

app.listen(port,()=>{
    console.log("Listening to port ",port,"...")
})
