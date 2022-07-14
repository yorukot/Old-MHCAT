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
    name: '扭蛋',
    description: '進行扭蛋，有機會抽中nitro喔!!!!',
   // video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:ticket:985945491093205073>`,
    run: async (client, interaction, options) => {
        try{
        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.followUp({embeds: [embed],ephemeral: true})}
        coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id
            }, async (err, data) => {
                if(!data){
                errors("你還沒有任何代幣欸使用`/簽到`或是多講話，都可以獲得代幣喔!")
                }else{
                    if(data.coin < 1000) return errors("必須要有`1000`個代幣才能進行扭蛋")
                    const {DropTable} = require('drop-table');
                    let table = new DropTable();
                    table.addItem({'name':'空氣QQ<:peepoHugMilk:994650902050906234>別氣餒，下一次定是你!!','weight': 100});
                    let result = table.drop();
                    data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin - 1000}})
                    const msgg = await interaction.followUp({content: "https://cdn.discordapp.com/attachments/991337796960784424/997105505640136794/giphy.gif"})
                    setTimeout(() => {
                        msgg.edit({content: null, embeds:[new MessageEmbed()
                            .setTitle("<:gashapon:997106317045022751> 抽獎系統")
                            .setDescription(`<:fireworks:994643526820319313><:fireworks:994643526820319313>你抽中了:\n${result.name}`)
                            .setColor("RANDOM")
                            .setFooter("如抽中的獎品有獎品代碼，將會私訊給您!", interaction.member.displayAvatarURL({
                                dynamic: true
                            }))
                            ]})
                    }, 8000);
                }
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}