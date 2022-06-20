const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const lotter = require('../../models/lotter.js');
const moment = require('moment')
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
    Permissions
 } = require('discord.js');
const { errorMonitor } = require("ws");
module.exports = {
    name: '刪除訊息',
    description: '刪除大量訊息',
    options: [{
        name: '刪除數量',
        type: 'INTEGER',
        description: '設定要刪除幾個訊息(最高99最低1)',
        required: true,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const number = interaction.options.getInteger("刪除數量")
        try {
            let delamount = number;
            if (parseInt(delamount < 1 || parseInt(delamount) > 99)) return errors('你只能清除1-99則消息')

            await interaction.channel.bulkDelete(parseInt(delamount), true);

            await interaction.reply({content: `<a:greentick:980496858445135893> | 成功清除 **${delamount}** 條訊息!`, ephemeral: true})    
        } catch (e) {
            const error_message = new MessageEmbed()
            .setTitle("錯誤!")
            .setColor("RED")
            .setDescription(`opps 出現了錯誤，非常抱歉\n以回報給夜貓，如果可以的話歡迎私訊\`夜貓#5042\`\n錯誤代碼:\n\`\`\`${e}\`\`\``)
            const channel = client.channels.cache.get("975217115059597363")
            channel.send({embeds: [error_message]})
            interaction.reply({embeds: [error_message]})       
        }
    }
}