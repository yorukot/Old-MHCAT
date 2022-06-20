const fs = require('fs');

const {
    commands
} = require('../index');
const {
    readdirSync
} = fs;
const client = require('../index');
const { UserPerms } = require('../slashCommands/經驗系統指令/text_set');

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

            let option = name == "No command name." ? '❌' : '✅';

            console.log(`|成功加載斜線命令 ${option} |${name}!|`);

            if (option == '✅') {
                setTimeout(async () => {
                    client.slash_commands.set(name, {
                        ...data,
                        emoji:file.emoji,
                        UserPerms: file.UserPerms,
                        run: file.run,
                        video: file.video,
                    });
                    await client.application.commands.create(data);

                }, 4000);
            
            }
        })        
})