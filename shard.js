const Cluster = require('discord-hybrid-sharding');
const config = require('./config');
const { blue, red, green, magenta, cyan } = require("chalk");

const manager = new Cluster.Manager(`${__dirname}/index.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: config.token,
});

manager.on('clusterCreate', cluster => console.log(green(`[分片${cluster.id}]已被啟動`)));
manager.spawn({ timeout: -1 });