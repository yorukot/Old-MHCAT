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
module.exports = {
    name: '剪刀石頭布',
    description: '跟電腦剪刀時候布來獲得代幣(有賺有賠)',
    options: [{
        name: '使用多少代幣來進行',
        type: 'INTEGER',
        description: '要用多少代幣進行賭注(贏的話會多這些，輸的話這些代幣會全被拿走，平手會被扣這些的一半)',
        required: true,
    },{
        name: '剪刀石頭或布',
        type: 'STRING',
        description: '選擇要剪刀石頭還是布',
        required: true,
        choices:[
            { name: '剪刀', value: '剪刀' },
            { name: '石頭', value: '石頭' },
            { name: '布', value: '布' },
        ],
    }],     
    video: 'https://mhcat.xyz/docs/required_coins',
    emoji: `<:coins:997374177944281190>`,
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        const number = interaction.options.getInteger("使用多少代幣來進行")
        const aaaaa = interaction.options.getString("剪刀石頭或布")
        if(number > 999999999) return errors("最高代幣設定數只能是999999999")
        if(number <= 0) return errors("至少要大於1!!")
        coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id,
            }, async (err, data) => {
                if(!data){
                    return errors("你沒有足夠的代幣進行此次遊玩!")
                }else{
                    if(data.coin - number < 0)return errors("你沒有足夠的代幣進行此次遊玩")
                    function getRandom(min,max){
                        return Math.floor(Math.random()*(max-min+1))+min;
                    };
                    const vaule = ["剪刀","石頭","布"]
                    const emoji = ["✂️", "🪨", "🖐"]
                    const random = getRandom(0,2)
                    function adddd(add, dsadsa) {
                    const good = new MessageEmbed()
                    .setTitle(`<a:girl:983775481100914788> __**剪刀石頭布!**__`)
                    .setDescription(`**你出了:**\`${aaaaa==="石頭" ? "🪨":aaaaa==="剪刀" ? "✂️" : "🖐"}${aaaaa}\`\n**我出了:**\`${emoji[random]}${vaule[random]}\`\n**${dsadsa}:**\`${add}\`個扭蛋代幣`)
                    .setFooter("剪刀石頭布! | MHCAT", interaction.member.displayAvatarURL({
                        dynamic: true
                    }))
                    .setColor('RANDOM')
                    interaction.reply({embeds: [good]})
                    }
                    if(vaule[random] === aaaaa){
                        data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin - parseInt(number/2)}})
                        adddd(parseInt(number/2), "你失去了")
                    }else if(((aaaaa === "剪刀")&&(vaule[random] === "石頭")) || ((aaaaa === "石頭")&&(vaule[random] === "布")) || ((aaaaa === "布")&&(vaule[random] === "剪刀"))){
                        data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin - number}})
                        adddd(parseInt(number), "你失去了")
                    }else if(((aaaaa === "剪刀")&&(vaule[random] === "布")) || ((aaaaa === "石頭")&&(vaule[random] === "剪刀")) || ((aaaaa === "布")&&(vaule[random] === "石頭"))){
                        data.collection.update(({guild: interaction.channel.guild.id, member: interaction.member.id}), {$set: {coin: data.coin + number}})
                        adddd(parseInt(number), "你獲得了")

                    }
                    
                }
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}