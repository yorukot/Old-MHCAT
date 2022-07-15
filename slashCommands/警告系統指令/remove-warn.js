const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../models/warndb')
const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const voice_channel = require('../../models/voice_channel.js')
const moment = require('moment')
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    Collector,
    Discord,
    MessageAttachment,
    Modal,
    TextInputComponent,
    Permissions
 } = require('discord.js');
 function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
const { errorMonitor } = require("ws");
module.exports = {
    name: '警告清除',
    description: '清除一個使用者的某個警告',
    options: [{
        name: '使用者',
        type: 'USER',
        description: '要清除資料的使用者!',
        required: true
    },
    {
        name: '第幾項',
        type: 'INTEGER',
        description: '要清除第幾個警告!',
        required: true
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:delete1:986068526387314690>`,
    run: async (client, interaction, options, perms) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel1 = interaction.options.getInteger("頻道")
        const user = interaction.options.getUser("使用者")
        db.findOne({
            guild: interaction.guild.id, 
            user: user.id
        }, async (err, data) => {
            if (err) throw err;
            if (data) {
                let number = parseInt(channel1) - 1
                data.content.splice(number, 1)
                const embed = new MessageEmbed()
                    .setTitle("<a:greentick:980496858445135893> | 這位使用者的警告成功移除!")
                    .setColor("GREEN")
                    interaction.reply({embeds:[embed]})
                const b = new MessageEmbed()
                .setColor("#00DB00")
                .setTitle("__**警告系統**__")
                .setDescription(`:white_check_mark: 你的一個警告被清除了!`)
                user.send({embeds: [b] })
                data.save()
            } else {
                errors("這位使用者沒有任何警告!")
            }
        }) // Since the video is becoming very long i will copy paste the code since i have already made it before the video.. the code will be in the description


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}