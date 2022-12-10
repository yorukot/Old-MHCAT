const {
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
    ChannelType,
    PermissionsBitField
} = require('discord.js');
const moment = require('moment')
const client = require('../index')
const config = require("../config.json");
const lock_channel = require("../models/lock_channel.js")
const voice_channel_id = require("../models/voice_channel_id.js")
const {
    intersection
} = require('lodash');
const voice_channel = require("../models/voice_channel.js");
const {
    EqualsOperation
} = require('sift');
client.on("voiceStateUpdate", async (oldMember, newMember) => {
    if ((oldMember.channel ? oldMember.channel.id : oldMember.channel) === (newMember.channel ? newMember.channel.id : newMember.channel)) return;
    lock_channel.findOne({
        guild: newMember.guild.id,
        channel_id: newMember.channelId
    }, async (err, data) => {
        if (!data) {
            return
        } else {
            if (newMember.member.user.bot) return
            if (data.lock_anser === null) return
            let textchannel = newMember.guild.channels.cache.get(data.text_channel)
            if (!textchannel) return
            const match = data.ok_people.find(element => {
                if (element === newMember.id) {
                    return true;
                } else {
                    return false;
                }
            });
            if (match) return
            let aaaaaaaaaaa = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`lock_start`)
                    .setLabel("點我輸入密碼!")
                    .setEmoji("<a:arrow_pink:996242460294512690>")
                    .setStyle(ButtonStyle.Success),
                );
            let msgg = await textchannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('<:unlock:1017087850556174367> | 該包廂已被上鎖，請輸入密碼')
                    .setDescription(`請於60秒內點選下面的按鈕\n輸入密碼來加入${newMember.channel}(請找房主拿密碼)`)
                    .setColor(client.color.greate)
                ],
                content: `<@${newMember.id}>`,
                components: [aaaaaaaaaaa]
            })
            const filter = i => {
                if (msgg.id !== i.message.id) return false
                if (i.member.id !== newMember.id) return false
                return true
            }
            const collector111 = textchannel.createMessageComponentCollector({
                componentType: 2,
                filter,
                time: 60 * 1000,
            })
            collector111.on('collect', async (interaction01) => {
                const id = interaction01.customId;
                if (id === 'lock_start') {
                    const {
                        ActionRowBuilder,
                        ModalBuilder,
                        TextInputBuilder,
                        TextInputStyle
                    } = require('discord.js');
                    const modal = new ModalBuilder()
                        .setCustomId(data.channel_id + 'anser')
                        .setTitle('請輸入密碼!');
                    const favoriteColorInput = new TextInputBuilder()
                        .setCustomId('anser')
                        .setLabel("請輸入包廂密碼!")
                        .setStyle(TextInputStyle.Short);
                    const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
                    modal.addComponents(firstActionRow);
                    await interaction01.showModal(modal);
                }
            })
            newMember.disconnect()
            newMember.member.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("<:lock:1017077025397288980> | 該語音頻道已被房主上鎖!")
                    .setDescription(`請前往<#${data.text_channel}>輸入密碼進行解鎖\n否則你將無法加入\n輸入完密碼後就可以重新加入囉!`)
                    .setColor('Random')
                ]
            })
        }
    })
    voice_channel.findOne({
        guild: newMember.guild.id,
        ticket_channel: newMember.channelId
    }, async (err, data) => {
        try {
            if (!data) {
                return
            }
            if (newMember.channel.parentId === null) {
                newMember.guild.channels.create({
                    name: data.name,
                    type: ChannelType.GuildVoice,
                    userLimit: data.limit,
                    permissionOverwrites: newMember.channel.parent.permissionOverwrites.cache,
                }).then(channel => {
                    channel.permissionOverwrites.edit(newMember.id, {
                        ManageChannels: true,
                        ManageRoles: true
                    })
                    voice_channel_id.findOne({
                        guild: channel.guild.id,
                        channel_id: channel.id
                    }, async (err, data) => {
                        if (!data) {
                            data = new voice_channel_id({
                                guild: channel.guild.id,
                                channel_id: channel.id,
                            })
                            data.save()
                        } else {
                            return
                        }
                    })
                    newMember.member.voice.setChannel(channel)
                })
            } else {
                newMember.guild.channels.create({
                    name: data.name,
                    type: ChannelType.GuildVoice,
                    parent: newMember.channel.parent.id,
                    userLimit: data.limit,
                    permissionOverwrites: newMember.channel.parent.permissionOverwrites.cache,
                }).then(channel => {
                    channel.permissionOverwrites.edit(newMember.id, {
                        ManageChannels: true,
                        ManageRoles: true
                    })
                    if (data.lock) {
                        lock_channel.findOne({
                            guild: newMember.guild.id,
                            channel_id: newMember.id
                        }, async (err, data) => {
                            if (!data) {
                                data = new lock_channel({
                                    guild: newMember.guild.id,
                                    channel_id: channel.id,
                                    lock_anser: null,
                                    owner: newMember.id,
                                    text_channel: null,
                                    ok_people: [],
                                })
                                data.save()
                                newMember.member.send({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setTitle("<:lock:1017077025397288980> | 你開啟了一個可上鎖的語音頻道!")
                                        .setDescription('**你可以到你所在的語音頻道伺服器\n在該伺服器打指令的頻道打上**`/上鎖頻道 密碼:`\n**當然也可以不用上鎖\n如需解除上鎖只需打**`/上鎖頻道`\n**當頻道上鎖後對方將會被踢\n並且傳送密碼輸入給該名使用者\n對方輸入正確密碼後即可解鎖**')
                                        .setColor('Random')
                                    ]
                                })
                            }
                        })
                    }
                    voice_channel_id.findOne({
                        guild: channel.guild.id,
                        channel_id: channel.id
                    }, async (err, data) => {
                        if (!data) {
                            data = new voice_channel_id({
                                guild: channel.guild.id,
                                channel_id: channel.id,
                            })
                            data.save()
                        } else {
                            return
                        }
                    })
                    newMember.member.voice.setChannel(channel)
                })
            }

        } catch (e) {
            console.log(e)
            return false
        }
    })
    if (oldMember.channelId === null) return;

    try {
        voice_channel_id.findOne({
            guild: oldMember.guild.id,
            channel_id: oldMember.channelId
        }, async (err, data) => {
            if (!data) {
                return
            }
            const test = oldMember.channel.members.size
            if (test === 0) {
                lock_channel.findOne({
                    guild: oldMember.guild.id,
                    channel_id: oldMember.channelId
                }, async (err, data) => {
                    if (!data) {
                        return
                    } else {
                        data.delete()
                    }
                })
                oldMember.channel.delete()
                data.delete()
            }
            return
        })
    } catch (error) {
        console.error(error)
    }


})