const express = require("express");
const { connection } = require("./config/db");
require("dotenv").config()
const {clientRedis} = require("./helpers/redis");
const { userRouter } = require("./routes/user.route");
const { ipRouter } = require("./routes/ip.route");
const winston = require("winston");

const expressWinston = require("express-winston");
require("winston-mongodb")


const app = express();
const port = process.env.PORT || 4500


app.use(express.json());


app.use(expressWinston.logger({
    transports : [
        //transport to a file
        new winston.transports.File({
            level:"info",
            filename:"infologs.log"
        }),
    
        
        // Transport to mongoDB
        new winston.transports.MongoDB({
            db : process.env.mongo_URL,
            level:"info"
        })
    ],
    format :winston.format.prettyPrint()
}))



app.get("/",(req,res)=>{
    res.send("Home page")
});

app.use("/user",userRouter);

app.use("/getcity",ipRouter)

clientRedis.on("connect",()=>{
    console.log("connected to Redis Db")
});

clientRedis.on("error",(error)=>{
    console.log(error)
})



app.listen(port,async()=>{
    try {
        console.log(`Server is running on port ${port}`);
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error.message)
    }
})