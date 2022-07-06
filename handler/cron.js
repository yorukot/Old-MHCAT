var CronJob = require('cron').CronJob;
const client = require('../index');
const cron_set = require('../models/cron_set.js')
setTimeout(() => {
     cron_set.find({}, async (err, data) => {
        console.log("|成功執行cron|")
        for(let i = 0; i < data.length; i++){
            if(data[i].cron === null) data[i].delete()
            const x = i
            const job = new CronJob(
                data[x].cron,
                function() {
                    const guild = client.guilds.cache.get(data[x].guild)
                    if(!guild) return console.log("No guild found")
                    const channel = guild.channels.cache.get(data[x].channel)
                    if(!channel) return console.log("NO channel found")
                    const auto = data[x].id
                    cron_set.findOne({guild: guild.id, id: auto}, async (err, data) => {
                        console.log("資料被刪除")
                        if(!data){ return job.stop()}else{
                        channel.send(data.message[0])
                        }
                    })
                },
                null,
                true,
                'Asia/Taipei'
            );
        }
})
}, 10000);


cron_set.find({}, async (err, data) => {
    console.log("|成功執行cron01|")
    for(let i = 0; i < data.length; i++){
        if(data[i].cron === null) data[i].delete()
    }
})