const express=require('express')
const cookie= require('cookie-parser')
let db
class Dao{
    static async injectDb(client){
        try{
        db=await client.db('Details').collection('user_details')
        }catch(e){
            console.log(e)
        }
    }
    static async getUser(username) {
        try {
            const ans=await db.findOne({user_name:username})
            console.log(ans)
            return {success:true,data:ans}
        } catch (error) {
            return {success:false,error:error}
        }
    }
    static async getCart(username) {
        try{
            const ans=await db.findOne({user_name:username})
        if (ans){
            return {success:true,data:ans['cart']}
        }else{
            return {success:false,msg:"Can't Find the user"}
        }
    }catch (err){
        return {success:false,msg:err}
    }
    }


    static async postUser(Name,username,above18,contact,email,password) {
        console.log(" posting ...")
        try {
            const check=await db.findOne({user_name:username})
            if(check){
                return {success:false,msg:"User Already Registered."}
            }
            await db.insertOne({
                user_name:username,
                name:Name,
                cart:[],
                plan:"free",
                above18:above18,
                contact:contact,
                email:email,
                password:password
            })
            return {success:true,msg:"User Added: "+username}
        } catch (error) {
            return {success:false,msg:error}
        }
    }


    static async putCart(username,cart) {
        try{
            await db.updateOne({user_name:username},{$set :{cart : cart},
                $currentDate:{lastModified:true}
            })
            return {success:true,msg:"Cart Updated for :"+username}
    }catch (err){
        return {success:false,msg:err}
    }
    }

    static async putPlan(username,plan) {
        try{
            await db.updateOne({user_name:username},{$set :{plan : plan},
                $currentDate:{lastModified:true}
            })
            return {success:true,msg:"Cart Updated for :"+username}
    }catch (err){
        return {success:false,msg:err}
    }
    }

    static async getPlan(username) {
        try{
            const ans=await db.findOne({user_name:username})
        if (ans){
            return {success:true,data:ans['plan']}
        }else{
            return {success:false,msg:"Can't Find the user"}
        }
    }catch (err){
        return {success:false,msg:err}
    }
    }

    static async getAllUsers() {
        return await db.find().toArray()
    }

    static async login(username,password){
        try {
            console.log(username)
            const user=await db.findOne({user_name:username})
            if(user){
                if(user['password']== ""+password){
                    return {success:true,user:username,plan:user.plan}
                }else{
                    return {success:false,msg:"Wrong Password"}
                }
            }else{
                return {success:false,msg:"Username not found"}
            }
        } catch (error) {
            return {success:false,msg:error}
        }
    }
}

module.exports=Dao