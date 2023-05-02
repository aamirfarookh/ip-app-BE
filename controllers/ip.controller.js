const axios = require("axios");

const { clientRedis } = require("../helpers/redis");

const getCity = async(req,res)=>{
    try {
        
        const isCityinCache = await clientRedis.get(req.params.ip,async(err,result)=>{
            if(err){
                console.log(err);
               return  res.status(400).send({msg:err.message})
            }
            else if(result){
                console.log("getting from Redis Cache")
                return res.status(200).send({city:result})
            }
        });
        console.log(isCityinCache)

        if(!isCityinCache){
            console.log("Getting city from API")
            const city = axios.get(`https://ipapi.co/${req.params.ip}/json/`).then(async function (response) {
            await clientRedis.set(req.params.ip, response.data.city, "EX", 6 * 60 * 60);
            return res.status(200).send({ response: response.data.city });
        }).catch((error)=>{
            res.status(400).send({msg:error.message})
        });
        }    
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:error.message});
    }
}


module.exports = {getCity}