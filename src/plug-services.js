'use strict'
const { Client } = require('tplink-smarthome-api')
const client = new Client()
const cote = require('cote')

// const defaults = {
//   name: 'computer',
//   address: '192.168.1.164',
//   interval: 1000,
//   debug: true
// }

const publisher = new cote.Publisher({name: 'plug-publisher'})

exports.usageService = async (params) => {
  const plug = client.getPlug({ host: params.address }),
    // publisher = new cote.Publisher({ name: params.name + '-plug-usage' }),
    now = new Date(),
    month = now.getMonth() + 1, // returns 0-11, must add one to be consistent
    year = now.getFullYear(),
    channel = params.name + '-usage',
    stats = await plug.emeter.getDayStats(year, month)
    
  if (params.debug) console.log(stats)
  publisher.publish(channel.stats, stats)

}

exports.emeterService = (params) => {
  const plug = client.getPlug({ host: params.address }),
    // publisher = new cote.Publisher({ name: params.name + '-plug-emeter' }),
    channel = params.name + '-emeter-reading'

  plug.stopPolling() // cleanup previous polling
  plug.startPolling(params.interval)
  if (params.debug) console.log('Polling is started on plug :' + params.name)

  plug.on('emeter-realtime-update', (emeterReading) => {
    emeterReading.time = Date.now()
    if (params.debug) console.log(emeterReading)
    publisher.publish(channel.emeter, emeterReading)
  })

}

exports.infoService = (params) => {
  const plug = client.getPlug({ host: params.address }),
    // publisher = new cote.Publisher({ name: params.name + '-plug-info' }),
    channel = {
      power: params.name + '-plug-power',
      usage: params.name + '-plug-usage',
      status: params.name + '-plug-status'
    }
  plug.stopPolling() // cleanup previous polling
  plug.startPolling(params.interval)
  if (params.debug) console.log('Polling is started on plug :' + params.name)

  plug.on('power-on', () => { publisher.publish(channel.power, 'On') })
  plug.on('power-off', () => { publisher.publish(channel.power, 'Off') })
  plug.on('in-use', () => { publisher.publish(channel.usage, 'In Use') })
  plug.on('not-in-use', () => { publisher.publish(channel.usage, 'Not in Use') })
  plug.on('in-use-update', (inUse) => { publisher.publish(channel.usage, inUse) })
  client.on('plug-online', (plug) => { publisher.publish(channel.status, plug + ': Online') })
  client.on('plug-offline', (plug) => { publisher.publish(channel.status, plug + ': Offline') })
}