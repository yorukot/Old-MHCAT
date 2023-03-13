const client = require('../index');
const Number = require('../models/Number.js');
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
    PermissionsBitField,
    Events
} = require('discord.js');
const logging = require("../models/logging.js")


client.on(Events.MessageUpdate, (oldContent, newContent) => {
    logging.findOne({
        guild: oldContent.channel.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const Logs = client.channels.cache.get(data.channel_id);
        if (!Logs) return;
        if(!oldContent.author) return
        if(oldContent.author.bot) return
        if(newContent === undefined) return
        const MessageEdited = new EmbedBuilder()
        .setAuthor({
            name: `${oldContent.author.username} | 訊息編輯`,
            iconURL: `${oldContent.author.avatarURL({
                extension: 'png'
            }) ? oldContent.author.avatarURL({
                extension: 'png'
            }) : "https://media.discordapp.net/attachments/991337796960784424/1076068374284599307/yellow-discord-icon-15.jpg?width=699&height=701"}`
    })
            .setColor(`#46A3FF`)
            .setDescription(`**<:edit:1084846013476511765> 訊息編輯者: <@${oldContent.author.id}> | <:Channel:994524759289233438> 訊息編輯位置: <#${oldContent.channel.id}>**`)
            .addFields(
                { name: `**<:book:1084846007545778217> 舊訊息:**`, value: `\`\`\`${oldContent} \`\`\``,inline: false},
                { name: `**<:new:1084846011366785135> 新訊息:**`, value: `\`\`\`${newContent} \`\`\``,inline:false},
                { name: `**<:attachment:1084846756799455242> 附件:**`, value: `${newContent.attachments.size > 0 ? `${newContent.attachments.map((a) => a.url)}` : '**沒有附件**'}`,inline: false},
            )
            .setFooter({ text: 'MHCAT帶給你最棒的Discord體驗!', iconURL: `${client.user.avatarURL()}` })
            .setTimestamp()

        return Logs.send({
            embeds: [MessageEdited]
        });
    })
})

client.on(Events.MessageDelete, async (message) => {
    if (message.guild === null) return;
    if (!message.guild) return;
    logging.findOne({
        guild: message.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const Logs = client.channels.cache.get(data.channel_id);
        if (!Logs) return;
        if(!message.author) return
        if(message.author.bot) return
        const MessageEdited = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.username} | 訊息刪除`,
                iconURL: `${message.author.avatarURL({
                    extension: 'png'
                }) ? message.author.avatarURL({
                    extension: 'png'
                }) : "https://media.discordapp.net/attachments/991337796960784424/1076068374284599307/yellow-discord-icon-15.jpg?width=699&height=701"}`
        })
            .setColor('#84C1FF')
            .setDescription(`**<:trash:1084846016798396526> 訊息刪除者: <@${message.author.id}> | <:Channel:994524759289233438> 訊息刪除位置: <#${message.channel.id}>**`)
            .addFields(
                { name: `**<:comments:985944111725019246> 訊息:**`, value: `\`\`\`${message.content} \`\`\``,inline: false},
                { name: `**<:attachment:1084846756799455242> 附件:**`, value: `${message.attachments.size > 0 ? `${message.attachments.map((a) => a.url)}` : '**沒有附件**'}`,inline: false},
            )
            .setFooter({ text: 'MHCAT帶給你最棒的Discord體驗!', iconURL: `${client.user.avatarURL()}` })
            .setTimestamp()
        return Logs.send({
            embeds: [MessageEdited],
        });
    })
})

/*// Channel Topic Updating 
client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
    
    logging.findOne({
        guild: channel.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);
    const TopicUpdate = new MessageEmbed()
        .setTitle('頻道主題更新')
        .setColor(channel.guild.me.displayHexColor)
        .setDescription(`${channel} 舊主題: **${oldTopic}** 新主題: **${newTopic}**`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [TopicUpdate]
    });
    })
});

// unhandled Guild Channel Update
client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {

    logging.findOne({
        guild: oldChannel.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);
    const unhandledGuildChannelUpdate = new MessageEmbed()
        .setTitle('Channel Updated!')
        .setColor(oldChannel.guild.me.displayHexColor)
        .setDescription("頻道" + oldChannel.id + "' 已编辑，但 discord-logs 找不到更新的内容...")
        .setTimestamp() 
    return LogChannel.send({
        embeds: [unhandledGuildChannelUpdate]
    });
})
});

// Member Started Boosting
client.on("guildMemberBoost", (member) => {
 
    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);
    const MemberBoost = new MessageEmbed()
        .setTitle('成員加成了伺服器')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(`**${member.user.tag}** 加成了  ${member.guild.name}!`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [MemberBoost]
    });
})
})

// Member Unboosted
client.on("guildMemberUnboost", (member) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);
    const MemberUnboost = new MessageEmbed()
        .setTitle('成員取消加成')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(`**${member.user.tag}** 取消加成  ${member.guild.name}!`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [MemberUnboost]
    });
})
})

// Member Got Role
client.on("guildMemberRoleAdd", (member, role) => {
    
    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const MemberRoleAdd = new MessageEmbed()
        .setTitle('成員取得身分組')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(`**${member.user.tag}** 取得身分組 \`${role.name}\``)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [MemberRoleAdd]
    });
})
})

// Member Lost Role
client.on("guildMemberRoleRemove", (member, role) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const MemberRoleRemove = new MessageEmbed()
        .setTitle('成員失去身分組')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(`**${member.user.tag}** 失去了 \`${role.name}\``)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [MemberRoleRemove]
    });
})
})

// Nickname Changed
client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const MemberNicknameUpdate = new MessageEmbed()
        .setTitle('暱稱更新')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(`${member.user.tag} 的暱稱從 \`${oldNickname}\` 變成 \`${newNickname}\``)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [MemberNicknameUpdate]
    });
})
})*/

