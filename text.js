const optimizelySDK = require('@optimizely/optimizely-sdk')
const optimizelyManager = require('@optimizely/optimizely-manager')(optimizelySDK)
var client = optimizelySDK.createClient({
  name: 'backend-client'
  sdkKey: 'mysdkkey'
})

const client = optimizelySDK.getClient('backend-client')

const client = optimizelyManager.getClient()
// const client = optimizelySDK.getClient()

// in another file
const optimizelySDK = require('@optimizely/optimizely-sdk')
optimizelySDK.getClient()
