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
    name: '自動通知刪除',
    description: '刪除之前設定的自動通知',
    options: [{
        name: 'id',
        type: 'STRING',
        description: '輸入要刪除的自動通知id!',
        required: true
    }],
    //video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const id = interaction.options.getString("id")
        cron_set.findOne({
            guild: interaction.guild.id,
            id: id
        }, async (err, data) => {
            if(!data){
                return errors("找不到這個id的自動通知，請使用`/自動通知列表`進行查詢")
            }else{
                data.delete()
                interaction.reply({embeds: [new MessageEmbed()
                .setTitle("自動通知系統")
                .setDescription("成功刪除該自動通知")
                .setColor("GREEN")
            ]})
            }
        })
    }
}