/*
client.on("guildMemberRemove", (member) => {
    Number.findOne({
        guild: member.guild.id
    }, async (err, data) => {
     if(!data) return;
        const guild = client.guilds.cache.get(data.guild);
        if(!guild) return
        const get_memberNumber = guild.channels.cache.get(data.memberNumber)
        const channel_name = get_memberNumber.name
        get_memberNumber.setName(channel_name.replace(`${guild.members.cache.size + 1}`,`${guild.members.cache.size}`))
            .catch(console.error);
        if(channel_name.search(`${guild.members.cache.size + 1}`) === -1){
            console.log(`${guild.members.cache.size}`)
            get_memberNumber.setName(`${guild.members.cache.size}`)
            .catch(console.error);
            return
        }
    })
})
/*
// Server Boost Level Up
client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const LevelUp = new MessageEmbed()
        .setTitle('伺服器等級提升')
        .setColor(guild.me.displayHexColor)
        .setDescription(`${guild.name} 的等級提升到了 ${newLevel}`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [LevelUp]
    });
})
})

// Server Boost Level Down
client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const LevelDown = new MessageEmbed()
        .setTitle('伺服器等級降級')
        .setColor(guild.me.displayHexColor)
        .setDescription(`${guild.name} 的等級從 ${oldLevel} 降到 ${newLevel}`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [LevelDown]
    });
})
})

// Banner Added
client.on("guildBannerAdd", (guild, bannerURL) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const BannerAdd = new MessageEmbed()
        .setTitle('伺服器增加BANNER')
        .setColor(guild.me.displayHexColor)
        .setImage(bannerURL)
        .setTimestamp()     
    return LogChannel.send({
        embeds: [BannerAdd]
    });
})
})

// AFK Channel Added
client.on("guildAfkChannelAdd", (guild, afkChannel) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const AFKAdd = new MessageEmbed()
        .setTitle('增加AFK頻道')
        .setColor(guild.me.displayHexColor)
        .setDescription(`${guild.name} 增加了一個afk頻道: ${afkChannel}`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [AFKAdd]
    });
})
})

// Guild Vanity Add
client.on("guildVanityURLAdd", (guild, vanityURL) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VanityAdd = new MessageEmbed()
        .setTitle('公會邀請連結增加')
        .setColor(guild.me.displayHexColor)
        .setDescription(`${guild.name} 增加了一個新的連結: ${vanityURL}`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [VanityAdd]
    });
})
})

// Guild Vanity Remove
client.on("guildVanityURLRemove", (guild, vanityURL) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VanityRemove = new MessageEmbed()
        .setTitle('公會邀請連結刪除')
        .setColor(guild.me.displayHexColor)
        .setDescription(`${guild.name} 刪除了一個邀請連結: ${vanityURL}`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [VanityRemove]
    });
})
})

// Guild Vanity Link Updated
client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VanityUpdated = new MessageEmbed()
        .setTitle('邀請連結更新')
        .setColor(guild.me.displayHexColor)
        .setDescription(`${guild.name} 邀請連結從 ${oldVanityURL} 變成了 ${newVanityURL}!`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [VanityUpdated]
    });
})
})

// Message Pinned
client.on("messagePinned", (message) => {

    logging.findOne({
        guild: message.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const MessagePinned = new MessageEmbed()
        .setTitle('至頂消息')
        .setColor(message.guild.me.displayHexColor)
        .setDescription("這個訊息被至頂了" + message)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [MessagePinned]
    });
})
})

// Member Became Offline
client.on("guildMemberOffline", (member, oldStatus) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const MemberOffline = new MessageEmbed()
        .setTitle('成員下線')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + " 下線了")
        .setTimestamp() 
    return LogChannel.send({
        embeds: [MemberOffline]
    });
})
})

// Member Became Online
client.on("guildMemberOnline", (member, newStatus) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const MemberOnline = new MessageEmbed()
        .setTitle('成員上線')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + " 狀態變成 " + newStatus + "!")
        .setTimestamp() 
    return LogChannel.send({
        embeds: [MemberOnline]
    });
})
})

// Role Position Updated
client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {
    
    logging.findOne({
        guild: oldPosition.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const RolePositionUpdated = new MessageEmbed()
        .setTitle('身分組位置更新')
        .setColor(oldPosition.guild.me.displayHexColor)
        .setDescription(role.name + " 的位置從 " + oldPosition + " 變成了 " + newPosition)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [RolePositionUpdated]
    });
})
})

// Role Permission Updated
client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {

    logging.findOne({
        guild: oldPermissions.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const RolePermissionUpdated = new MessageEmbed()
        .setTitle('身分組權限更新')
        .setColor(oldPermissions.guild.me.displayHexColor)
        .setDescription(role.name + " 的權限從 " + oldPermissions + " 變成了 " + newPermissions)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [RolePermissionUpdated]
    });
})
})

// Avatar Updated
client.on("userAvatarUpdate", (user, oldAvatarURL, newAvatarURL) => {
 
    logging.findOne({
        guild: user.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const AvatarUpdated = new MessageEmbed()
        .setTitle('用戶頭像更新')
        .setColor(user.guild.me.displayHexColor)
        .setDescription(`${user.tag} 的頭像從 \n[Old Avatar](${oldAvatarURL})\n 變成\n[New Avatar(${newAvatarURL})]`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [AvatarUpdated]
    });
})
})


// Discriminator Updated
client.on("userDiscriminatorUpdate", (user, oldDiscriminator, newDiscriminator) => {

    logging.findOne({
        guild: user.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const Discriminator = new MessageEmbed()
        .setTitle('用戶自述更新')
        .setColor(user.guild.me.displayHexColor)
        .setDescription(`${user.tag} 的自述從 ${oldDiscriminator} 變成 ${oldDiscriminator}`)
        .setTimestamp() 
    return LogChannel.send({
        embeds: [Discriminator]
    });
})
})

// Joined VC
client.on("voiceChannelJoin", (member, channel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VCJoined = new MessageEmbed()
        .setTitle('加入語音頻道')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + " 加入了 " + `${channel}` + "!")
        .setTimestamp() 
    return LogChannel.send({
        embeds: [VCJoined]
    });
})
})

// Left VC
client.on("voiceChannelLeave", (member, channel) => {
    
    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VCLeft = new MessageEmbed()
        .setTitle('離開語音頻道')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + " 離開了 " + `${channel}` + "!")
        .setTimestamp() 
    return LogChannel.send({
        embeds: [VCLeft]
    });
})
})

// VC Switch
client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VCSwitch = new MessageEmbed()
        .setTitle('用戶去了別的語音頻道')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + " 從 " + oldChannel.name + " 跑到了 " + newChannel.name + "!")
        .setTimestamp() 
    return LogChannel.send({
        embeds: [VCSwitch]
    });
})
})

// VC Mute
client.on("voiceChannelMute", (member, muteType) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VCMute = new MessageEmbed()
        .setTitle('成員靜音')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + " 靜音了! (類型: " + muteType + ")")
        .setTimestamp() 
    return LogChannel.send({
        embeds: [VCMute]
    });
})
})

// VC Unmute
client.on("voiceChannelUnmute", (member, oldMuteType) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VCUnmute = new MessageEmbed()
        .setTitle('取消靜音')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + "取消了靜音!")
        .setTimestamp() 
    return LogChannel.send({
        embeds: [VCUnmute]
    });
})
})

// VC Defean
client.on("voiceChannelDeaf", (member, deafType) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VCDeafen = new MessageEmbed()
        .setTitle('成員拒聽')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + " 拒聽!")
        .setTimestamp()
    return LogChannel.send({
        embeds: [VCDeafen]
    });
})
})

// VC Undefean
client.on("voiceChannelUndeaf", (member, deafType) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const VCUndeafen = new MessageEmbed()
        .setTitle('成員取消拒聽')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + " 取消拒聽!")
        .setTimestamp()

    return LogChannel.send({
        embeds: [VCUndeafen]
    });
})
})

// User Started to Stream
client.on("voiceStreamingStart", (member, voiceChannel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const UserStreaming = new MessageEmbed()
        .setTitle('使用者開始直播')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + "開始直播，在: " + voiceChannel.name)
        .setTimestamp()

    return LogChannel.send({
        embeds: [UserStreaming]
    });
    })
})

// User Stopped to Stream
client.on("voiceStreamingStart", (member, voiceChannel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if(!data)return;
    const LogChannel = client.channels.cache.get(data.channel_id);    const UserStoppedStreaming = new MessageEmbed()
        .setTitle('使用者停止直播')
        .setColor(member.guild.me.displayHexColor)
        .setDescription(member.user.tag + "停止直播，在:" + voiceChannel.name)
        .setTimestamp()

    return LogChannel.send({
        embeds: [UserStoppedStreaming]
    });
})
})*/