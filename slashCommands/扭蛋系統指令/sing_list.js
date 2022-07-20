const coin = require("../../models/coin.js");
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
    name: '簽到列表',
    description: '查看今天有誰簽到了',
    video: 'https://mhcat.xyz/docs/snig',
    emoji: `<:sign:997374180632825896>`,
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        coin.find({
                guild: interaction.guild.id,
                today: true,
            }, async (err, data) => {
                gift_change.findOne({
                    guild: interaction.guild.id,
                }, async (err, data1111) => {
                if(!data){
                return errors("沒有人有簽到過!")
                }else{
                    let array = []
                    for(let i = 0; i < data.length; i++){
                        let aaaaaaaaa = `✅ **簽到人:**<@${data[i].member}>  |  `
                        array.push(aaaaaaaaa)
                    }
                    const good = new MessageEmbed()
                    .setTitle("<:list:992002476360343602> 今天有這些人簽到了:")
                    .setDescription(array.join(''))
                    .setColor('RANDOM')
                    interaction.reply({embeds: [good]})
                }
            })
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
