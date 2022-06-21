const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord
} = require('discord.js');
const {
    MessageEmbed
} = require('discord.js')
const moment = require('moment')
const client = require('../index')
const config = require("../config.json");
const { intersection } = require('lodash');
const voice_channel = require("../models/voice_channel.js")
client.on("voiceStateUpdate",  async (oldMember, newMember) => {
    voice_channel.findOne({
                    guild: newMember.guild.id,
                    ticket_channel: newMember.channelId
                }, async (err, data) => {
            try {
                if(!data){return}
                if(newMember.channel.parentId === null){
                    newMember.guild.channels.create(data.name, {
                        type:"GUILD_VOICE",
                        userLimit: data.limit,
                        permissionOverwrites: [
                            {
                              id: newMember.id,
                              allow: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY], //Allow permissions
                            }]
                    }).then(channel => {
                        newMember.member.voice.setChannel(channel)
                    })
                }else{
                    newMember.guild.channels.create(data.name, {
                        type:"GUILD_VOICE",
                        parent: newMember.channel.parent.id,
                        userLimit: data.limit,
                        permissionOverwrites: [
                            {
                              id: newMember.id,
                              allow: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.READ_MESSAGE_HISTORY], //Allow permissions
                            }]
                    }).then(channel => {
                        newMember.member.voice.setChannel(channel)
                    })
                }
                
            } catch (e) {
            console.log(e)
                return false
            }
            })
            if(oldMember.channelId === null)return;
            try {
                voice_channel.findOne({
                    guild: newMember.guild.id,
                    parent: oldMember.channel.parentId, 
                    name: oldMember.channel.name
                }, async (err, data) => {
                if(!data){return}
                if(data.ticket_channel === oldMember.channelId)return
                    const test = oldMember.channel.members.size
                    if(test === 0){
                        oldMember.channel.delete()
                    }
                    return
            })
            } catch (error) {
                console.error(error)
            }
            
})