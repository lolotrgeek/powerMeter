const plug = require('./src/plug-services')
const store = require('./src/plug-meter-store')
const params = require('./params.json')


// plug.infoService(plugs)
plug.emeterService(plugs)
// plug.usageService(plugs)

store.plugCosts()