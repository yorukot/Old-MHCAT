const voice_xp = require("../../models/voice_xp.js");
const canvacord = require("canvacord")
const voice_xp_channel = require('../../models/voice_xp_channel.js');
var validateColor = require("validate-color").default;
function checkURL(image) {
   return(image.match(/\.(jpg|png)$/) != null);
}
const {
    ApplicationCommandType,
    ButtonStyle,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Collector,
    Discord,
    AttachmentBuilder,
    ModalBuilder,
    TextInputBuilder,
    PermissionsBitField
} = require('discord.js');
module.exports = {
    name: '語音經驗',
    cooldown: 10,
    description: '查詢語音經驗',
    options: [{
        name: '玩家',
        type: ApplicationCommandOptionType.User,
        description: '輸入玩家!',
        required: false
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:level1:985947371957547088>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
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
                voice_xp_channel.findOne({
                    guild: interaction.guild.id,
                }, async (err, data12) => {
                    voice_xp.find({
                        guild: interaction.guild.id,
                    }, async (err, data1) => {
                        const array = []
                        for ( x = data1.length-1; x > -1; x-- ) {
                            let b = 0
                            for (y = data1[x].leavel - 1; y > -1; y--) {
                                b = b + parseInt(Number(y) * (Number(y) / 2)) * 100 + 100
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
                        for ( y = data.leavel - 1 ; y > -1; y-- ) {
                            m = m + parseInt(Number(y) * (Number(y) / 2)) * 100 + 100
                        }
                        let result = findGreater(array,(m + 100 + Number(data.xp)))
                        const rank = new canvacord.Rank()
                        .setAvatar(member.displayAvatarURL({ extension : 'png' }))
                        .setBackground(!data12 ? "COLOR" : data12.background ? validateColor(data12.background) ? "COLOR" : "IMAGE" : "COLOR"
                        ,!data12 ? "#23272A" : data12.background ? data12.background : "#23272A")
                        .setCurrentXP(Number(data.xp))
                        .setRankColor(!data12 ? "#FFFFFF" : !data12.color ? "#FFFFFF" : data12.color)
                        .setRequiredXP(parseInt(Number(data.leavel) * (Number(data.leavel)/2) * 100 + 100))
                        .setLevel(Number(data.leavel))
                        .setRank(result.length)
                        .setStatus(interaction.member.presence ? interaction.member.presence.status : "offline")
                        .setLevelColor(!data12 ? "#FFFFFF" : !data12.color ? "#FFFFFF" : data12.color)
                        .setProgressBar(!data12 ? "#FFFFFF" : !data12.color ? "#FFFFFF" : data12.color, "COLOR")
                        .setUsername(member.username)
                        .setDiscriminator(member.discriminator);
                        rank.build()
                        .then(data => {
                            const attachment = new AttachmentBuilder(data, {name: "RankCard.png"});
                            interaction.editReply({
                                files: [attachment]
                            });
                        });
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