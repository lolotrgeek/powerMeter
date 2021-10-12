exports.checkParams = (params) => {
  if (!params) params = {}
  if (params.address !== typeof String) return "Address must be string"
  if (params.cost !== typeof Object) return "Cost must be Object of Integers"
  if (!params.month) params.month = defaults.month
  if (!params.debug) params.debug = defaults.debug
  if (params.debug) console.log(params)
  return params
}


exports.getCost = (month, params) => {
  if (month >= params.month.summer && month < params.month.winter) {
    if (params.debug) console.log('summer ' + params.cost.summer)
    return params.cost.summer
  } else {
    if (params.debug) console.log('winter ' + params.cost.winter)
    return params.cost.winter
  }
}

exports.calcCosts = (reading, costperwh) => {
  return reading.total_wh / 1000 * costperwh
}

exports.parse = object => {
  try {
    return JSON.parse(object)
  } catch (error) {
    return object
  }
}