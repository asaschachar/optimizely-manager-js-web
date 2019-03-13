# Optimizely Datafile Manager JavaScript Web
                                                                        
## Installation
```
npm install --save git+https://git@github.com/asaschachar/optimizely-manager-js-web.git#v2.0.0
```
 
## SDK Registry Setup 
At your application startup:
```javascript
import OptimizelyManager from 'optimizely-manager-js-web';
OptimizelyManager.configure([
  {
    sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz',
    name: 'backend-api',
  },
  {
    sdkKey: 'XFjmGNFQK1snQExC1vgynY',
    name: 'backend-permissions',
  }
])
```

## SDK Registry Setup
At your application startup:
```javascript
import OptimizelyManager from 'optimizely-manager-js-web';
import OptimizelySDK from '@optimizely/optimizely-sdk';

OptimizelyManager.withSdk(OptimizelySDK)

OptimizelyManager.configure({
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz',
});

// Option 2: Multiple instances
OptimizelyManager.register({
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz',
  name: 'backend-models',
});

OptimizelyManager.register({
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz',
  name: 'backend-api',
});


const optimizely = OptimizelyManager.getClient();
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
