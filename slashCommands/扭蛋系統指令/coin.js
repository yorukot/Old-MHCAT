const coin = require("../../models/coin.js");
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
    name: '扭蛋代幣',
    description: '查詢你有多少扭蛋代幣',
   // video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:ticket:985945491093205073>`,
    run: async (client, interaction, options) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id
            }, async (err, data) => {
                if(!data){
                errors("你還沒有任何代幣欸使用`/簽到`或是多講話，都可以獲得代幣喔!")
                }else{
                    const good = new MessageEmbed()
                    .setTitle(`<:money:997100999305068585>你目前有:\`${data.coin}\`個代幣!`)
                    .setDescription("<:question:997101823708102808>我該如何獲取代幣?\n使用`/簽到`或是多多聊天都可以拿到代幣喔\n<a:catjump:984807173529931837>對了對了，代幣數到了`1000`可以進行扭蛋喔!")
                    .setFooter(`你還差:${1000 - (data.coin) > 0 ? `你還差${1000 - (data.coin)}就可以扭蛋了，加油!!`: "你可以扭蛋了!!使用`/扭蛋`進行扭蛋"}`,interaction.member.displayAvatarURL({
                        dynamic: true
                    }))
                    .setColor('RANDOM')
                    interaction.reply({embeds: [good],ephemeral: true})
                }
            })

        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}