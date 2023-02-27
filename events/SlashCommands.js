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
        if (!cooldown.has(cmd.name)) {
            cooldown.set(cmd.name, new Collection());
        }
        const current_time = Date.now()
        const time_stamps = cooldown.get(cmd.name)
        const cooldown_amount = (cmd.cooldown) * 1000
        if (time_stamps.has(interaction.user.id)) {
            const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount
            if (current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000
                return interaction.reply({
                    content: `<:stopwatch:1000703201479233546> | **你發送指令的速度太快了!請等待**\`${time_left.toFixed(1)}\`**秒後重試!!**`,
                    ephemeral: true
                })
            }
        }
        time_stamps.set(interaction.user.id, current_time)

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