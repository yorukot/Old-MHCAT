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
    name: '簽到',
    description: '簽到來獲得扭蛋代幣',
   // video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:sign:997352888613490708>`,
    run: async (client, interaction, options) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id
            }, async (err, data) => {
                if(!data){
                    data = new coin({
                        guild: interaction.guild.id,
                        member: interaction.member.id,
                        coin: 25,
                        today: true
                    })
                    data.save()
                }else{
                    if(data.today) return errors("你今天已經簽到過了!請於明天再來投票!")
                    data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {today: true}})
                    data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin + 25}})
                }
                const good = new MessageEmbed()
                .setTitle("<:calendar:990254384812290048>你成功簽到了!")
                .setDescription("<:Cat_ThumbsUp:988665659850362920> 今天有準時簽到很棒喔!\n明天也要記得來簽到.w.")
                .setColor('RANDOM')
                interaction.reply({embeds: [good]})
            })

        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
