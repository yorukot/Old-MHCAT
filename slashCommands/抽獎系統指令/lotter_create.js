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
 function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
const { errorMonitor } = require("ws");
module.exports = {
    name: '抽獎設置',
    description: '設置抽獎訊息',
    options: [{
        name: '截止日期',
        type: 'INTEGER',
        description: '設定抽獎要在甚麼時候結束(ex:2022060823 (2022年6月8號23點))',
        required: true,
    },{
        name: '抽出幾位中獎者',
        type: 'INTEGER',
        description: '請輸入要抽出幾位中獎者',
        required: true,
    },{
        name: '獎品',
        type: 'STRING',
        description: '輸入獎品要甚麼',
        required: true,
    },{
        name: '內文',
        type: 'STRING',
        description: '輸入抽獎訊息內文',
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/lotter',
    UserPerms: '訊息管理',
    emoji: `<:lottery:985946439253381200>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const date = `${interaction.options.getInteger("截止日期")}`
        const howmanywinner = `${interaction.options.getInteger("抽出幾位中獎者")}`
        const gift = interaction.options.getString("獎品")
        const content = interaction.options.getString("內文")
        const id = `${moment().utcOffset("+08:00").format('YYYYMMDDHHmm')}` + `${getRandomArbitrary(1000, 100)}lotter`
        lotter.findOne({
            guild: interaction.channel.guild.id,
            id: id
        }, async (err, data) => {
            if(data){
                return errors("目前使用人數有點多，請重試!")
            }else{
                // 創建一個新的data
                data = new lotter({
                    guild: interaction.channel.guild.id,
                    date: date,
                    gift: gift,
                    howmanywinner: howmanywinner,
                    id: id,
                    member: [],
                    end: false,
                    message_channel: interaction.channel.id,
                })
                data.save()
                // 設定embed & send embed
                const bt = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(id)
                    .setLabel('點我參加抽獎!')
                    .setEmoji("<:votingbox:988878045882499092>")
                    .setStyle('SUCCESS'),
                    new MessageButton()
                    .setCustomId(id + "search")
                    .setLabel('誰參加抽獎')
                    .setEmoji("<:searching:986107902777491497>")
                    .setStyle('PRIMARY'),
                );
                const lotter_message = new MessageEmbed()
                .setTitle("抽獎")
                .setDescription(content + "\n獎品:" + gift )
                .setColor(interaction.guild.me.displayHexColor)
                interaction.reply({embeds: [lotter_message], components: [bt]})
            }
        })
    }
}