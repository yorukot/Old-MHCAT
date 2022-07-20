const gift = require("../../models/gift.js");
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
    name: '扭蛋獎池查詢',
    description: '增加扭蛋的獎池',
    video: 'https://mhcat.xyz/docs/prize_search',
    emoji: `<:list:992002476360343602>`,
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        gift.find({
            guild: interaction.guild.id,
            }, async (err, data) => {
                if(data.length === 0){
                    return errors("目前獎池沒有任何獎品喔!")
                }else{
                    const array = []
                    const e = data.map(
                        (w, i) => `**<:id:985950321975128094> 獎品名:** \n\`${w.gift_name}\`\n**<:dice:997374185322057799> 獎品抽中概率:**\n\`${w.gift_chence}\`%\n`
                    )
                    for(let i = 0; i < data.length; i++) {
                        let arrary111 = {name: `<:id:985950321975128094> 獎品名: \`${data[i].gift_name}\``, value: `**<:dice:997374185322057799> 獎品抽中概率:** : \`${data[i].gift_chence}\`%`,inline: true}
                        array.push(arrary111)
                    }
                    gift_change.findOne({
                        guild: interaction.guild.id,
                    }, async (err, data1) => {
                    return interaction.reply({
                        embeds:[
                            {type: 'rich',
                            title: `<:list:992002476360343602> 以下是${interaction.guild.name}的獎池`,
                            color: 'RANDOM',
                            fields: array,
                            description: `**<:money:997374193026994236> 扭蛋所需代幣:**\`${data1.coin_number}\`個\n<:calendar:990254384812290048> **簽到給予代幣數:**\`${data1.sign_coin}\`個\n**<:levelup:990254382845157406> 等級提升給予倍數:**\`${data1.xp_multiple}\`倍`,
                            footer: {
                              text: `${interaction.user.tag}的查詢`,
                              iconURL: interaction.user.displayAvatarURL({
                                dynamic: true
                                })
                            }}
                        ]
                    })
                })
                }
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}