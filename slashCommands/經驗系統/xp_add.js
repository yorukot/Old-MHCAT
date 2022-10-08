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
    PermissionsBitField
} = require('discord.js');
const voice_xp = require("../../models/voice_xp.js");
const text_xp = require("../../models/text_xp");
module.exports = {
    name: '經驗值改變',
    description: '增加某人的經驗值',
    cooldown: 10,
    options: [{
        name: '聊天經驗改變',
        type: ApplicationCommandOptionType.Subcommand,
        description: '增加聊天經驗',
        options: [{
            name: '使用者',
            type: ApplicationCommandOptionType.User,
            description: '要增加的對象!',
            required: true,
        },{
            name: '經驗值',
            type: ApplicationCommandOptionType.Integer,
            description: '要增加多少經驗值!',
            required: true,
        }]
    },{
        name: '語音經驗改變',
        type: ApplicationCommandOptionType.Subcommand,
        description: '增加語音經驗',
        options: [{
            name: '使用者',
            type: ApplicationCommandOptionType.User,
            description: '要增加的對象!',
            required: true,
        },{
            name: '經驗值',
            type: ApplicationCommandOptionType.Integer,
            description: '要增加多少經驗值!',
            required: true,
        }]
    }],
    UserPerms: '踢出用戶',
    //video: 'https://mhcat.xyz/commands/statistics.html',
    emoji: `<:onehour:1000310711941087293>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();
<<<<<<< HEAD
=======
           /* for (let i = 0; i < 10; i++) {
                console.log(`${i}: ${parseInt(Number(i) * (Number(i)/3) * 100 + 100)}`)
                
            }*/
>>>>>>> a0da53e (🌟 | 更新各種東西)
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))return errors(`你需要有\`${perms}\`才能使用此指令`)
        let xp_count = interaction.options.getInteger("經驗值")
        let member = interaction.options.getUser("使用者")
        if(interaction.options.getSubcommand() === "聊天經驗改變"){
            text_xp.findOne({
                guild: interaction.guild.id,
                member: member.id,
            }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    data = new text_xp({
                        guild: interaction.guild.id,
                        member: member.id,
                        xp: 0,
                        leavel: "0"
                    })
                    data.save()
                }
                setTimeout(() => {
                    text_xp.findOne({
                        guild: interaction.guild.id,
                        member: member.id,
                    }, async (err, data) => {
<<<<<<< HEAD
                    if (Number(xp_count) + Number(data.xp) > parseInt(Number(data.leavel) * (Number(data.leavel)/3) * 100 + 100)) {
                        data.collection.updateOne(({guild: interaction.guild.id,member: member.id,}), {$set: {leavel: `${Number(data.leavel) + 1}`}})
                        data.collection.updateOne(({ guild: interaction.guild.id,member: member.id, }), {$set: {xp: `${xp_count - (parseInt(Number(data.leavel) * (Number(data.leavel)/3) * 100 + 100) - data.xp)}`}})
                    }else{
                        data.collection.updateOne(({guild: interaction.guild.id,member: member.id,}), {$set: {xp: `${Number(xp_count) + Number(data.xp)}`}})
                    }
=======
                    
                    let less_xp = Number(xp_count)
                    let all_xp = 0
                    let i = Number(data.leavel)
                    if(xp_count > 0){
                        while (less_xp > 0) {
                            console.log(i)
                            if(i === Number(data.leavel)){
                                less_xp  = less_xp - (parseInt(Number(data.leavel) * (Number(data.leavel)/3) * 100 + 100) - Number(data.xp))
                                if(less_xp <= 0){
                                    all_xp = less_xp + (parseInt(Number(data.leavel) * (Number(data.leavel)/3) * 100 + 100) - Number(data.xp))
                                }
                            }else{
                                less_xp = less_xp - (parseInt(Number(i) * (Number(i)/3) * 100 + 100))
                                if(less_xp <= 0){
                                    all_xp = less_xp + (parseInt(Number(i) * (Number(i)/3) * 100 + 100))
                                }
                            }
                            i = i + 1
                        }
                        i = i - 1
                    }else{
                        while (less_xp < 0) {
                            if(i === Number(data.leavel)){
                                less_xp  = less_xp + (Number(data.xp))
                                if(less_xp >= 0){
                                    all_xp = less_xp
                                }
                            }else{
                                less_xp = less_xp + (parseInt(Number(i) * (Number(i)/3) * 100 + 100))
                                if(less_xp >= 0){
                                    all_xp = less_xp
                                }
                            }
                            i = i - 1
                        }
                        i = i + 1
                    }
                    data.collection.updateOne(({guild: interaction.guild.id,member: member.id,}), {$set: {leavel: `${i}`}})
                    data.collection.updateOne(({ guild: interaction.guild.id,member: member.id, }), {$set: {xp: `${all_xp}`}})
>>>>>>> a0da53e (🌟 | 更新各種東西)
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle('<:xp:990254386792005663> 經驗系統')
                            .setDescription(`${client.emoji.done}成功為:${member}\n增加:\`${xp_count}\``)
                            .setColor(client.color.greate)
                        ]
                    })
                })
