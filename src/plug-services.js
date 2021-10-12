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

const publisher = new cote.Publisher({ name: 'plug-publisher' })

exports.plugUsage = async params => {
  try {
    const plug = await client.getDevice({ host: params.address })

    // publisher = new cote.Publisher({ name: params.name + '-plug-usage' }),
    let now = new Date()
    let month = now.getMonth() + 1 // returns 0-11, must add one to be consistent
    let year = now.getFullYear()
    let channel = params.name + '-usage'
    let stats = await plug.emeter.getDayStats(year, month)

    if (params.debug) console.log(stats)
    publisher.publish(channel, stats)
  } catch (error) {
    console.error(error)
  }


}

exports.plugEmeter = async params => {
  try {
    const plug = await client.getDevice({ host: params.address })
    // publisher = new cote.Publisher({ name: params.name + '-plug-emeter' }),
    const channel = params.name + '-emeter-reading'

    plug.stopPolling() // cleanup previous polling
    plug.startPolling(params.interval)
    if (params.debug) console.log('Polling is started on plug :' + params.name)

    plug.on('emeter-realtime-update', emeterReading => {
      emeterReading.time = Date.now()
      if (params.debug) console.log(emeterReading)
      publisher.publish(channel, emeterReading)
    })
  } catch (error) {
    console.error(error)
  }


}

exports.plugInfo = async params => {
  try {
    const plug = await client.getDevice({ host: params.address })
    // publisher = new cote.Publisher({ name: params.name + '-plug-info' }),
    const channel = {
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
    plug.on('in-use-update', inUse => { publisher.publish(channel.usage, inUse) })
    client.on('plug-online', plug => { publisher.publish(channel.status, plug + ': Online') })
    client.on('plug-offline', plug => { publisher.publish(channel.status, plug + ': Offline') })
  } catch (error) {
    console.error(error)
  }

}