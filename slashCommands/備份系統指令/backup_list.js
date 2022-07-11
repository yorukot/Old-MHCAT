const join_message = require("../../models/join_message.js")
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
 const backup = require("discord-backup");
module.exports = {
    name: '備份列表',
    description: '將現在的頻道備份',
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '管理者',
    emoji: `<:list:992002476360343602>`,

    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))return errors("你必須擁有\`管理者\`才能使用")
        var fs = require('fs');
        var dir = __dirname+"/backups/"+`${interaction.guild.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        backup.setStorageFolder(__dirname+"/backups/"+`${interaction.guild.id}`);        
        backup.list().then((backups) => {
            interaction.reply({embeds: [
                new MessageEmbed()
                .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的所有備份id`)
                .setDescription(`輸入\`/備份查詢 備份id\`可進行查看詳細資訊\`\n${backups.join("\n")}\``)
                .setColor("RANDOM")
            ]})
        });
        

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