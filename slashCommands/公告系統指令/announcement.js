const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const guild = require('../../models/guild.js');
const { PermissionFlagsBits } = require('discord-api-types/v9');
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
    Permissions,
 } = require('discord.js');
 function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
module.exports = {
    //name: '公告發送',
    //description: '發送公告訊息',
    //video: 'https://mhcat.xyz/docs/ann',
    //UserPerms: '訊息管理',
    //emoji: `<:megaphone:985943890148327454>`,
    run: async (client, interaction, options, perms) => {
        try {

        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const modal = new Modal()
        .setCustomId("nal")
        .setTitle('公告系統!');
        const tag = new TextInputComponent()
        .setCustomId("anntag")
        .setLabel("請輸入你要tag誰")
        .setRequired(true)
        .setStyle('SHORT');
        const color = new TextInputComponent()
        .setCustomId('anncolor')
        .setLabel("請輸入你的公告要甚麼顏色")
        .setRequired(true)
        .setStyle('SHORT');
        const title = new TextInputComponent()
        .setCustomId('anntitle')
        .setLabel("請輸入你的公告標題")
        .setRequired(true)
        .setStyle('SHORT');
        const content = new TextInputComponent()
        .setCustomId('anncontent')
        .setLabel("請輸入公告內文")
        .setRequired(true)
        .setStyle('PARAGRAPH');
        const firstActionRow = new MessageActionRow().addComponents(tag);
        const color1 = new MessageActionRow().addComponents(color);
        const title1 = new MessageActionRow().addComponents(title);
        const content1 = new MessageActionRow().addComponents(content);
        modal.addComponents(firstActionRow,color1,title1,content1);
        await interaction.showModal(modal);
        const filter = (interaction111, user) => {
            return  user.id === interaction.user.id;
        };x 
        const collector = interaction.channel.createMessageComponentCollector({time: 10*60*1000 });
        collector.on('collect', async (interaction) => {
            var validateColor = require("validate-color").default;
            const tag = interaction.fields.getTextInputValue('anntag');
            const color = interaction.fields.getTextInputValue('anncolor');
            const title = interaction.fields.getTextInputValue('anntitle');
            const content = interaction.fields.getTextInputValue('anncontent');
            if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
            
            const announcement = new MessageEmbed()
                .setTitle(title)
                .setDescription("" + content + "")
                .setColor(color)
                .setFooter(
                    `來自${interaction.user.tag}的公告`,
                    interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                );
            const ramdom_number = `${getRandomArbitrary(0, 10000)}`
            const yesno = new MessageEmbed()
                .setTitle("是否將此訊息送往公告?(請於20秒內點擊:P)")
                .setColor("#00ff19")
            const yes = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("announcement_yes" + ramdom_number)
                    .setEmoji("✅")
                    .setLabel('是')
                    .setStyle('PRIMARY'),
                    new MessageButton()
                    .setCustomId('announcement_no' + ramdom_number)
                    .setLabel('否')
                    .setEmoji("❎")
                    .setStyle('DANGER'),
                );
            // 發送訊息
            try {
                interaction.reply({
                    content: tag,
                    embeds: [announcement]
                })
                setTimeout(() => {
                interaction.channel.send({
                    embeds: [yesno],
                    components: [yes]
                }).then( msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 20*1000);
                })
            }, 1000)
            } catch (error) {
                // 如果有錯誤
                console.log(error)
                const error_embed = new MessageEmbed()
                    .setTitle("錯誤 | error")
                    .setDescription("很抱歉出現了錯誤!\n" + `\`\`\`${error}\`\`\`` + "\n如果可以再麻煩您回報給`夜貓#5042`")
                    .setColor("RED")
                interaction.reply({
                    embeds: [error_embed]
                })
            }
            const filter111 = (interaction111, user) => {
                return user.id === interaction.user.id && interaction111.customId.includes(ramdom_number);
            };
            const collector = interaction.message.createMessageComponentCollector({
                filter111,
                time: 20*1000,
                max: 1,
            })
            collector.on('collect', async (ButtonInteraction) => {
                const id = ButtonInteraction.customId;
                if (id.includes(`announcement_yes`)) {
                    guild.findOne({
                        guild: interaction.channel.guild.id,
                    }, async (err, data) => {
                        if (!data || data.announcement_id === "0") {
                            ButtonInteraction.reply("很抱歉!\n你還沒有對您的公告頻道進行選擇!\n命令:`/公告頻道設置 [公告頻道]`\n有問題歡迎打`/help`")
                            return
                        } else {
                            const channel111 = client.channels.cache.get(data.announcement_id)
                            const hasPermissionInChannel = channel111
                                .permissionsFor(interaction.guild.me)
                                .has('SEND_MESSAGES', false)
                            const hasPermissionInChannel1 = channel111
                                .permissionsFor(interaction.guild.me)
                                .has('VIEW_CHANNEL', false)
                            if (!hasPermissionInChannel || !hasPermissionInChannel1) {
                                return errors("我沒有權限在" + channel111.name + "發送消息!")
                            }
                            channel111.send({
                                content: tag,
                                embeds: [announcement]
                            })
                            ButtonInteraction.reply("成功發送")
                        }
                    })
                }
                if (id.includes('announcement_no')) {
                    ButtonInteraction.reply("已取消")
                    return
                }
            })
            collector.on('end', collected => {
                collected.channel.send({embeds:[new MessageEmbed()
                .setTitle(`${client.emoji.error} | 過久沒回覆，已取消此次發送!`)
                .setColor(client.color.error)
            ]})
            });
        })
    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}