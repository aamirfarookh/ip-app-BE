const jwt = require("jsonwebtoken");
const { clientRedis } = require("../helpers/redis");

const auth = async(req,res,next)=>{
    try {
        let token = ""
        await clientRedis.get("token",(err,result)=>{
           if(err){
            return res.status(400).send({msg:err.message});
           }
           else{
            token = result
           }
        });


        const isBlacklist = await clientRedis.lpos("blacklist",token);
        console.log(isBlacklist)
        if(isBlacklist!==null){
            return res.status(400).send({msg:"please login"})
        }

        jwt.verify(token,process.env.token_key,(err,decoded)=>{
            if(err){
                return res.status(400).send({msg:err.message});
            }
            else{
               req.body.email = decoded.email;
               next()
            }
        })
    

    } catch (error) {
        return res.status(500).send({msg:error.message})
    }
}
module.exports = {auth}