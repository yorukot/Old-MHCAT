const client = require('../index');
const all_use_count = require("../models/all_use_count.js")
const cooldown = new Map();
const {
    InteractionType
} = require('discord.js')
const {
    Collection,
    EmbedBuilder
} = require('discord.js')
client.on('interactionCreate', async (interaction) => {
    all_use_count.findOne({
        slashcommand_name: interaction.commandName,
    }, async (err, data) => {
            if (!data) {
                data = new all_use_count({
                    slashcommand_name: interaction.commandName,
                    count: 1,
                })
                data.save()
            }else{
                data.collection.updateOne(({
                    slashcommand_name: interaction.commandName,
                }), {
                    $set: {
                        count: data.count + 1
                    }
                })
            }
    })
    if (interaction.type === InteractionType.ApplicationCommand) {
        let cmd = client.slash_commands.get(interaction.commandName);
        if (!cmd) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${client.emoji.error} | 很抱歉，這個指令已不再支援或進行改名!`)
                .setFooter({
                    text: `非常抱歉造成你的困擾，推薦使用/help進行查詢指令`,
                    iconURL: interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                })
                .setColor(`#A6FFA6`)
            ]
        });

        let options = interaction.options._hoistedOptions;
        const perms = cmd.UserPerms
        try {
            cmd.run(client, interaction, options, perms)
        } catch (error) {
            const error_send = require('../functions/error_send.js')
            error_send(error, interaction)
        }
    }
})