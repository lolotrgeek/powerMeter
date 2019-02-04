'use strict'
const cote = require('cote')
const utils = require('./utils')

const defaults = {
    plug: 'computer',
    cost: { winter: .0876, summer: 0.1258 },
    month: { summer: 6, winter: 10, }, // starting month
    debug: true
}

const params = defaults

const channel = {
    power: params.plug + '-plug-power',
    usage: params.plug + '-plug-usage',
    status: params.plug + '-plug-status',
    emeter: params.plug + '-emeter-reading',
    stats: params.plug + '-stats'
}


calcCosts = (reading, params) => {
    return reading.total_wh / 1000 * utils.getCost(new Date().getMonth() + 1, params)
}

const subscriber = new cote.Subscriber({ name: params.plug + '-plug-subscriber' })

exports.plugCosts = () => {
    subscriber.on(channel.emeter, (reading) => {
        console.log(reading)
        
        console.log('total cost : ', total_cost)
    })
}
subscriber.on(channel.stats, (update) => console.log('Stats: ', update))
subscriber.on(channel.power, (update) => console.log('Power: ' + update))
subscriber.on(channel.usage, (update) => console.log('Usage: ' + update))
subscriber.on(channel.status, (update) => console.log('Status: ' + update))