<<<<<<< HEAD
                }, 1000);
=======
                }, 500);
>>>>>>> a0da53e (🌟 | 更新各種東西)
        })
        }else if(interaction.options.getSubcommand() === "語音經驗改變"){
            voice_xp.findOne({
                guild: interaction.guild.id,
                member: member.id,
            }, async (err, data) => {
                if (err) throw err;
                if(!data){
                    data = new voice_xp({
                        guild: interaction.guild.id,
                        member: member.id,
                        xp: '0',
                        leavel: '0',
                        leavejoin: "leave",
                    })
                    data.save()
                }
                setTimeout(() => {
                    voice_xp.findOne({
                        guild: interaction.guild.id,
                        member: member.id,
                    }, async (err, data) => {
<<<<<<< HEAD
                        if(Number(xp_count) + Number(data.xp) > parseInt(Number(data.leavel) * (Number(data.leavel)/2) * 100  + 100)){
                            data.collection.updateOne(({guild: interaction.guild.id,member: member.id,}), {$set: {xp: `${xp_count - (parseInt(Number(data.leavel) * (Number(data.leavel)/2) * 100  + 100) - data.xp)}`}})
                            data.collection.updateOne(({guild: interaction.guild.id,member: member.id,}), {$set: {leavel: `${Number(data.leavel) + 1}`}})
                        }else{
                            data.collection.updateOne(({guild: interaction.guild.id,member: member.id,}), {$set: {xp: `${Number(xp_count) + Number(data.xp)}`}})
                        }
=======
                        let less_xp = Number(xp_count)
                    let all_xp = 0
                    let i = Number(data.leavel)
                    if(xp_count > 0){
                        while (less_xp > 0) {
                            console.log(i)
                            if(i === Number(data.leavel)){
                                
                                less_xp  = less_xp - ((parseInt(Number(data.leavel) * (Number(data.leavel)/2) * 100  + 100)) - Number(data.xp))
                                if(less_xp <= 0){
                                    all_xp = less_xp + ((parseInt(Number(data.leavel) * (Number(data.leavel)/2) * 100  + 100)) - Number(data.xp))
                                }
                            }else{
                                less_xp = less_xp - (parseInt(Number(i) * (Number(i)/2) * 100  + 100))
                                if(less_xp <= 0){
                                    all_xp = less_xp + (parseInt(Number(i) * (Number(i)/2) * 100 + 100))
                                }
                            }
                            i = i + 1
                        }
                        i = i - 1
                    }else{
                        while (less_xp < 0) {
                            if(i === Number(data.leavel)){
                                less_xp  = less_xp + (Number(data.xp))
                                if(less_xp >= 0){
                                    all_xp = less_xp
                                }
                            }else{
                                less_xp = less_xp + (parseInt(Number(i) * (Number(i)/2) * 100 + 100))
                                if(less_xp >= 0){
                                    all_xp = less_xp
                                }
                            }
                            i = i - 1
                        }
                        i = i + 1
                    }
                    data.collection.updateOne(({guild: interaction.guild.id,member: member.id,}), {$set: {leavel: `${i}`}})
                    data.collection.updateOne(({ guild: interaction.guild.id,member: member.id, }), {$set: {xp: `${all_xp}`}})
>>>>>>> a0da53e (🌟 | 更新各種東西)
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle('<:xp:990254386792005663> 經驗系統')
                                .setDescription(`${client.emoji.done}成功為:${member}\n增加:\`${xp_count}\``)
                                .setColor(client.color.greate)
                            ]
                        })
                    })
                }, 1000);
            })
        }
    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
}}