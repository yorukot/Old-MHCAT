const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton

} = require('discord.js');
const lotter = require('../../models/lotter.js');
const moment = require('moment');
function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
module.exports = {
    name: '抽獎設置',
    aliases: ['ls'],
    description: '設置抽獎的各項設定',
    video: 'https://mhcat.xyz/commands/lotter.html',
    usage: '[截止日期(西元年月日小時ex:2022052016)] [獎品] [要抽出幾個人(數字)] [訊息]',
    UserPerms: 'MANAGE_MESSAGES',
    emoji: `<:wheel:980102045849759845>`,
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, Discord, interaction) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");message.reply({embeds: [embed]})}
        const date = args[0]
        const gift = args[1]
        const howmanywinner = args[2]
        const embed_message = args.slice(3).join(' ');
        if(!date)return errors("請輸入截止日期!")
        if(!gift)return errors("請輸入禮物是甚麼!")
        if(!howmanywinner) return errors("請輸入要抽出幾位")
        const id = `${moment().utcOffset("+08:00").format('YYYYMMDDHHmm')}` + `${getRandomArbitrary(1000, 100)}lotter`
        lotter.findOne({
            guild: message.channel.guild.id,
            id: id
        }, async (err, data) => {
            if(data){
                return errors("目前使用人數有點多，請重試!")
            }else{
                // 創建一個新的data
                data = new lotter({
                    guild: message.channel.guild.id,
                    date: date,
                    gift: gift,
                    howmanywinner: howmanywinner,
                    id: id,
                    member: [],
                    end: false,
                    message_channel: message.channel.id,
                })
                data.save()
                // 設定embed & send embed
                const bt = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId(id)
                    .setLabel('點我參加抽獎!')
                    .setEmoji("🗳")
                    .setStyle('PRIMARY'),
                );
                const lotter_message = new MessageEmbed()
                .setTitle("抽獎")
                .setDescription(embed_message)
                .setColor(message.guild.me.displayHexColor)
                message.channel.send({embeds: [lotter_message], components: [bt]})
                message.delete()
            }
        })
}}