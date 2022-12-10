const client = require('../index');
const system = require('../models/system.js')
const os = require("os");
const osaa = require("os-utils");
if (client.cluster.id === 0) {
    setTimeout(() => {
        setInterval(() => {
            system.findOne({
                a: 'dsa'
            }, async (err, data) => {
                if (!data) {
                    data = new system({
                        a: 'dsa',
                        ram: [],
                        cpu: []
                    })
                    data.save()
                } else {
                    osaa.cpuUsage(function (v) {
                        if (data.ram.length > 1440) {
                            console.log(data.ram)
                            data.ram.pop()
                            console.log(data.ram)
                            data.ram.push(Math.round(Math.round((((os.totalmem() - os.freemem())) / (os.totalmem())) * 100)))
                            data.cpu.pop()
                            data.cpu.push(Math.round(v * 100))
                            data.collection.updateOne(({
                                a: 'dsa',
                            }), {
                                $set: {
                                    ram: data.ram,
                                    cpu: data.cpu
                                }
                            })
                        } else {
                            data.ram.push(Math.round(Math.round((((os.totalmem() - os.freemem())) / (os.totalmem())) * 100)))
                            data.cpu.push(Math.round(v * 100))
                            data.collection.updateOne(({
                                a: 'dsa',
                            }), {
                                $set: {
                                    ram: data.ram,
                                    cpu: data.cpu
                                }
                            })
                        }
                    })
                }
            })
        }, 240 * 1000);
    }, 3000);
}