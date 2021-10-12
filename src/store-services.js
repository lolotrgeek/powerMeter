'use strict'
const cote = require('cote'),
    levelup = require('levelup'),
    leveldown = require('leveldown')

const defaults = {
    db: 'computer-plug',
    channels: ['computer-usage', 'computer-emeter-reading'],
    keyEncoding: 'utf8',
    valueEncoding: 'json'
}

exports.levelStore = params => {
    if (!params) params = defaults
    const options = { keyEncoding: params.keyEncoding, valueEncoding: params.valueEncoding }
    const db = levelup(leveldown('./db/' + params.db), options)
    const subscriber = new cote.Subscriber({ name: params.db + '-store', subscribesTo: params.channels})
    params.channels.map(channel => {
        if (params.debug) console.log('Adding Store Listener for:' + channel)
        subscriber.on(channel, data => {
            if (params.debug) console.log(channel, data)
            db.put(Date.now(), JSON.stringify(data))
        })
    })
}