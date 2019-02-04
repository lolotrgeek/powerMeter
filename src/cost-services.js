'use strict'
const cote = require('cote'),
    utils = require('./utils')

const defaults = {
    plug: 'computer',
    cost: { winter: .0876, summer: 0.1258 }, // cost/kwh
    month: { summer: 6, winter: 10, }, // starting month for season
    channels: ['computer-emeter-reading'],
    debug: true
}

exports.costService = (params) => {
    if (!params) params = defaults
    const subscriber = new cote.Subscriber({ name: params.plug + '-plug-subscriber' })
    const publisher = new cote.Publisher({ name: params.plug + '-plug-cost' })
    params.channels.map((channel) => subscriber.on(channel, (reading) => {
        reading.total_cost = utils.calcCosts(reading, utils.getCost(new Date().getMonth() + 1, params))
        if (params.debug) console.log(reading)
        publisher.publish(reading)
    }))
}
