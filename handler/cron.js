var CronJob = require('cron').CronJob;
const client = require('../index');
const cron_set = require('../models/cron_set.js')
setTimeout(() => {
     cron_set.find({}, async (err, data) => {
        if(!data) return;
        for(let i = 0; i < data.length; i++){
            if(data[i].cron === null) data[i].delete()
            const x = i
            const job = new CronJob(
                data[x].cron,
                function() {
                    const guild = client.guilds.cache.get(data[x].guild)
                    if(!guild) return 
                    const channel = guild.channels.cache.get(data[x].channel)
                    if(!channel) return 
                    const auto = data[x].id
                    cron_set.findOne({guild: guild.id, id: auto}, async (err, data) => {
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
    if(!data) return;
    for(let i = 0; i < data.length; i++){
        if(data[i].cron === null) data[i].delete()
    }
})

const job = new CronJob(
    '0 0 * * *',
    function() {
        const coin = require('../models/coin.js')
        coin.find({}, async (err, data) => {
            if(!data) return;
            for(let i = 0; i < data.length; i++){
                data[i].collection.update(({guild: data[i].guild, member: data[i].member}), {$set: {today: false}})
            }
        })
    },
    null,
    true,
    'Asia/Taipei'
);