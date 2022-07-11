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
        try{
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

    } catch (error) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setURL("https://discord.gg/7g7VE2Sqna")
            .setStyle("LINK")
            .setLabel("支援伺服器")
            .setEmoji("<:customerservice:986268421144592415>"),
            new MessageButton()
            .setURL("https://mhcat.xyz")
            .setEmoji("<:worldwideweb:986268131284627507>")
            .setStyle("LINK")
            .setLabel("官方網站")
        );
        return interaction.reply({
            embeds:[new MessageEmbed()
            .setTitle("<a:error:980086028113182730> | 很抱歉，出現了錯誤!")
            .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\`\n常見錯誤:\n\`Missing Access\`:**沒有權限**\n\`Missing Permissions\`:**沒有權限**`)
            .setColor("RED")
            ],
            components:[row]
        })
    }
    }
}