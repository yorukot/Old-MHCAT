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
const { channels } = require("../../index.js");
module.exports = {
    name: '扭蛋',
    description: '進行扭蛋，有機會抽中各種大獎喔!!!!',
    options: [{
        name: '連抽',
        type: 'STRING',
        description: '如果需要連抽的話可以使用這個指令',
        required: false,
        choices:[
            { name: '5連抽(無buff)', value: '5' },
            { name: '10連抽(空氣機率減少5%)', value: '10' },
            { name: '15連抽(空氣機率減少7%)', value: '15' },
            { name: '20連抽(空氣機率減少10%)', value: '20' },
        ],
    }],
    video: 'https://mhcat.xyz/docs/gashapon',
    emoji: `<:gashapon:997374176526610472>`,
    run: async (client, interaction, options, perms) => {
        try{
        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.followUp({embeds: [embed],ephemeral: true})}
        const dsadsadsa = interaction.options.getString("連抽")
        const draw = dsadsadsa ? Number(dsadsadsa) === 5 ? 0 : Number(dsadsadsa) === 10 ? 5 : Number(dsadsadsa) === 15 ? 7 : 10 : 0
        const poiuytr = dsadsadsa ? Number(dsadsadsa) : 1
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
                    if(data.coin < (!data11111 ? 500 * poiuytr : data11111.coin_number * poiuytr)) return errors(`必須要有\`${!data11111 ? 500*poiuytr : data11111.coin_number*poiuytr}\`個代幣才能進行扭蛋`)
                    const {DropTable} = require('drop-table');
                    let table = new DropTable();
                    gift.find({
                        guild: interaction.guild.id,
                        }, async (err, data11) => {
                        if(data11.length === 0){
                            for(let i = 0; i < poiuytr; i++){
                                table.addItem({'name':'空氣QQ<:peepoHugMilk:994650902050906234>別氣餒，下一次定是你!!' + `||${i}||`,'weight': 1});
                            }}
                            else{
                                let i = 0
                            const awaqe = draw / data11.length
                        for (let index = 0; index < data11.length; index++) {
                            i = i + data11[index].gift_chence
                            table.addItem({
                                'name':data11[index].gift_name,
                                'data': {'token': data11[index].gift_code},
                                'weight': data11[index].gift_chence + awaqe
                            })
                        }
                        const dsadsasa = (100 - i - draw) <0 ? 0 : (100 - i- draw) / poiuytr
                        for(let i = 0; i < poiuytr; i++){
                            table.addItem({'name':'空氣QQ<:peepoHugMilk:994650902050906234>別氣餒，下一次定是你!!' + `||${i}||`,'weight': dsadsasa});
                        }
                            }
                            const aaaa = []
                            const testsetse = []
                            for(let i = 0; i < poiuytr; i++) {  
                                const result = table.drop();
                                table.removeItem(result.name);
                                if(result.data && result.data.token !== null){
                                    let aaaaaaaaa = {name: '<:id:985950321975128094> **獎品名:**' + `${result.name}`, value:`<:security:997374179257102396> **獎品代碼:**${result.data.token}`, inline: true}
                                    const name = result.name
                                    if(!name.includes('空氣QQ') && !name.includes('別氣餒，下一次定是你!!')){
                                        gift_change.findOne({
                                            guild: interaction.guild.id,
                                        }, async (err, data) => {
                                            const channel = interaction.guild.channels.cache.get(data.channel)
                                            if(!channel) return
                                            channel.send({
                                                embeds: [
                                                    new MessageEmbed()
                                                    .setTitle("<:celebration:997374188060946495> **有人中獎了!**")
                                                    .setDescription(`<:id:985950321975128094> **中獎人:** <@${interaction.user.id}>\n` + "<a:gift:954018543211532289> **中獎禮物:**" + `\`\`\`${name}\`\`\``)
                                                    .setColor("RANDOM")
                                                ]
                                            })
                                        })
                                    }
                                    testsetse.push(aaaaaaaaa)
                                }
                                aaaa.push(result.name)
                            } 
                            const msgg = await interaction.followUp({content: "https://cdn.discordapp.com/attachments/991337796960784424/997105505640136794/giphy.gif"})
                            data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin - (!data11111 ? 500*poiuytr : data11111.coin_number*poiuytr)}})
                            setTimeout(() => {
                                msgg.edit({content: null, embeds:[new MessageEmbed()
                            .setTitle("<:gashapon:997374176526610472> 扭蛋系統")
                            .setDescription(`<:fireworks:997374182016958494><:fireworks:997374182016958494>你扭中了:\n${aaaa.join('\n')}`)
                            .setColor("RANDOM")
                            .setFooter("如扭中的獎品有獎品代碼，將會私訊給您!", interaction.member.displayAvatarURL({
                                dynamic: true
                            }))
                            ]})
                            if(testsetse.length === 0){
                                for(let i = 0; i < aaaa.length; i++){
                                    gift.findOne({
                                        guild: interaction.guild.id,
                                        gift_name: aaaa[i]
                                    }, async (err, data1111111) => {
                                        if(!data1111111) return
                                        data1111111.delete()
                                    })
                                }
                                return
                            }
                            interaction.member.send({
                                embeds:[
                                    {type: 'rich',
                                    title: `<:fireworks:997374182016958494> 恭喜你中獎!!`,
                                    color: 'RANDOM',
                                    fields: testsetse
                                }
                                ]
                            })
                            for(let i = 0; i < aaaa.length; i++){
                                gift.findOne({
                                    guild: interaction.guild.id,
                                    gift_name: aaaa[i]
                                }, async (err, data1111111) => {
                                    if(!data1111111) return
                                    data1111111.delete()
                                })
                            }
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