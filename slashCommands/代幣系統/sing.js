const coin = require("../../models/coin.js");
const gift_change = require("../../models/gift_change.js");
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
const {
    errorMonitor
} = require("ws");
module.exports = {
    name: '簽到',
    cooldown: 20,
    description: '簽到來獲得代幣',
    video: 'https://mhcat.xyz/docs/snig',
    emoji: `<:sign:997374180632825896>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id
            }, async (err, data) => {
                gift_change.findOne({
                    guild: interaction.guild.id,
                }, async (err, data1111) => {
                    if (!data) {
                        data = new coin({
                            guild: interaction.guild.id,
                            member: interaction.member.id,
                            coin: data1111 ? data1111.sign_coin : 25,
                            today: Math.round(Date.now() / 1000)
                        })
                        data.save()
                    } else {
                        if ((Math.round(Date.now() / 1000) - data.today) < (data1111 ? data1111.time ? data1111.time : 86400 : 86400)) return errors(`你今天已經簽到過了!請於<t:${data.today + (data1111 ? data1111.time ? data1111.time : 86400 : 86400)}:f>後再來簽到!`)
                        if (data.coin + Number((data1111 ? data1111.sign_coin : 25)) > 999999999) return errors("不可以加超過`999999999`!!")
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                today: Math.round(Date.now() / 1000)
                            }
                        })
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                coin: data.coin + (data1111 ? data1111.sign_coin : 25)
                            }
                        })
                    }
                    const good = new EmbedBuilder()
                        .setTitle("<:calendar:990254384812290048>你成功簽到了!")
                        .setDescription("<:Cat_ThumbsUp:988665659850362920> 今天有準時簽到很棒喔!\n明天也要記得來簽到.w.")
                        .setColor('Random')
                    interaction.editReply({
                        embeds: [good]
                    })
                })
            })
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}