const service = require('./src/plug-services')
const store = require('./src/store-services')
const cost = require('./src/cost-services')
const params = require('./params.json')

cost.dailyCost(params.cost)
// service.pluginfo(plugs)
// service.plugEmeter(params)
service.plugUsage(params.plug)

// store.storeService()