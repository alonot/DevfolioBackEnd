let db

class SessionDao{
    static async indexedDB(client){
        try {
            db= await client.db('Details').collection('sessionTable')
        } catch (error) {
            console.log(error)
        }
    }
    static async putSessionId(sessionID,User){
        try{
            const sessionId=await db.findOne({sessionId:sessionID})
            if(sessionId){
                return {success:false,msg:"sessionId Already present."}
            }
            await db.insertOne({
                sessionId:sessionID,
                user:User
            })
            return {success:true}
        }catch(err){
            console.log(err)
            return {success:false,msg:"Something Bad happened"}
        }
    }
    static async verify(sessionID){
        try{
            const sessionItem=await db.findOne({sessionId:sessionID})
            if(sessionItem){
                await db.updateOne({sessionId:sessionID},{
                    $currentDate:{lastModified:true}
                })
                return {success:true,user:sessionItem.user}
            }
            return {success:false,msg:"SessionId Not found."}
        }catch(err){
            console.log(err)
            return {success:false,msg:"Something Bad happened"}
        }
    }
    static async delSession(sessionID){
        try{
            await db.deleteOne({sessionId:sessionID})
            return {success:true}
        }catch(err){
            console.log(err)
            return {success:false,msg:"Something Bad happened"}
        }
    }
}

module.exports=SessionDao