'use strict'
const levelup = require('levelup')
const leveldown = require('leveldown')

const checkdb = (dbname) => {
    const db = levelup(leveldown('./db/' + dbname))
    db.createReadStream()
        .on('data', function (data) {
            console.log(data.key.toString('utf8'), '=', JSON.parse(data.value))
        })
        .on('error', function (err) {
            console.log('Oh my!', err)
        })
        .on('close', function () {
            console.log('Stream closed')
        })
        .on('end', function () {
            console.log('Stream ended')
        })
}

checkdb('computer-plug')