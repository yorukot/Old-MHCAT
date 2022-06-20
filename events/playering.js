const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord,
    Discord,
    Modal,
    MessageEmbed,
    TextInputComponent
} = require('discord.js');
const playing = require('../models/playing.js')
const client = require('../index');
const allgame = require('../models/allgame.js')
client.on('presenceUpdate', (oldMember, newMember) => {
    if (!oldMember) return
    if(oldMember.user.bot) return 
    for (x = oldMember.activities.length - 1; x > -1; x--) {
        if (oldMember.activities[x].type === "PLAYING") {
            let game_name = oldMember.activities[x].name
            var date = new Date(oldMember.activities[x].createdTimestamp);
            const today = new Date();
            const minutes = parseInt(Math.abs(date.getTime() - today.getTime()) / (1000 * 60) % 60);
            playing.findOne({
                guild: oldMember.guild.id,
                member: oldMember.userId,
                'game.game': game_name
            }, async (err, data) => {
                if (!data) {
                    playing.findOne({
                        guild: oldMember.guild.id,
                        member: oldMember.userId,
                    }, async (err, data) => {
                        if (data) {
                            const object = {
                                game: game_name,
                                minutes: minutes,
                            }
                            data.game.push(object)
                            data.save()
                        } else {
                            data = new playing({
                                member: oldMember.userId,
                                guild: oldMember.guild.id,
                                game: [{
                                    game: game_name,
                                    minutes: minutes,
                                }]
                            })
                            data.save()
                        }
                    })
                } else {
                    let country = data.game.find(el => el.game === game_name);
                    data.collection.update({
                        'game.game': game_name,
                    }, {
                        '$set': {
                            'game.$.minutes': `${(Number(country.minutes) + Number(minutes))}`,
                        }
                    })
                }
            })
            allgame.findOne({
                game: game_name,
            }, async (err, data1) => {
                if (!data1) {
                    data1 = new allgame({
                        game: game_name,
                        minutes: minutes,
                    })
                    data1.save()
                } else {
                    data1.collection.update({
                        game: game_name,
                    }, {
                        '$set': {
                            minutes: (Number(data1.minutes) + Number(minutes))
                        }
                    })
                }
            })
        } else {
            return
        }
    }
});