const dao=require('../DAO/dbDao.js')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const SessionDao = require('../DAO/SessionDao.js')

class ReviewCltr{
    static async getUser(req,res,next) {
        console.log(req.params)
        const {username} =req.params
        if(username){
            let result=await dao.getUser(username)
            if(result.success){
                return res.status(200).json(result)
            }else{
                return res.status(404).json(result)
            }
        }else{
            return res.status(404).json({success:false,msg:"Could Not Resolve Params."})
        }
    }

    static async postUser(req,res,next) {
        console.log(req.body)
        const data= req.body
        if(data){
            let pass=data.password
            pass=await bcrypt.hash(String(pass),10)
            const result= await dao.postUser(data.name,data.username,data.above18,data.contact,data.email,pass)
            if(result.success){
                return res.status(200).json(result)
            }else{
                return res.status(404).json(result)
            }
        }else{
            return res.status(404).json({success:false,msg:"Bad request."})
        }
    }

    static async getCart(req,res,next) {
        const username =req.cookies.user
        console.log("user:",username,req.cookies)
        if(username){
            const result = await dao.getCart(username)
            if(result.success){
                return res.status(200).json(result)
            }else{
                return res.status(404).json(result)
            }
        }else{
            return res.status(404).json({success:false,msg:"Not logged in.."})
        }
    }

    static async putCart(req,res,next) {
        console.log(req.body)
        const {username} =req.body
        const {cart} = req.body
        if(username && cart){
            const result=await dao.putCart(username,cart)
            console.log(result)
            if(result.success){
                return res.status(200).json(result)
            }else{
                return res.status(404).json(result)
            }

        }else{
            return res.status(404).json({success:false,msg:"Could Not Resolve Params or body."})
        }
    }

    static async getAllUsers(req,res,next) {
        const data=await dao.getAllUsers()
        if(data){
            return res.status(200).json({success:true,data:data})
        }else{
            return res.status(404).json({success:false,msg:"Somethong Bad Happenned"})
        }
    }

    static async getPlan(req,res,next) {
        const username =req.cookies.user
        console.log("user:",username,req.cookies)
        if(username){
            const result = await dao.getPlan(username)
            if(result.success){
                return res.status(200).json(result)
            }else{
                return res.status(404).json(result)
            }
        }else{
            return res.status(404).json({success:false,msg:"Not logged in.."})
        }
    }

    static async putPlan(req,res,next) {
        console.log(req.body)
        const {username} =req.params
        const {plan} = req.body
        if(username && cart){
            const result=await dao.putPlan(username,plan)
            if(result.success){
                return res.status(200).json(result)
            }else{
                return res.status(404).json(result)
            }

        }else{
            return res.status(404).json({success:false,msg:"Could Not Resolve Params or body."})
        }
    }

    static async login(req,res,next){
        try {
            res.set('Access-Control-Allow-Origin',req.headers.origin)
            const data=req.body
            if(data){
                const result= await dao.login(data.username)
                if(result.success){
                    console.log(result)
                    let sessionId=null
                    jwt.sign(data.username,'secretKey',(err,token)=>{
                        sessionId=token
                    })
                    if (await bcrypt.compare(String(data.password),String(result.pass)) && sessionId!= null){
                        res.cookie('sessionId',sessionId,{
                            maxAge: 60*60*24*30,
                            sameSite:'None', //when working with cross-site requests
                            httpOnly:true,
                            secure:true,
                            domain:""
                        })
                        const resultSession=SessionDao.putSessionId(sessionId,data.username)
                        if(resultSession.success)
                            return res.status(200).json({success:true,user:data.username,plan:result.plan})
                        else{
                            return res.status(404).json(result)
                        }

                    }else{
                        return res.status(404).json({success:false,msg:"Passwords Didn't match"})
                    }
                }else{
                    return res.status(404).json(result)
                }
        }

        } catch (error) {
            return res.status(404).json({success:false,msg:error})
        }
    }

    static async authenticate(req,res,next){
        try {
            res.set('Access-Control-Allow-Origin',req.headers.origin)
            console.log("autheticating..")
            
             if(req.cookies.sessionId){
                console.log(req.cookies.sessionId)
                const result=await SessionDao.verify(req.cookies.sessionId)
                if(result.success)
                    return res.status(200).json(result)
                else{
                    res.clearCookie('sessionId')
                    return res.status(404).json(result)
                }
             }else{
                return res.status(404).json({success:false,user:null})
             }
        } catch (error) {
            console.error(error)
            return res.status(404).json({success:false,msg:error})
        }
    }

    static async logout(req,res,next){
        try{
            res.set('Access-Control-Allow-Origin',req.headers.origin)
            if(req.cookies.sessionId != null){
                console.log(req.cookies)
                const result=await SessionDao.delSession(req.cookies.sessionId)
                res.clearCookie('sessionId')
                if (result.success)
                    res.status(200).json({success:true,msg:"Logged out."})
                else
                return res.status(404).json(result)
            }else{
                res.status(404).json({success:false,msg:"Not Logged in"})
            }
        }catch(e){
            return res.status(404).json({success:false,msg:e})
        }
    }


    //Just for Testing Cookie
    static async tester(req,res,next){
        console.log("hello")
        try {
            const data=req.body
            console.log(data)
            if(data){
                const result= {success:true}
                if(result.success){
                    console.log(result)
                    res.cookie('useer','ff',{
                        maxAge: 60*60*24*30*100,// this is not from current time but from some other timeZone but th resultant time is applied to your pc.
                        // expires:new Date('3 November 2023'),
                        path:'/',
                        sameSite:'None', //when working with cross-site requests
                        httpOnly:true,
                        secure:true
                        //secure:true,} //- only accessible to this domain and subdomain}
                        }
                    )
                    res.set('Access-Control-Allow-Origin',req.headers.origin)
                    return res.status(200).json(result)
                }else{
                    return res.status(404).json(result)
                }
        }

        } catch (error) {
            return res.status(404).json({success:false,msg:error})
        }
    }
}

module.exports=ReviewCltr