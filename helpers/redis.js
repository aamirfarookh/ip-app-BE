const {Redis} = require("ioredis");


const clientRedis = new Redis({
    password: 'i4fkCzI6Taicc6DV0xpDmJPbBrT6AVXb',
    socket: {
        host: 'redis-12271.c278.us-east-1-4.ec2.cloud.redislabs.com',
        port: 12271
    }
});


module.exports = {clientRedis}

