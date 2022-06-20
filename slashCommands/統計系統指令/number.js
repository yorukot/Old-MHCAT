const Number = require("../../models/Number.js");
const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageAttachment,
    Permissions

} = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
    name: '統計系統查詢',
    description: '查詢統計消息',
    //video: 'https://mhcat.xyz/commands/statistics.html',
    emoji: `<:searching:986107902777491497>`,
     run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        const embed = new MessageEmbed()
        .setTitle("統計系統查詢")
        .setDescription(`
        我的統計系統是每**10分鐘更新一次**\`(因為discord api每10分鐘才能更新一次)\`
        輸入 /統計系統創建 [選擇要\`文字頻道\`或是\`語音頻道\`] [輸入想創建的統計名稱]
        
        **用戶查詢**
        \`\`\`
用戶總數 (伺服器的總人數)
使用者總數 (伺服器非機器人人數)
機器人數 (伺服器總共的機器人數量)\`\`\`
        **伺服器頻道**
        \`\`\`
頻道數量 (頻道總數量)
文字頻道數量 (文字頻道總數)
語音頻道數量 (語音頻道總數)\`\`\`
        `)
        .setColor("RANDOM")
        interaction.reply({embeds:[embed]})
}}