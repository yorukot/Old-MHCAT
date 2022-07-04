const {
    MessageEmbed,
} = require('discord.js');
const client = require('../index');
const lotter = require('../models/lotter.js')
const moment = require('moment');
function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
setInterval(() => {
    lotter.find({
        date: moment().utcOffset("+08:00").format('YYYYMMDDHH'),
    }, async (err, data) => {
     for(x = data.length-1; x > -1; x--) { 
        if(data[x].end === false) {
            const winner_array = []
            for(y = data[x].howmanywinner -1 ; y > -1; y--){
              const winner = data[x].member[getRandomArbitrary(0, data[x].member.length)]
                if(winner === undefined){
                    y--
                }else{
                    winner_array.push(winner.id)
                }
            }
            const guild = client.guilds.cache.get(data[x].guild);
            if(!guild) data[x].delete();
            let channel = guild.channels.cache.get(data[x].message_channel);
            if(!channel) data[x].delete();
            const winner_embed = new MessageEmbed()
            .setTitle("🎊恭喜中獎者!")
            .setDescription(`
            **🎉🎉恭喜:
            <@${winner_array.join('>\n<@')}>
            抽中: ${data[x].gift}
            **`)
            .setColor(channel.guild.me.displayHexColor)
            channel.send({content: `||<@${winner_array.join('><@')}>||`, embeds: [winner_embed]})
            data[x].collection.update(({guild: data[x].guild, id: data[x].id}), {$set: {end: true}})
            data[x].save()
         }else{
             return
         }
     }
    })
}, 600000);