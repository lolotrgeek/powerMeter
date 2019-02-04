'use strict'
const cote = require('cote'),
    utils = require('./utils'),
    levelup = require('levelup'),
    leveldown = require('leveldown')

const defaults = {
    plug: 'computer',
    db: 'computer-plug',
    cost: { winter: .0876, summer: 0.1258 },
    month: { summer: 6, winter: 10, }, // starting month
    debug: true
}
const params = defaults
const channel = {
    emeter: params.plug + '-emeter-reading',
}
// const now = new Date()
// const today =  now.getDay() + now.getMonth() + now.getFullYear()

const db = levelup(leveldown('./db/'+params.db))
const subscriber = new cote.Subscriber({ name: params.plug + '-plug-subscriber' })

exports.plugCosts = () => {
    subscriber.on(channel.emeter, (reading) => {
        reading.total_cost = utils.calcCosts( reading, utils.getCost(new Date().getMonth() + 1, params))
        console.log(reading)
        db.put(Date.now(), reading)
    })
}
