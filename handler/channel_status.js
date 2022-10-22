const {
    functions
} = require('lodash');
const client = require('../index');
const Number = require('../models/Number.js')
const role_number = require('../models/role.js')
const {
    PermissionsBitField
} = require('discord.js')
setInterval(() => {
    Number.find({}, async (err, data) => {
        if (!data) return;
        for (let x = 0; x < data.length; x++) {
            setTimeout(() => {
                const guild = client.guilds.cache.get(data[x].guild);
                if (guild) {
                    const members = guild.members.cache.filter(member => !member.user.bot);
                    const bots = guild.members.cache.filter(member => member.user.bot);
                    const all_channel = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size;
                    const text_channel_number = guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
                    const voice_channel_number = guild.channels.cache.filter((c) => c.type === "voice").size;

                    function set_channel_name(channelid, oldNumber, newNumber) {
                        const guild = client.guilds.cache.get(data[x].guild);
                        if (!guild) return;
                        const get_memberNumber = guild.channels.cache.get(channelid)
                        if (!get_memberNumber) return
                        const channel_name = get_memberNumber.name
                        const hasPermissionInChannel = get_memberNumber
                            .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ManageChannels])
                        const hasPermissionInChannel1 = get_memberNumber
                            .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ViewChannel])
                        if (hasPermissionInChannel && hasPermissionInChannel1) {
                            if (channel_name.search(`${oldNumber}`) === -1) {
                                get_memberNumber.setName(`${newNumber}`)
                                    .catch(console.error);
                            } else {
                                get_memberNumber.setName(channel_name.replace(`${oldNumber}`, `${newNumber}`))
                                    .catch(console.error);
                            }
                        } else {}
                    }

                    // memberNumber =
                    try {


                        set_channel_name(data[x].memberNumber, data[x].memberNumber_name, guild.members.cache.size)
                        data[x].collection.updateOne(({
                            guild: guild.id,
                        }), {
                            $set: {
                                memberNumber_name: guild.members.cache.size
                            }
                        })
                        // userNumber =
                        const get_userNumebr = guild.channels.cache.get(data[x].userNumber)

                        if (get_userNumebr) {
                            let hasPermissionInChannel3 = get_userNumebr
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ManageChannels])
                            let hasPermissionInChannel13 = get_userNumebr
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ViewChannel])
                            if (hasPermissionInChannel3 && hasPermissionInChannel13) {
                                const userNumber_channel = get_userNumebr.name
                                if (userNumber_channel.search(`${data[x].userNumber_name}`) === -1) {
                                    get_userNumebr.setName(`${members.size}`)
                                        .catch(console.error);
                                } else {
                                    get_userNumebr.setName(userNumber_channel.replace(`${data[x].userNumber_name}`, `${members.size}`))
                                        .catch(console.error);
                                }
                                data[x].collection.updateOne(({
                                    guild: guild.id,
                                }), {
                                    $set: {
                                        userNumber_name: `${members.size}`
                                    }
                                })
                            } else {}
                        }
                        // botNumber =
                        const get_BotNumber = guild.channels.cache.get(data[x].BotNumber)
                        if (get_BotNumber) {
                            let hasPermissionInChannel2 = get_BotNumber
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ManageChannels])
                            let hasPermissionInChannel12 = get_BotNumber
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ViewChannel])
                            if (hasPermissionInChannel2 && hasPermissionInChannel12) {

                                const BotNumber_channel = get_BotNumber.name
                                if (BotNumber_channel.search(`${data[x].BotNumber_name}`) === -1) {
                                    get_BotNumber.setName(`${members.size}`)
                                        .catch(console.error);
                                } else {
                                    get_BotNumber.setName(BotNumber_channel.replace(`${data[x].BotNumber_name}`, `${bots.size}`))
                                        .catch(console.error);
                                }
                                data[x].collection.updateOne(({
                                    guild: guild.id,
                                }), {
                                    $set: {
                                        BotNumber_name: `${bots.size}`
                                    }
                                })
                            } else {}
                        }
                        // channelNumber =
                        const get_channelNumber = guild.channels.cache.get(data[x].channelnumber)
                        if (get_channelNumber) {
                            let hasPermissionInChannel1 = get_channelNumber
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ManageChannels])
                            let hasPermissionInChannel11 = get_channelNumber
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ViewChannel])
                            if (hasPermissionInChannel1 && hasPermissionInChannel11) {
                                const channelnumber_channel = get_channelNumber.name
                                if (channelnumber_channel.search(`${data[x].channelnumber_name}`) === -1) {
                                    get_channelNumber.setName(`${members.size}`)
                                        .catch(console.error);
                                } else {
                                    get_channelNumber.setName(channelnumber_channel.replace(`${data[x].channelnumber_name}`, `${all_channel}`))
                                        .catch(console.error);
                                }
                                data[x].collection.updateOne(({
                                    guild: guild.id,
                                }), {
                                    $set: {
                                        channelnumber_name: `${all_channel}`
                                    }
                                })
                            } else {}
                        }
                        // textnumber =
                        const get_textnumber = guild.channels.cache.get(data[x].textnumber)
                        if (get_textnumber) {
                            let hasPermissionInChannel14 = get_textnumber
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ManageChannels])
                            let hasPermissionInChannel114 = get_textnumber
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ViewChannel])
                            if (hasPermissionInChannel14 && hasPermissionInChannel114) {

                                const textnumber_channel = get_textnumber.name
                                if (textnumber_channel.search(`${data[x].textnumber_name}`) === -1) {
                                    get_textnumber.setName(`${members.size}`)
                                        .catch(console.error);
                                } else {
                                    get_textnumber.setName(textnumber_channel.replace(`${data[x].textnumber_name}`, `${text_channel_number}`))
                                        .catch(console.error);
                                }
                                data[x].collection.updateOne(({
                                    guild: guild.id,
                                }), {
                                    $set: {
                                        textnumber_name: `${text_channel_number}`
                                    }
                                })
                            } else {}
                        }
                        // voicenumber =
                        const get_voicenumber = guild.channels.cache.get(data[x].voicenumber)
                        if (get_voicenumber) {
                            let hasPermissionInChannel15 = get_voicenumber
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ManageChannels])
                            let hasPermissionInChannel115 = get_voicenumber
                                .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ViewChannel])
                            if (hasPermissionInChannel15 && hasPermissionInChannel115) {
                                const voicenumber_channel = get_voicenumber.name
                                if (voicenumber_channel.search(`${data[x].voicenumber_name}`) === -1) {
                                    get_voicenumber.setName(`${members.size}`)
                                        .catch(console.error);
                                } else {
                                    get_voicenumber.setName(voicenumber_channel.replace(`${data[x].voicenumber_name}`, `${voice_channel_number}`))
                                        .catch(console.error);
                                }
                                data[x].collection.updateOne(({
                                    guild: guild.id,
                                }), {
                                    $set: {
                                        voicenumber_name: `${voice_channel_number}`
                                    }
                                })
                            } else {}
                        }
                    } catch (e) {
                        console.error(e)
                    }
                } else {
                    return
                }
            }, x * 1000);
        }
    })
    role_number.find({}, async (err, data) => {
        if (err) throw err;
        if (data) {
            for (let x = 0; x < data.length; x++) {
                const guild = client.guilds.cache.get(data[x].guild);
                if (guild) {
                    try {
                        const members = guild.members.cache.filter(member => member.roles.cache.some(role1 => role1.id === data[x].role));
                        const role_channel_name = guild.channels.cache.get(data[x].channel)
                        if (!role_channel_name) return
                        let hasPermissionInChannel15 = role_channel_name
                            .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ManageChannels])
                        let hasPermissionInChannel115 = role_channel_name
                            .permissionsFor(guild.members.me, [PermissionsBitField.Flags.ViewChannel])
                        if (hasPermissionInChannel15 && hasPermissionInChannel115) {

                            const channel_name = role_channel_name.name
                            if (channel_name.search(`${data[x].channel_name}`) === -1) {
                                role_channel_name.setName(`${members.size}`)
                                    .catch(console.error);
                            } else {
                                role_channel_name.setName(channel_name.replace(`${data[x].channel_name}`, `${members.size}`))
                                    .catch(console.error);
                            }
                            data[x].collection.updateOne(({
                                guild: guild.id,
                                role: data[x].role
                            }), {
                                $set: {
                                    channel_name: `${members.size}`
                                }
                            })
                        } else {

                        }
                    } catch (e) {
                        console.error(e)
                    }
                } else {
                    return
                }
            }
        } else {
            return
        }
    })
}, 60 * 10 * 1000);