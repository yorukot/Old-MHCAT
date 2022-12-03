var CronJob = require('cron').CronJob;
const client = require('../index');
const cron_set = require('../models/cron_set.js')
const {
    InteractionType,
    ApplicationCommandType,
    ButtonStyle,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Collector,
    Discord,
    AttachmentBuilder,
    ModalBuilder,
    TextInputBuilder,
    PermissionsBitField
} = require('discord.js');
setTimeout(() => {
    cron_set.find({}, async (err, data) => {
        if (data.length === 0) return;
        for (let i = 0; i < data.length; i++) {
            const guild = client.guilds.cache.get(data[i].guild)
            if (guild){
            if (data[i].cron === null) return data[i].delete()
            const x = i
            const job = new CronJob(
                data[x].cron,
                function () {
                    const guild = client.guilds.cache.get(data[x].guild)
                    if (!guild) return
                    const channel = guild.channels.cache.get(data[x].channel)
                    if (!channel) return
                    const auto = data[x].id
                    cron_set.findOne({
                        guild: guild.id,
                        id: auto
                    }, async (err, data) => {
                        if (!data) {
                            return job.stop()
                        } else {
                            let test = data.message.embeds ? data.message.embeds[0] ? [new EmbedBuilder(data.message.embeds[0].data)] : null : null
                            channel.send({content: data.message.content, embeds:test})
                        }
                    })
                },
                null,
                true,
                'Asia/Taipei'
            );
        }}
    })
}, 10000);


cron_set.find({}, async (err, data) => {
    if (!data) return;
    for (let i = 0; i < data.length; i++) {
        if (data[i].cron === null) data[i].delete()
    }
})

const job = new CronJob(
    ' 0 0 * * *',
    function() {
        const coin = require('../models/coin.js')
        const gift_change = require("../models/gift_change.js");
        let array = []
        gift_change.find({
        }, async (err, data1111) => {
            if(!data1111) return
            for(let i = 0; i < data1111.length; i++){
                    if(data1111[i].time !== 0){
                        array.push(data1111[i].guild)
                    }
            }
        })
        setTimeout(() => {
            coin.find({}, async (err, data) => {
                if(!data) return;
                for(let i = 0; i < data.length; i++){
                    if(!array.includes(data[i].guild)){
                        data[i].collection.updateOne(({guild: data[i].guild, member: data[i].member}), {$set: {today: 0}})
                    }
                }
            })
        }, 5000);
    },
    null,
    true,
    'Asia/Taipei'
);