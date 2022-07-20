const gift_change = require("../../models/gift_change.js");
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
    name: '扭蛋代幣相關設定',
    description: '改變每次扭蛋所需的代幣數量',
    options: [{
        name: '抽獎所需代幣',
        type: 'INTEGER',
        description: '每次扭蛋所需的代幣數量',
        required: true,
    },{
        name: '簽到給予代幣數',
        type: 'INTEGER',
        description: '每次簽到會拿到多少代幣',
        required: true,
    },{
        name: '通知頻道',
        type: 'CHANNEL',
        channel_types: [0,5],
        description: '抽中後的通知頻道',
        required: true,
    },{
        name: '等級提升倍數',
        type: 'NUMBER',
        description: '等級提升時要給等級幾倍的代幣ex:假設你提升到9等，倍數設1.5就會得到 9*1.5=100',
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/required_coins',
    emoji: `<:coins:997374177944281190>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        const number = interaction.options.getInteger("抽獎所需代幣")
        const channel = interaction.options.getChannel("通知頻道")
        const sign_coin = interaction.options.getInteger("簽到給予代幣數")
        const xp_multiple = interaction.options.getNumber("等級提升倍數")
        if(number > 999999999) return errors("最高代幣設定數只能是999999999")
        if(sign_coin > 999999999) return errors("最高代幣設定數只能是999999999")
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        gift_change.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if(!data){
                    data = new gift_change({
                        guild: interaction.guild.id,
                        coin_number: number,
                        sign_coin: sign_coin,
                        channel: channel.id,
                        xp_multiple: xp_multiple,
                    })
                    data.save()
                }else{
                    data.delete()
                    data = new gift_change({
                        guild: interaction.guild.id,
                        coin_number: number,
                        sign_coin: sign_coin,
                        channel: channel.idk,
                        xp_multiple: xp_multiple,
                    })
                    data.save()
                }
                const good = new MessageEmbed()
                .setTitle(`<:money:997374193026994236>成功改變每次扭蛋及抽獎代幣數\n扭蛋所需代幣:\`${number}\`\n簽到給予代幣數:\`${sign_coin}\`\n等級提升給予倍數:\`${xp_multiple}\``)
                .setDescription(`通知頻道:${channel}`)
                .setFooter("MHCAT", interaction.member.displayAvatarURL({
                    dynamic: true
                }))
                .setColor('RANDOM')
                interaction.reply({embeds: [good]})
            })

        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}