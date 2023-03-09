const {
    EmbedBuilder,
} = require('discord.js');
const CronJob = require('cron').CronJob;
const client = require('../index');
const lotter = require('../models/lotter.js')

function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
const work_user = require('../models/work_user.js')
const coin = require('../models/coin.js');
const gift_change = require("../models/gift_change.js");
const birthday_set = require('../models/birthday_set.js')
const birthday = require('../models/birthday.js')
const moment = require('moment')
const job = new CronJob(
    '* * * * *',
    async function () {
            birthday_set.find({}, async (err, data1) => {
                console.log(client.cluster.id)
                if (!data1) return;
                for (let x = 0; x < data1.length; x++) {
                    birthday.find({
                        guild: data1[x].guild
                    }, async (err, data) => {
                        if(!data) return
                        if (data.length === 0) return
                        let guild = client.guilds.cache.get(data1[x].guild)
                        console.log('使用者', data1[x].guild)
                        if (!guild) return console.log('伺服器', data1[x].guild)
                        let channel = guild.channels.cache.get(data1[x].channel)
                        if (!channel) return console.log('頻道', data1[x].channel)
                        const role = guild.roles.cache.get(data1[x].role);
                        for (let y = 0; y < data.length; y++) {
                            let userrrrrr = await guild.members.fetch(data[y].user)
                            if (!userrrrrr) return console.log('使用者', data[y].user)
                            let day = String(moment().utcOffset(data1[x].utc).format('DD').slice(0, 1)) === "0" ? Number(String(moment().utcOffset(data1[x].utc).format('DD').slice(1, 2))) : Number(moment().utcOffset(data1[x].utc).format('DD'))
                            if (role) {
                                if (data[y].birthday_day !== day) {
                                    if ((userrrrrr.roles.cache.get(`${data1[x].role}`)) && role) {
                                        userrrrrr.roles.remove(role)
                                    }
                                }
                            }
                            let month = String(moment().utcOffset(data1[x].utc).format('MM').slice(0, 1)) === "0" ? Number(String(moment().utcOffset(data1[x].utc).format('MM').slice(1, 2))) : Number(moment().utcOffset(data1[x].utc).format('MM'))
                            if (data[y].birthday_month !== month) return
                            if (data[y].birthday_day !== day) return
                            if (role) {
                                if (!userrrrrr.roles.cache.get(`${data1[x].role}`) && role) {
                                    userrrrrr.roles.add(role)
                                }
                            }
                            let hour = String(moment().utcOffset(data1[x].utc).format('HH').slice(0, 1)) === "0" ? Number(String(moment().utcOffset(data1[x].utc).format('HH').slice(1, 2))) : Number(moment().utcOffset(data1[x].utc).format('HH'))
                            if (data[y].send_msg_hour !== hour) return
                            let min = String(moment().utcOffset(data1[x].utc).format('mm').slice(0, 1)) === "0" ? Number(String(moment().utcOffset(data1[x].utc).format('mm').slice(1, 2))) : Number(moment().utcOffset(data1[x].utc).format('mm'))
                            if (data[y].send_msg_min !== min) return
                            let msgggggg = data1[x].msg
                            msgggggg = msgggggg.replace('{user}', `<@${data[y].user}>`)
                            msgggggg = msgggggg.replace('{name}', `${userrrrrr.user.username}`)
                            msgggggg = msgggggg.replace('{age}', `${data[y].birthday_year ? new Date().getFullYear() - data[y].birthday_year : "`沒有資料`"}`)
                            channel.send(msgggggg)
                        }
                    })
                }
            })

            lotter.find({}, async (err, data) => {
                if (!data) return;
                const date = Math.floor(Date.now() / 1000)
                for (let x = 0; x < data.length; x++) {
                    if (data[x].date === "NaN") data[x].delete()
                    if (!(date < data[x].date)) {
                        if (data[x].end === false) {
                            if (((date - data[x].date)) < 30 * 60 * 1000) {
                                const winner_array = []
                                for (y = data[x].howmanywinner - 1; y > -1; y--) {
                                    const winner = data[x].member[getRandomArbitrary(0, data[x].member.length)]
                                    if (winner === undefined) {
                                        y--
                                    } else {
                                        winner_array.push(winner.id)
                                    }
                                }
                                const guild = client.guilds.cache.get(data[x].guild);
                                if (guild) {
                                    let channel = guild.channels.cache.get(data[x].message_channel);
                                    if (channel) {
                                        const winner_embed = new EmbedBuilder()
                                            .setTitle("<:fireworks:997374182016958494> 恭喜中獎者! <:fireworks:997374182016958494>")
                                            .setDescription(data[x].member.length === 0 ? "沒有人參加抽獎欸QQ" : `
**<:celebration:997374188060946495> 恭喜:**
<@${winner_array.join('>\n<@')}>
<:gift:994585975445528576> **抽中:** ${data[x].gift}
`)
                                            .setColor(channel.guild.members.me.displayHexColor)
                                            .setFooter({
                                                text: "沒抽中的我給你一個擁抱"
                                            })
                                        channel.send({
                                            content: data[x].member.length === 0 ? null : `<@${winner_array.join('><@')}>`,
                                            embeds: [winner_embed]
                                        })
                                        data[x].collection.updateOne(({
                                            guild: data[x].guild,
                                            id: data[x].id
                                        }), {
                                            $set: {
                                                end: true
                                            }
                                        })
                                        data[x].save()
                                    }
                                }
                            }
                        } else {
                            if ((date - data[x].date) > 2592000) data[x].delete()
                        }
                    }
                }
            })

            if (client.cluster.id === 0) {
                work_user.find({}, async (err, data) => {
                    let Date_now = Math.round(Date.now() / 1000)
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].state !== "待業中") {
                            if (data[i].end_time < Date_now) {
                                coin.findOne({
                                    guild: data[i].guild,
                                    member: data[i].user
                                }, async (err, data_coin) => {
                                    if (!data_coin) {
                                        gift_change.findOne({
                                            guild: data[i].guild,
                                        }, async (err, data1111) => {
                                            data_coin = new coin({
                                                guild: data[i].guild,
                                                member: data[i].user,
                                                coin: data[i].get_coin,
                                                today: !data1111 || ((data1111.time && data1111.time === 0)) ? 1 : Math.round(Date.now() / 1000)
                                            })
                                            data_coin.save()
                                        })
                                    } else {
                                        data_coin.collection.updateOne(({
                                            guild: data[i].guild,
                                            member: data[i].user
                                        }), {
                                            $set: {
                                                coin: data_coin.coin + data[i].get_coin
                                            }
                                        })
                                    }
                                })
                                data[i].collection.updateOne(({
                                    guild: data[i].guild,
                                    user: data[i].user,
                                }), {
                                    $set: {
                                        state: "待業中"
                                    }
                                })
                            }
                        }

                    }
                })
            }

        },
        null,
        true,
        'Asia/Taipei'
);