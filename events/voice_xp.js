const moment = require('moment')
const client = require('../index')
const voice_xp = require("../models/voice_xp.js");
const voice_xp_channel = require("../models/voice_xp_channel.js");
client.on("voiceStateUpdate",  async (oldMember, newMember) => {
        if(newMember.channelId !== null && newMember.channelId !== undefined && newMember.channelId){
            voice_xp.findOne({
                guild: newMember.guild.id,
                member: newMember.member.id,
            }, async (err, data) => {
                if (err) throw err;
                if(!data){
                    data = new voice_xp({
                        guild: newMember.guild.id,
                        member: newMember.member.id,
                        xp: '0',
                        leavel: '0',
                        leavejoin: "join",
                    })
                    data.save()
                }else{
                  if(data.leavejoin === "join") return 
                    data.collection.update(({guild: newMember.guild.id,member: newMember.member.id,}), {$set: {leavejoin: "join"}})
                    data.save()
                }
                try {
                console.log(newMember.member.id)
                if(!newMember.member) return 
                if(newMember.member === null) return
                if(newMember.member === undefined) return
                if(!newMember.member.id) return
                console.log("teset")
                const stop = setInterval(() => {
                        voice_xp.findOne({
                            guild: newMember.guild.id,
                            member: newMember.member.id,
                        }, async (err, data) => {
                            if(data.leavejoin !== "join"){clearInterval(stop)};
                            if(Number(5) + Number(data.xp) > parseInt(Number(data.leavel) * (Number(data.leavel)/2) * 100  + 100)){
                                data.collection.update(({guild: newMember.guild.id,member: newMember.member.id,}), {$set: {xp: `5`}})
                                data.collection.update(({guild: newMember.guild.id,member: newMember.member.id,}), {$set: {leavel: `${Number(data.leavel) + 1}`}})
                                voice_xp_channel.findOne({
                                    guild: newMember.guild.id,
                                }, async (err, data1) => {
                                if(data1){
                                const channel111 = client.channels.cache.get(data1.channel)
                                const owner = await newMember.guild.fetchOwner();
                                if(!channel111){return owner.send(":x: 有人的語音頻道等級升級了，但升等頻道已經被刪除了!")}
                                const hasPermissionInChannel = channel111
                                .permissionsFor(newMember.guild.me)
                                .has('SEND_MESSAGES', false)
                                const hasPermissionInChannel1 = channel111
                                .permissionsFor(newMember.guild.me)
                                .has('VIEW_CHANNEL', false)
                                if(!hasPermissionInChannel || !hasPermissionInChannel1){
                                    return owner.send(":x: 有人的語音頻道等級升級了，但是我沒有權限在" + channel111.name + "發送消息!\n因為你是該伺服器擁有者，所以我找你報告: P")
                                }
                                channel111.send(`🆙恭喜<@${newMember.member.id}> 的語音等級成功升級到 ${Number(data.leavel) + 1}`)}else{return}
                                })
                            }else{
                                data.collection.update(({guild: newMember.guild.id,member: newMember.member.id,}), {$set: {xp: `${Number(5) + Number(data.xp)}`}})
                            }
                            data.save
                        })
                    
                }, 30000);
            } catch (error) {
                console.error(moment().utcOffset("+08:00").format('YYYYMMDDHHss'),)
                console.error(error)
            }
            })
        }else{
            voice_xp.findOne({
                guild: newMember.guild.id, 
                member: newMember.member.id,
            }, async (err, data) => {
                if (err) throw err;
                if(!data){
                    data = new voice_xp({
                        guild: newMember.guild.id,
                        member: newMember.member.id,
                        xp: '0',
                        leavel: '0',
                        leavejoin: "leave",
                    })
                    data.save()
                }else{
                    if(!oldMember.member)return
                    data.collection.update(({guild: oldMember.guild.id,member: oldMember.member.id,}), {$set: {leavejoin: "leave"}})
                    data.save()
                }
            })
        }
})