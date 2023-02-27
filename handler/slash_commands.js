const client = require('../index');
const fs = require('fs');
const {
    readdirSync
} = fs;
const {
    token
} = require('../config.json')
const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');
const rest = new REST({
    version: '9'
}).setToken(`${token}`);
client.once('ready', () => {
    setTimeout(() => {

        readdirSync('./slashCommands').forEach(async (dir) => {
            const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                file.endsWith(".js")
            )

            commands.map(async cmd => {
                let file = require(`../slashCommands/${dir}/${cmd}`);

                let name = file.name || "No command name.";
                let description = file.description || "No Description";
                let options = file.options || [];
                let DefaultMemberPermissions = file.DefaultMemberPermissions || [];
                const data = {
                    name,
                    description,
                    options,
                    DefaultMemberPermissions,
                }

                let option = name == "No command name." ? '❌斜線命令加載' : '✅ 斜線命令加載';
                if (option == '✅ 斜線命令加載') {
                    setTimeout(async () => {
                        client.slash_commands.set(name, {
                            ...data,
                            cooldown: file.cooldown,
                            emoji: file.emoji,
                            UserPerms: file.UserPerms,
                            run: file.run,
                            video: file.video,
                            docs: file.docs
                        });
                        await client.application.commands.create(data);
                        /*setTimeout(() => {
                            rest.get(Routes.applicationCommands(client.user.id))
                            .then(data => {
                                for (const command of data) {
                                    client.application.commands.fetch(`${command.id}`)
                                    .then( (command) => {
                                    if(!client.slash_commands.get(command.name)) command.delete().then(command => {console.log('delete' + command.name)})
                                    }).catch(console.error);
                            }
                        });
                        }, 60 * 5 * 1000);*/
                    }, 500);
                }
                
            })
        })
    }, 500);
})