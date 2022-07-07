const btn = require("../models/btn.js")
const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord,
    Discord,
    Modal,
} = require('discord.js');
const lotter = require('../models/lotter.js')
const moment  = require('moment')
const {
    MessageEmbed
} = require('discord.js');
const client = require('../index');
const { createCaptchaSync  } = require("captcha-canvas");
const { user } = require("../index");

client.on("interactionCreate", async (interaction) => {
    function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
    if (interaction.isButton()) {
        if(interaction.customId.includes('add') || interaction.customId.includes('delete')){
            try {
                btn.findOne({
                    guild: interaction.guild.id,
                    number: interaction.customId,
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        return;
                    } else {
                        if (interaction.customId.includes('add')) {
                            const role = interaction.guild.roles.cache.get(data.role)
                            if(!role) return errors("請通知群主管裡員找不到這個身分組!")
                            if (interaction.member.roles.cache.has(role.id)){
                                const error = new MessageEmbed()
                                .setColor("RED")
                                .setTitle("❎你已經擁有身分組了!")
                            interaction.reply({embeds: [error], ephemeral: true})
        
                            }else{
                            if(Number(role.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                            interaction.member.roles.add(role)
                            const add = new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("✅成功增加身分組!")
                            interaction.reply({embeds: [add], ephemeral: true})
                            }
                    }else if(interaction.customId.includes('delete')){
                        const role = interaction.guild.roles.cache.get(data.role)
                        if(!role) return errors("找不到這個身分組!")
                        if (interaction.member.roles.cache.has(role.id)){
                            if(Number(role.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                            interaction.member.roles.remove(role)
                            const warn = new MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("✅成功刪除身分組!")
                        interaction.reply({embeds: [warn], ephemeral: true})
                        }else{
                            const warn = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("❎你沒有這個身分組!")
                        interaction.reply({embeds: [warn], ephemeral: true})
                        }
                            
                    }else{
                        interaction.reply({content:"很抱歉，出現了錯誤!", ephemeral: true})
                    }
                }
                })
            } catch (error) {
                interaction.reply({content: "opps,出現了錯誤!\n有可能是你設定沒設定好\n或是我沒有權限喔(請確認我的權限比你要加的權限高，還需要管理身分組的權限)"})
            }
    }else if(interaction.customId.includes("lotter")){
        if(interaction.customId.includes("lottersearch")){
            const iddd = interaction.customId.replace("search", '')
            lotter.findOne({
                guild: interaction.guild.id,
                id: iddd,
            }, async (err, data) => {
            if(!data) return interaction.reply({content:"很抱歉，沒有這個抽獎，請通知管理員或服主!", ephemeral: true})
            if(data){
                const e = data.member.map(
                    (w, i) => `${interaction.guild.members.cache.get(w.id).user.tag},`
                )
                const embed = new MessageEmbed()
                    .setTitle(`有這些人抽獎了`)
                    .setDescription(e.join(' '))
                    .setColor("RANDOM")
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            })
        }else if(interaction.customId.includes("lotterrestart")){
            const iddd = interaction.customId.replace("restart", '')
            function getRandomArbitrary(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min) + min);
              }
            lotter.findOne({
                guild: interaction.guild.id,
                id: iddd,
            }, async (err, data) => {
                console.log(data)
            console.log(data.member)
            if(!data) return interaction.reply({content:"很抱歉，沒有這個抽獎，請通知管理員或服主!", ephemeral: true})
            if(data){
                const winner_array = []
            for(y = data.howmanywinner -1 ; y > -1; y--){
              const winner = data.member[getRandomArbitrary(0, data.member.length)]
                if(winner === undefined){
                    y--
                }else{
                    winner_array.push(winner.id)
                }
            }
            const guild = client.guilds.cache.get(data.guild);
            let channel = guild.channels.cache.get(data.message_channel);
            const winner_embed = new MessageEmbed()
            .setTitle("🎊恭喜中獎者!")
            .setDescription(`
            **🎉🎉恭喜:
            <@${winner_array.join('>\n<@')}>
            抽中: ${data.gift}
            **`)
            .setColor(channel.guild.me.displayHexColor)
            channel.send({content: `||<@${winner_array.join('><@')}>||`, embeds: [winner_embed]})
            data.collection.update(({guild: data.guild, id: data.id}), {$set: {end: true}})
            data.save()
            interaction.reply({content:"成功重抽!", ephemeral: true})
            }
            })
        }else{
            lotter.findOne({
                guild: interaction.guild.id,
                id: interaction.customId,
            }, async (err, data) => {
            if(!data) return interaction.reply({content:"很抱歉，沒有這個抽獎，請通知管理員或服主!", ephemeral: true})
            if(data){
                    for(x = data.member.length - 1; x > -1; x--){
                        if(data.member[x].id === interaction.user.id){
                            if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                const bt = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                    .setCustomId(interaction.customId + 'restart')
                                    .setLabel('點我重抽!')
                                    .setEmoji("<:votingbox:988878045882499092>")
                                    .setStyle('SUCCESS'),
                                );
                                return interaction.reply({content:"你已經參加過了，不過你似乎有管理訊息的權限，是不是要重抽呢?!", ephemeral: true, components: [bt]})
                            }else{
                                return interaction.reply({content:":x: 你無法重複參加!", ephemeral: true})
                            }
                        }
                    }
                    const object = {
                        time: moment().utcOffset("+08:00").format('YYYY年MM月DD日 HH點mm分'),
                        id: interaction.user.id,
                    }
                const date = Math.floor(Date.now() / 1000)
                 if(Number(data.date) >= Number(date)){
                    data.member.push(object)
                    data.save() 
                    const greate = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("✅成功參加抽獎!")
                    interaction.reply({embeds: [greate], ephemeral: true})
                }else{
                    return interaction.reply({content:":x: 很抱歉，這個抽獎已經過期!", ephemeral: true})
                }
            }
            })
        }
    }else if(interaction.customId.includes("verification")){
        const verification = require("../models/verification.js");
        verification.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (err) throw err; 
                const role = interaction.guild.roles.cache.get(data.role)
                if(!role) return errors("驗證身分組已經不存在了，請通管理員!")
                if(Number(role.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                const text = interaction.customId.replace("verification", "")
                const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');
                const modal = new Modal()
                .setCustomId(text + 'ver')
                .setTitle('請輸入驗證碼!');
                const favoriteColorInput = new TextInputComponent()
                .setCustomId(text + 'ver')
                .setLabel("請輸入圖片上的驗證碼")
                .setStyle('SHORT');
                const firstActionRow = new MessageActionRow().addComponents(favoriteColorInput);
                modal.addComponents(firstActionRow);
                await interaction.showModal(modal);
        })
    }
    }
})