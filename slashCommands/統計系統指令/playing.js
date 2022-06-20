const playing = require("../../models/playing.js");
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
    name: '遊玩時數查詢',
    description: '查看你玩遊戲的狀態',
    options: [{
        name: '玩家',
        type: 'USER',
        description: '輸入玩家!',
        required: false
    }],
   // video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:24hours:985947970744758342>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        const get_member = interaction.options.getUser("玩家")
        const member = get_member ? get_member : interaction.user
        playing.findOne({
            guild: interaction.guild.id,
            member: member.id,
        }, async (err, data) => {
            if (err) throw err;
            if(!data){
                errors("這位使用者還沒有任何的遊玩時數喔!")
            }else{
                function format(secondss){
                    let seconds = secondss * 60
                    function pad(s){
                      return (s < 10 ? '0' : '') + s;
                    }
                    var hours = Math.floor(seconds / (60*60));
                    var minutes = Math.floor(seconds % (60*60) / 60);
                    return pad(hours) + '小時' + pad(minutes) + '分';
                }
                const e = data.game.map(
                    (w, i) => `\n\`\`\`遊戲名: ${w.game} \n遊玩時數:${format(w.minutes)}\`\`\``
                )
                console.log(e)
                const embed = new MessageEmbed()
                .setTitle("以下是 __" + member.username + "__ 的遊玩時數")
                .setDescription(e.join(' '))
                .setColor("RANDOM")
                interaction.reply({
                    embeds: [embed]
                })
            }
        })
    }
}