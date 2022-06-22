const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
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
    name: '私人頻道設置',
    description: '設置私人頻道',
    options: [{
        name: '按鈕名稱',
        type: 'STRING',
        description: '輸入按鈕名稱(如有多顆按鈕請使用^進行區隔)',
        required: true,
    },{
        name: '按鈕顏色',
        type: 'STRING',
        description: '輸入按鈕，僅支援GREEN、RED、BLUE、NONE(如有多顆按鈕請使用^進行區隔)',
        required: true,
    },{
        name: '按鈕表情符號',
        type: 'STRING',
        description: '輸入按鈕emoji(一顆按鈕僅能有一個emoji)(如有多顆按鈕請使用^進行區隔)',
        required: true,
    },{
        name: '類別',
        type: 'CHANNEL',
        description: '輸入私人頻道要在哪個類別開啟!',
        required: true,
    },{
        name: '管理員身分組',
        type: 'ROLE',
        description: '輸入管理員身分組(有這個身分組的能夠管理私人頻道)!',
        required: true,
    }],
   // video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:ticket:985945491093205073>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const channel = interaction.options.getChannel("類別")
        const role1 = interaction.options.getRole("管理員身分組")

        const role = role1.id
        if (!channel.type === "GUILD_CATEGORY") return errors('你輸入的不是一個類別')
            ticket_js.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if(!data){
                    data = new ticket_js({
                        guild: interaction.guild.id,
                        ticket_channel: channel.id,
                        admin_id: role,
                        everyone_id: interaction.guild.roles.everyone.id,
                    })
                    data.save()
                }else{
                    const error = new MessageEmbed()
                    .setTitle("__**錯誤**__")
                    .setDescription("您已經註冊一個私人頻道了，如果需要更改，請打\n\`<>h 刪除私人頻道\`\n將會告訴您如何刪除")
                    .setColor("RED")
                    interaction.reply({embeds: [error],ephemeral: true})
                    return
                }
                const modal = new Modal()
                .setCustomId("nal")
                .setTitle('私人頻道系統!');
                const color = new TextInputComponent()
                .setCustomId("ticketcolor")
                .setLabel("請輸入嵌入顏色")
                .setStyle('SHORT');
                const title = new TextInputComponent()
                .setCustomId("tickettitle")
                .setLabel("請輸入標題")
                .setStyle('SHORT');
                const content = new TextInputComponent()
                .setCustomId('ticketcontent')
                .setLabel("請輸入內文")
                .setStyle('PARAGRAPH');
                const color1 = new MessageActionRow().addComponents(color);
                const title1 = new MessageActionRow().addComponents(title);
                const content1 = new MessageActionRow().addComponents(content);
                modal.addComponents(color1,title1,content1);
                await interaction.showModal(modal);
            })
    }
}