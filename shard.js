const { ClusterManager, ReClusterManager,HeartbeatManager  } = require('discord-hybrid-sharding');
const config = require('./config');
const chalk = require("chalk");
const manager = new ClusterManager(`${__dirname}/index.js`, {
    totalShards: 'auto',
    shardsPerClusters: 8,
    mode: 'process',
    token: config.token,
    totalClusters: 'auto',
});
let optional = {
    totalShards: 'auto',
    shardsPerClusters: 8,
    mode: 'process',
    token: config.token,
    totalClusters: 'auto',
}
manager.extend(
    new ReClusterManager(),
    new HeartbeatManager({
        interval: 300,
        maxMissedHeartbeats: 3,
    })
)

manager.on('clusterCreate', cluster => {
    console.log(chalk.hex('#FFFF37').bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.hex('#FFFF37').bold(`┃             集群${cluster.id}正在啟動            ┃`))
    console.log(chalk.hex('#FFFF37').bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'))
    cluster.on('message', message => {
        console.log(message.raw.content);
        if(message.raw.content === "MHCAT restart now"){
            manager.recluster?.start({restartMode: 'rolling', optional})
        }
    });
});

manager.spawn({ timeout: -1 });

process.on("unhandledRejection", (reason, p) => {
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 未處理的拒絕:"));
    console.log((reason.stack ? reason.stack : reason))
    console.log(end_start("=== 未處理的拒絕 ==="));
});
process.on("uncaughtException", (err, origin) => {
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常"));
    console.log(err)
    console.log(origin)
    console.log(end_start("=== 未捕獲的異常 ===\n"));
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常監視器"));
    console.log(err)
    console.log(origin)
    console.log(end_start("=== 未捕獲的異常監視器 ===\n"));
});
process.on("beforeExit", (code) => {
    exec('pm2 restart all', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 退出前"));
    console.log(code)
    console.log(end_start("=== 退出前 ===\n"));
});
process.on("exit", (code) => {
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 退出"));
    console.log(code)
    console.log(end_start("=== 褪出 ===\n"));
});
process.on("multipleResolves", (type, promise, reason) => {
    /*console.log(end_start("\n[🚩 崩潰通知] 多個解決方案"));
    console.log(type)
    console.log(promise)
    console.log(reason)
    console.log(end_start("=== 多個解決方案 ===\n"));*/
});