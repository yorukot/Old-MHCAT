const btn = require("../models/btn.js")
const leave_message = require('../models/leave_message.js')
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
const guild = require('../models/guild.js');
const join_message = require("../models/join_message.js")
const verification = require('../models/verification.js')
const cron_set = require('../models/cron_set.js');
const moment = require('moment')
var validateColor = require("validate-color").default;
const client = require('../index');
const { description } = require("../slashCommands/經驗系統指令/text_set.js");
client.on('interactionCreate', async (interaction) => {
    function errors(content) {
        const embed = new MessageEmbed().setTitle(`${content}`).setColor("RED");
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
    function greate(content) {
        const embed = new MessageEmbed().setTitle(`${content}`).setColor("GREEN");
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
    if (!interaction.isModalSubmit()) return;
    const text = interaction.fields.components[0].components[0].customId
    const all = interaction.fields.components[0].components[0].value
    if (text.includes("cron_set")) {
        const corn = interaction.fields.getTextInputValue("cron_setcron");
        const message = interaction.fields.getTextInputValue("cron_setmsg");
        const color = interaction.fields.getTextInputValue("cron_setcolor");
        const title = interaction.fields.getTextInputValue("cron_settitle");
        const content = interaction.fields.getTextInputValue("cron_setcontent");
        const id = interaction.customId
        const dsadsa = require('cron-validator') ;
        if(!dsadsa.isValidCron(corn,{allowSevenAsSunday: true,allowBlankDay: true,alias: true,seconds: true}))return errors("你輸入的不是正確的cron判別式，[點我前往查看cron教學](https://mhcat.xyz)")
        var parser = require('cron-parser');
        var interval = parser.parseExpression(corn);
        //if(Math.abs((interval.next().toDate()).valueOf() - (interval.next().toDate()).valueOf()) < 900000) return errors("每次運行間隔必須大於15分鐘!")
        if (color && !validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        if(!message&&!content&&!title)return errors("你都沒輸入你要發送甚麼，我要怎麼發送啦!")
        cron_set.findOne({
            guild: interaction.guild.id,
            id: id
        }, async (err, data) => {
            if(!data){
                return errors("很抱歉，出現了未知的錯誤，請重試!")
            }else{
                const  exampleEmbed = content || title ? 
                {content: message ? message : null, embeds: [{
                    color: color ? color : null,
                    title: title ? title : null,
                    description: content ? content : null,
                }]} : {content: message}
                data.collection.update(({guild: interaction.channel.guild.id,id: id}), {$set: {message: exampleEmbed}})
                data.collection.update(({guild: interaction.channel.guild.id,id: id}), {$set: {cron: corn}})
                interaction.reply({content: `:white_check_mark:**以下是該自動通知id:**\`${id}\`\n使用\`/自動通知刪除 id:${id}\`進行刪除\n~~我只是個分隔線，下面是你的訊息預覽~~`})
                interaction.channel.send(exampleEmbed)
                    var CronJob = require('cron').CronJob;
                    const guild = interaction.channel.guild
                    if(!guild) {data.delete();return }
                    const channel = guild.channels.cache.get(data.channel)
                    if(!channel) {data.delete();return }
                    var job = new CronJob(
                        corn,
                        function() {
                            cron_set.findOne({guild: guild.id, id: id}, async (err, data) => {
                                if(!data){
                                    return
                                }else{
                                    channel.send(exampleEmbed)
                                }
                            })
                        },
                        null,
                        true,
                        'asia/taipei'
                    );
            }
        })
    }else if (text.includes("join_msg")) {
        const content = interaction.fields.getTextInputValue("join_msgcontent");
        const color = interaction.fields.getTextInputValue("join_msgcolor");
        if (!validateColor(color) && color !== "RANDOM") return errors('你傳送的並不是顏色(色碼)')
        join_message.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(!data){
                return errors("很抱歉，出現了未知的錯誤!")
            }else{
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {message_content: content}})
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {color: color}})
            }
        })
        const welcome = new MessageEmbed()
    .setAuthor(`🪂 歡迎加入 ${interaction.guild.name}!`,`${interaction.guild.iconURL() === null ? interaction.guild.me.displayAvatarURL({dynamic: true}) : interaction.guild.iconURL()}`)
    .setDescription(`${content}`)
    .setThumbnail(interaction.user.displayAvatarURL({
      dynamic: true
    }))
    .setColor(color)
    .setTimestamp()
    interaction.reply({
        content: "下面為預覽，想修改嗎?再次輸入指令即可修改((membername)在到時候會變正常喔)",
        embeds: [welcome],
    });
    }else if (text.includes("leave_msg")) {
        const content = interaction.fields.getTextInputValue("leave_msgcontent");
        const color = interaction.fields.getTextInputValue("leave_msgcolor");
        const title = interaction.fields.getTextInputValue("leave_msgtitle");
        if (!validateColor(color) && color !== "RANDOM") return errors('你傳送的並不是顏色(色碼)')
        leave_message.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(!data){
                return errors("很抱歉，出現了未知的錯誤!")
            }else{
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {message_content: content}})
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {color: color}})
                data.collection.update(({guild: interaction.channel.guild.id}), {$set: {title: title}})
            }
        })
        const welcome = new MessageEmbed()
    .setTitle(`${title}`)
    .setDescription(`${content}`)
    .setThumbnail(interaction.user.displayAvatarURL({
      dynamic: true
    }))
    .setColor(color)
    .setTimestamp()
    interaction.reply({
        content: "下面為預覽，想修改嗎?再次輸入指令即可修改((MEMBERNAME)在到時候會變正常喔)",
        embeds: [welcome],
    });
    } else if (text.includes("roleadd")) {
        const role = interaction.fields.getTextInputValue(text);
        const add = text.replace("roleaddcontent", '') + `add`
        const delete1 = text.replace("roleaddcontent", '') + `delete`
        const bt = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId(add)
                .setLabel('✅點我增加身分組!')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId(delete1)
                .setLabel('❎點我刪除身分組!')
                .setStyle("DANGER"),
            );
        const embed = new MessageEmbed()
            .setTitle("選取身分組")
            .setDescription(`${role}`)
            .setColor(interaction.guild.me.displayHexColor)
        interaction.channel.send({
            embeds: [embed],
            components: [bt]
        });
        greate("成功創建領取身分組")
    } else if (text.includes("ticket")) {
        const color = interaction.fields.getTextInputValue('ticketcolor');
        const title = interaction.fields.getTextInputValue('tickettitle');
        const content = interaction.fields.getTextInputValue('ticketcontent');
        if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        const announcement = new MessageEmbed()
            .setTitle(title)
            .setDescription("" + content + "")
            .setColor(color)
        const bt = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('tic')
                .setLabel('🎫 點我創建客服頻道!')
                .setStyle('PRIMARY'),
            );
        interaction.channel.send({
            embeds: [announcement],
            components: [bt]
        })
        greate("成功創建私人頻道")
    } else if (text.includes("ver")) {
        let v = text.replace("ver", "");
        if (v === all) {
            verification.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (err) throw err;
                const role = interaction.guild.roles.cache.get(data.role)
                if (!role) return errors("驗證身分組已經不存在了，請通管理員!")
                if (Number(role.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                interaction.member.roles.add(role)
                greate("驗證成功，成功給予你身分組!")
            })
        } else {
            return errors("你的驗證碼輸入錯誤，請重試(如果看不清楚的話可以重打指令)")
        }
    } else if (text.includes("ann")) {
        const tag = interaction.fields.getTextInputValue('anntag');
        const color = interaction.fields.getTextInputValue('anncolor');
        const title = interaction.fields.getTextInputValue('anntitle');
        const content = interaction.fields.getTextInputValue('anncontent');
        if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        const announcement = new MessageEmbed()
            .setTitle(title)
            .setDescription("" + content + "")
            .setColor(color)
            .setFooter(
                `來自${interaction.user.tag}的公告`,
                interaction.user.displayAvatarURL({
                    dynamic: true
                })
            );
        // 設定是否傳送按鈕
        const yesno = new MessageEmbed()
            .setTitle("是否將此訊息送往公告?(請於六秒內點擊:P)")
            .setColor("#00ff19")
        const yes = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("announcement_yes")
                .setEmoji("✅")
                .setLabel('是')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('announcement_no')
                .setLabel('否')
                .setEmoji("❎")
                .setStyle('DANGER'),
            );
        // 發送訊息
        try {
            interaction.reply({
                content: tag,
                embeds: [announcement]
            })
            setTimeout(() => {
                interaction.channel.send({
                    embeds: [yesno],
                    components: [yes]
                }).then((message) => {setTimeout(() => {
                    message.delete()
                }, 6000);  
                });
            }, 500)
            
                   
        } catch (error) {
            // 如果有錯誤
            console.log(error)
            const error_embed = new MessageEmbed()
                .setTitle("錯誤 | error")
                .setDescription("很抱歉出現了錯誤!\n" + `\`\`\`${error}\`\`\`` + "\n如果可以再麻煩您回報給`夜貓#5042`")
                .setColor("RED")
            interaction.reply({
                embeds: [error_embed]
            })
        }
        // 說出是否發送+公告預覽
        const collector = interaction.channel.createMessageComponentCollector({
            time: 6000,
            max: 1,
        })
        collector.on('collect', async (ButtonInteraction) => {
            const id = ButtonInteraction.customId;
            if (id === `announcement_yes`) {
                guild.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data) => {
                    if (!data || data.announcement_id === "0") {
                        ButtonInteraction.reply("很抱歉!\n你還沒有對您的公告頻道進行選擇!\n命令:`<> 公告頻道設置 [公告頻道id]`\n有問題歡迎打`<>幫助`")
                        return
                    } else {
                        const channel111 = client.channels.cache.get(data.announcement_id)
                        const hasPermissionInChannel = channel111
                            .permissionsFor(interaction.guild.me)
                            .has('SEND_MESSAGES', false)
                        const hasPermissionInChannel1 = channel111
                            .permissionsFor(interaction.guild.me)
                            .has('VIEW_CHANNEL', false)
                        if (!hasPermissionInChannel || !hasPermissionInChannel1) {
                            return errors("我沒有權限在" + channel111.name + "發送消息!")
                        }
                        channel111.send({
                            content: tag,
                            embeds: [announcement]
                        })
                        ButtonInteraction.reply("<a:green_tick:994529015652163614> | 成功發送!")
                    }
                })
            }
            if (id === 'announcement_no') {
                ButtonInteraction.reply("已取消")
                return
            }
        })
    }
});