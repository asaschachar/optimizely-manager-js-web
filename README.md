# Deprecation Notice
This repo is going to be deprecated in favor of https://git@github.com/asaschachar/optimizely-manager-js, which does both JavaScript for node as well as browser environments.


# Optimizely Datafile Manager JavaScript Web
                                                                        
## Installation
```
npm install --save git+https://git@github.com/asaschachar/optimizely-manager-js-web.git#v2.0.0
```
 
## SDK Registry Setup (One instance)
At your application startup:
```javascript
import OptimizelyManager from '@optimizely/optimizely-sdk-manager';
import OptimizelySDK from '@optimizely/optimizely-sdk';

OptimizelyManager.withSdk(OptimizelySDK)

OptimizelyManager.configure({
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz',
});

const optimizely = OptimizelyManager.getClient();
```

## SDK Registry Setup (multiple instances)
At your application startup:
```javascript
import OptimizelyManager from '@optimizely/optimizely-sdk-manager';
import OptimizelySDK from '@optimizely/optimizely-sdk';

OptimizelyManager.withSdk(OptimizelySDK)

OptimizelyManager.register({
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz',
  name: 'backend-api',
});

OptimizelyManager.register({
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz',
  name: 'backend-permissions',
});

const optimizely = OptimizelyManager.getRegisteredClient('backend-api');
```

## Usage
When you want to use a feature flag:
```javascript
const optimizely = OptimizelyManager.getClient('backend-api');
const enabled = optimizely.isFeatureEnabled('sale_price');
```                                                                     
                                                                        
If you are using a feature flag in another file, get the optimizely client first after requiring the manager

```javascript
const OptimizelyManager = require('optimizely-manager-node');

const optimizely = OptimizelyManager.getClient('backend-permissions');
const enabled = optimizely.isFeatureEnabled('sale_price');
```

## Injected SDK
```javascript
import OptimizelyManager from 'optimizely-manager-js-web';
import OptimizelySDK from '@optimizely/optimizely-sdk';

OptimizelyManager.configure({
  sdk: OptimizelySDK,
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz',
})

OptimizelyManager.getClient();
```
