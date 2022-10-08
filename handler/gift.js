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

setInterval(() => {
    lotter.find({}, async (err, data) => {
        if (!data) return;
        const date = Math.floor(Date.now() / 1000)
        for (let x = 0; x < data.length; x++) {
            if(data[x].date === "NaN") data[x].delete()
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
}, 29000);