# Optimizely Datafile Manager JavaScript Web
                                                                        
## Installation
```
npm install --save git+https://git@github.com/asaschachar/optimizely-manager-js-web.git#v2.0.0
```
 
## Setup 
At your application startup:
```javascript
import OptimizelyManager from 'optimizely-manager-js-web';
OptimizelyManager.configure({
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz'
})
```

## Usage
When you want to use a feature flag:
```javascript
const optimizely = OptimizelyManager.getClient();
const enabled = optimizely.isFeatureEnabled('sale_price');
```                                                                     
                                                                        
If you are using a feature flag in another file, get the optimizely client first after requiring the manager

```javascript
const OptimizelyManager = require('optimizely-manager-node');

const optimizely = OptimizelyManager.getClient();
const enabled = optimizely.isFeatureEnabled('sale_price');
```
