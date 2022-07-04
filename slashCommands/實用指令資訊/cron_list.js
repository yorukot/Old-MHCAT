const cron_set = require('../../models/cron_set.js');
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment,
    Modal,
    TextInputComponent,
    Permissions,
 } = require('discord.js');
 function checkURL(image) {
    return(image.match(/\.(jpg|png)$/) != null);
}
module.exports = {
    name: '自動通知列表',
    description: '查看所有的自動通知列表',
    //video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        cron_set.find({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if(!data){
                return errors("你還沒有設定過自動通知喔!")
            }else{
                for(let i = 0; i < data.length; i++){
                    if(data[i].cron === null) data[i].delete()
                }
                const e = data.map(
                    (w, i) => `\n**❰${i + 1}❱ id:\`${w.id}\` cron設定:\`${w.cron}\` 頻道:**<#${w.channel}>`
                )
                interaction.reply({embeds: [
                    new MessageEmbed()
                    .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的所有自動通知id`)
                    .setDescription(`輸入\`/自動通知刪除 id\`可進行刪除之前設定的自動通知\n${e.join(" ")}`)
                    .setColor("RANDOM")
                ]})
            }
        })
    }
}