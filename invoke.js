const plug = require('./src/plug-services')
const store = require('./src/plug-meter-store')
const params = require('./service-defaults.json')


// plug.infoService(defaults)
plug.emeterService(params)
// plug.usageService(defaults)

store.plugCosts()