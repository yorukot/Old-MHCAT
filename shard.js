const Cluster = require('discord-hybrid-sharding');
const config = require('./config');
const chalk = require("chalk");

const manager = new Cluster.Manager(`${__dirname}/index.js`, {
    totalShards: 'auto',
    shardsPerClusters: 1,
    mode: 'process',
    token: config.token,
    totalClusters: 3
});

manager.extend(
    new Cluster.HeartbeatManager({
        interval: 300,
        maxMissedHeartbeats: 2,
    })
)

manager.on('clusterCreate', cluster => {
    console.log(chalk.hex('#FFFF37').bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.hex('#FFFF37').bold(`┃            分片${cluster.id}已被啟動             ┃`))
    console.log(chalk.hex('#FFFF37').bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'))
});

manager.spawn({
    timeout: -1
});