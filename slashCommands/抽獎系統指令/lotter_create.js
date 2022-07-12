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
 const addSubtractDate = require("add-subtract-date");
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
        type: 'STRING',
        description: '輸入多久後截止ex:01d02h10m(1天2小時10分鐘後截止)也可以輸入單一ex:01d or 03h10m',
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
    },{
        name: '可以抽的身分組',
        type: 'ROLE',
        description: '輸入哪個身分組可以抽(要有這個身分組才能抽)(選填)',
        required: false,
    },{
        name: '不能抽的身分組',
        type: 'ROLE',
        description: '輸入哪個身分組不能抽(有這個身分組就不能抽)(選填)',
        required: false,
    },{
        name: '最高抽獎人數',
        type: 'INTEGER',
        description: '設定最多只能有幾位參加',
        required: false,
    }],
    video: 'https://mhcat.xyz/docs/lotter',
    UserPerms: '訊息管理',
    emoji: `<:lottery:985946439253381200>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const date = `${interaction.options.getString("截止日期")}`
        let d = date.indexOf("d");
        let h = date.indexOf("h");
        let m = date.indexOf("m");
        if(d === -1 && h === -1 && m === -1)return errors("你輸入的日期不符合規範!請輸入??d ??h ??m(如為個位數，十位數請加0 ex:01(1))")
        const day = (d !== -1 ? Number(date.substring(d-2, d)) : 0)
        const hour = (h !== -1 ? Number(date.substring(h-2, h)) : 0)
        const min = (m !== -1 ? Number(date.substring(m-2, m)) : 0)
        if(day === NaN || hour === NaN || min === NaN)return errors("你輸入的時間不正確，請使用??d??h??m")
        function addHoursToDate(objDate, intHours) {
            var numberOfMlSeconds = objDate.getTime();
            var addMlSeconds = (intHours * 60) * 60 * 1000;
            var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
            return newDateObj;
        }
        function addHoursToDate111(objDate, intHours) {
            var numberOfMlSeconds = objDate.getTime();
            var addMlSeconds = (intHours) * 60 * 1000;
            var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
            return newDateObj;
        }
        const testes = new Date()
        let dd = addHoursToDate(testes, day*24)
        let hh = addHoursToDate(dd, hour) 
        let sum = addHoursToDate111(hh, min)
        const howmanywinner = `${interaction.options.getInteger("抽出幾位中獎者")}`
        const max = interaction.options.getInteger("最高抽獎人數")
        const gift = interaction.options.getString("獎品")
        const content = interaction.options.getString("內文")
        const role1 = interaction.options.getRole("可以抽的身分組")
        const role2 = interaction.options.getRole("不能抽的身分組")
        const id = `${Date.now()}${parseInt(getRandomArbitrary(1000, 100))}lotter`
        if(Math.round(sum.getTime() / 1000) === NaN) return errors("你輸入的時間不正確，請使用??d??h??m")
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
                    date: Math.round(sum.getTime() / 1000),
                    gift: gift,
                    howmanywinner: howmanywinner,
                    id: id,
                    member: [],
                    end: false,
                    message_channel: interaction.channel.id,
                    yesrole: role1 ? role1.id : null,
                    norole: role2 ? role2.id : null,
                    maxNumber: max ? max : null
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
                .setTitle("<a:lottery_oh:994621487627632730> **抽獎系統**")
                .setDescription(content)
                .addFields(
                { name: '<:gift:994585975445528576> **獎品**', value: gift, inline: true },
                { name: '<:group:994888708799074374> **共抽出**', value: `${howmanywinner}位`, inline: true },
                { name: '<:chronometer:986065703369080884> **結束時間**', value: `<t:${Math.round(sum.getTime() / 1000)}>`, inline: false },
                )
                .setColor(interaction.guild.me.displayHexColor)
                .setFooter("點擊下方的按鈕即可參加抽獎")
                interaction.channel.send({embeds: [lotter_message], components: [bt]})
                setTimeout(() => {
                    interaction.reply({
                        embeds: [new MessageEmbed()
                        .setTitle("<a:green_tick:994529015652163614> | 成功創建抽獎，點擊兩次參加抽獎可以進行重抽")
                        .setColor(client.color.greate)
                        ],
                        ephemeral: true
                    })
                }, 500);
            }
        })


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}