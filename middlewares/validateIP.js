const ipValidator = (req,res,next)=> {
    let IP = req.params.ip
 
    // Regex expression for validating IPv4
    let ipv4 = /(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])/;
 
    // Regex expression for validating IPv6
    let ipv6 = /((([0-9a-fA-F]){1,4})\:){7}([0-9a-fA-F]){1,4}/;
 
    // Checking if it is a valid IPv4 addresses
    if (IP.match(ipv4)){
        next()
    }
    
 
    // Checking if it is a valid IPv6 addresses
    else if (IP.match(ipv6)){
        next()
 
    }
    else{
            // Return Invalid
     res.status(400).send({msg:"Invalid IP"})
    }
       

}


module.exports = {ipValidator}