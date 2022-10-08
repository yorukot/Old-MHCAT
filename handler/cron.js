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