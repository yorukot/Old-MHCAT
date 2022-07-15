const coin = require("../../models/coin.js");
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
    name: '扭蛋',
    description: '進行扭蛋，有機會抽中各種大獎喔!!!!',
    video: 'https://mhcat.xyz/docs/gashapon',
    emoji: `<:gashapon:997374176526610472>`,
    run: async (client, interaction, options, perms) => {
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
                    gift_change.findOne({
                        guild: interaction.guild.id,
                    }, async (err, data11111) => {
                    if(data.coin < (!data11111 ? 500 : data11111.coin_number)) return errors(`必須要有\`${!data11111 ? 500 : data11111.coin_number}\`個代幣才能進行扭蛋`)
                    const {DropTable} = require('drop-table');
                    let table = new DropTable();
                    gift.find({
                        guild: interaction.guild.id,
                        }, async (err, data11) => {
                        if(data11.length === 0){
                            table.addItem({'name':'空氣QQ<:peepoHugMilk:994650902050906234>別氣餒，下一次定是你!!','weight': 100});}
                            else{
                                let i = 0
                        for (let index = 0; index < data11.length; index++) {
                            i = i + data11[index].gift_chence
                            table.addItem({
                                'name':data11[index].gift_name,
                                'data': {'token': data11[index].gift_code},
                                'weight': data11[index].gift_chence
                            })
                        }
                        table.addItem({'name':'空氣QQ<:peepoHugMilk:994650902050906234>別氣餒，下一次定是你!!','weight': (100 - i)<0 ? 0 : (100 - i)});
                            }
                            const result = table.drop();
                            const msgg = await interaction.followUp({content: "https://cdn.discordapp.com/attachments/991337796960784424/997105505640136794/giphy.gif"})
                            data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin - (!data11111 ? 500 : data11111.coin_number)}})
                            setTimeout(() => {
                                msgg.edit({content: null, embeds:[new MessageEmbed()
                            .setTitle("<:gashapon:997374176526610472> 扭蛋系統")
                            .setDescription(`<:fireworks:997374182016958494><:fireworks:997374182016958494>你扭中了:\n${result.name}`)
                            .setColor("RANDOM")
                            .setFooter("如扭中的獎品有獎品代碼，將會私訊給您!", interaction.member.displayAvatarURL({
                                dynamic: true
                            }))
                            ]})
                            if(result.data === undefined) return
                            if(result.data.token === null){
                                gift.findOne({
                                    guild: interaction.guild.id,
                                    gift_name: result.name
                                }, async (err, data1111111) => {
                                    if(!data1111111) return
                                    data1111111.delete()
                                })
                                return
                            }
                            interaction.member.send({
                                embeds:[
                                    new MessageEmbed()
                                    .setTitle("<:fireworks:997374182016958494> 恭喜你中獎!!")
                                    .addFields(
                                        { name: '<:id:985950321975128094> **獎品名:**', value: `${result.name}`, inline: true},
                                        { name: '<:security:997374179257102396> **獎品代碼:**', value: `${result.data.token}`,inline: true}
                                    )
                                    .setColor("RANDOM")
                                ]
                            })
                            gift.findOne({
                                guild: interaction.guild.id,
                                gift_name: result.name
                            }, async (err, data1111111) => {
                                if(!data1111111) return
                                data1111111.delete()
                            })
                            return
                    }, 8000);
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