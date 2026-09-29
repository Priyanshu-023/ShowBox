const {clerkClient, getAuth} = require('@clerk/express');

const protectAdmin = async(req,res,next)=>{
    try {
        const {userId} = getAuth(req);
        if(!userId){
            return res.json({success: false, message: "not authorized"})
        }
        const user = await clerkClient.users.getUser(userId);
        if(user.privateMetadata?.role !== "admin"){
            return res.json({success: false, message: "not authorized"})
        }
        next();    
    } catch (error) {
        return res.json({ success: false, message: "not authorized" });
    }
}

module.exports = protectAdmin ;