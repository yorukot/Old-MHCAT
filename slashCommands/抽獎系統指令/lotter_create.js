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
        description: '設定抽獎要在甚麼時候結束(ex:01d10h09m (1天10小時9分鐘後，也可以只打其中某一個ex:09m))',
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
        const date = `${interaction.options.getString("截止日期")}`
        let d = date.indexOf("d");
        let h = date.indexOf("h");
        let m = date.indexOf("m");
        if(d === -1 && h === -1 && m === -1)return errors("你輸入的日期不符合規範!請輸入??d ??h ??m(如為個位數，十位數請加0 ex:01(1))")
        console.log(d,h,m)
        console.log(date.substring(d-2, d))
        const day = (d !== -1 ? Number(date.substring(d-2, d)) : 0)
        const hour = (h !== -1 ? Number(date.substring(h-2, h)) : 0)
        const min = (m !== -1 ? Number(date.substring(m-2, m)) : 0)
        if(day === NaN || hour === NaN || min === NaN)return errors("你輸入的時間不正確，請使用??d")
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
        console.log(min, hour, day)
        const testes = new Date()
        console.log(testes)
        let dd = addHoursToDate(testes, day*24)
        console.log(dd)
        let hh = addHoursToDate(dd, hour) 
        console.log(hh)
        let sum = addHoursToDate111(hh, min)
        const howmanywinner = `${interaction.options.getInteger("抽出幾位中獎者")}`
        const gift = interaction.options.getString("獎品")
        const content = interaction.options.getString("內文")
        const id = `${Date.now()}${parseInt(getRandomArbitrary(1000, 100))}lotter`
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
                { name: '<:man:994585979040059532> **創辦人**', value: `<@${interaction.user.id}>`, inline: true },
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
    }
}