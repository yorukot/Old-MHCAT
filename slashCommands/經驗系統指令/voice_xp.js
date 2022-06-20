const voice_xp = require("../../models/voice_xp.js");
const canvacord = require("canvacord")
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment
 } = require('discord.js');
module.exports = {
    name: '語音經驗',
    description: '查詢語音經驗',
    options: [{
        name: '玩家',
        type: 'USER',
        description: '輸入玩家!',
        required: false
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:level1:985947371957547088>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        const get_member = interaction.options.getUser("玩家")
        const member = get_member ? get_member : interaction.user
        voice_xp.findOne({
            guild: interaction.guild.id,
            member: member.id,
        }, async (err, data) => {
            if (err) throw err;
            if(!data){
                errors("這位使用者還沒有任何的經驗值喔!")
            }else{
                voice_xp.find({
                    guild: interaction.guild.id,
                }, async (err, data1) => {
                    const array = []
                    for ( x = data1.length-1; x > -1; x-- ) {
                        let b = 0
                        for ( y = data1[x].leavel - 1 ; y > 0; y-- ) {
                            b = b + Number(y) * 100;
                        }
                        array.push(b + 100 + Number(data1[x].xp));
                    }
                    const findGreater = (arr, num) => {
                        const res = [];
                        for(let i = 0; i < arr.length; i++){
                           if(arr[i] < num){
                              continue;
                           };
                           res.push(arr[i]);
                        };
                        return res;
                     };
                     let m = 0
                     for ( y = data.leavel - 1 ; y > 0; y-- ) {
                        m = m + Number(y) * 100;
                    }
                    let result = findGreater(array,(m + 100 + Number(data.xp)))
                    const rank = new canvacord.Rank()
                    .setAvatar(member.displayAvatarURL({ format: "png" }))
                    .setCurrentXP(Number(data.xp))
                    .setRequiredXP(Number(data.leavel) * 100 +100)
                    .setLevel(Number(data.leavel))
                    .setRank(result.length)
                    .setProgressBar("#FFFFFF", "COLOR")
                    .setUsername(member.username)
                    .setDiscriminator(member.discriminator);
                    rank.build()
                    .then(data => {
                        const attachment = new MessageAttachment(data, "RankCard.png");
                        interaction.reply({
                            files: [attachment]
                        });
                    });
                })
            }
        })
    }
}