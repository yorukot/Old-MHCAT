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
    name: '備份查詢',
    description: '查詢某個特定的備份',
    options: [{
        name: '備份id',
        type: 'STRING',
        description: '輸入備份id可以使用 /備份列表 進行查詢所有備份',
        required: true,
    }],
    //video: 'https://mhcat.xyz/docs/join_message',
    UserPerms: '管理者',
    emoji: `<:searching:986107902777491497>`,
    run: async (client, interaction, options) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        function naaaaa(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.channel.send({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))return errors("你必須擁有\`管理者\`才能使用")
        var fs = require('fs');
        var dir = __dirname+"/backups/"+`${interaction.guild.id}`;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        backup.setStorageFolder(__dirname+"/backups/"+`${interaction.guild.id}`);        const backup_id = interaction.options.getString("備份id")
        backup.fetch(backup_id).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            let embed = new MessageEmbed()
                .setTitle("<:info:985946738403737620> 備份資訊")
                .addField("<:id:992009480063692801> 備份id", backupInfos.id, false)
                .addField("<:server:986064124209418251> 伺服器id", backupInfos.data.guildID, false)
                .addField("<:paper:992009289923313755> 該備份大小", `${backupInfos.size} kb`, false)
                .addField("<:page:992009288232996945> 創建於", formatedDate, false)
                .setColor("RANDOM");
            interaction.reply({embeds:[embed]})
        }).catch((err) => {
            return errors("找不到這個備份，請使用\`/備份列表\`進行查看")
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