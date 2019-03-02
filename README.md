# Optimizely Datafile Manager JavaScript Web
                                                                        
## Installation
```
npm install --save git+https://git@github.com/asaschachar/optimizely-manager-js-web.git
```
 
## Setup 
At your application startup:
```
const OptimizelyManager = require('optimizely-manager-js-web');
const optimizely = new OptimizelyManager({
  sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz'
})
```

## Usage
When you want to use a feature flag:
```
const enabled = optimizely.isFeatureEnabled('sale_price');
```                                                                     
                                                                        
If you are using a feature flag in another file, get the optimizely instance first                                                                        
```
const optimizely = OptimizelyManager.instance.getClient();
const enabled = optimizely.isFeatureEnabled('sale_price');
```