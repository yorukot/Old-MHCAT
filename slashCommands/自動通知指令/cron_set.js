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
    name: '自動通知',
    description: '設定自動聊天頻道要在哪裡發送',
    options: [{
        name: '頻道',
        type: 'CHANNEL',
        description: '輸入要發送的頻道!',
        channel_types: [0,5],
        required: true
    }],
    //video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options, perms) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel1 = interaction.options.getChannel("頻道")
        const channel = channel1.id
        const id = new Date().valueOf()
        cron_set.findOne({
            guild: interaction.guild.id,
            id: id
        }, async (err, data) => {
            cron_set.find({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if(data.length >= 10)return errors("一個伺服器最多只能設置10個自動通知，請使用`/備份列表`進行刪除")
            })
            if(data){
                return errors("很抱歉，出現了未知的錯誤，請重試!")
            }else{
                data = new cron_set({
                    cron: null,
                    guild: interaction.guild.id,
                    channel: channel,
                    id: id,
                    message: null,
                })
                data.save()
            }
        })
                const modal = new Modal()
                .setCustomId(`${id}`)
                .setTitle('自動發送通知系統!');
                const tag = new TextInputComponent()
                .setCustomId("cron_setcron")
                .setLabel("請輸入corn表達式")
                .setRequired(true)
                .setStyle('SHORT');
                const message = new TextInputComponent()
                .setCustomId("cron_setmsg")
                .setLabel("請輸入文字(如不輸入這項請務必輸入下面三項)")
                .setRequired(false)
                .setStyle('PARAGRAPH');
                const color = new TextInputComponent()
                .setCustomId('cron_setcolor')
                .setLabel("請輸入你的嵌入訊息顏色(如不輸入嵌入訊息相關，請務必輸入文字)")
                .setRequired(false)
                .setStyle('SHORT');
                const title = new TextInputComponent()
                .setCustomId('cron_settitle')
                .setLabel("請輸入你的嵌入標題(如不輸入嵌入訊息相關，請務必輸入文字)")
                .setRequired(false)
                .setStyle('SHORT');
                const content = new TextInputComponent()
                .setCustomId('cron_setcontent')
                .setLabel("請輸入嵌入內文(如不輸入嵌入訊息相關，請務必輸入文字)")
                .setRequired(false)
                .setStyle('PARAGRAPH');
                const firstActionRow = new MessageActionRow().addComponents(tag);
                const color1 = new MessageActionRow().addComponents(color);
                const title1 = new MessageActionRow().addComponents(title);
                const content1 = new MessageActionRow().addComponents(content);
                const message1 = new MessageActionRow().addComponents(message);
                modal.addComponents(firstActionRow,message1,color1,title1,content1);
                await interaction.showModal(modal);  


            } catch (error) {
                const error_send= require('../../functions/error_send.js')
                error_send(error, interaction)
            }
    }
}