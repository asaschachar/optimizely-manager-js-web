/**
 * Optimizely Datafile Manager Web
 *
 * USAGE - INSTALLATION
 *   const OptimizelyManager import 'optimizely-manager-js-web';
 *   const optimizely = new OptimizelyManager({
 *     sdkKey: 'Ly8FQj6vSaDcZUjySoWnWz'
 *   })
 *
 * USAGE - USING A FEATURE FLAG
 *   const enabled = optimizely.isFeatureEnabled('sale_price');
 *
 *   OR
 *
 *   const optimizely = OptimizelyManager.instance.getClient();
 *   const enabled = optimizely.isFeatureEnabled('sale_price');
 */
const optimizely = require('@optimizely/optimizely-sdk');
const defaultLogger = require('@optimizely/optimizely-sdk/lib/plugins/logger');
const LOG_LEVEL = require('@optimizely/optimizely-sdk/lib/utils/enums').LOG_LEVEL;

class OptimizelyManager{
  constructor({ sdkKey, debug, ...rest }) {
    let currentDatafile = {};
    let logLevel = debug ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARNING;
    let logger = defaultLogger.createLogger({ logLevel })

    logger.log(LOG_LEVEL.DEBUG, 'MANAGER: Loading Optimizely Manager');
    this.optimizelyClientInstance = {
      isFeatureEnabled() {
        const UNIINITIALIZED_ERROR = `MANAGER: isFeatureEnabled called but Optimizely not yet initialized.

          If you just started your web app, wait a minute and try the request again.

          OR try moving your OptimizelyManager initialization higher in your application startup code
          OR move your isFeatureEnabled call later in your application lifecycle.
          OR ignore this error and turn it into a warning by setting debug=false

          If this error persists, contact Optimizely!

          TODO: Enable a blocking for Optimizely through the manager
        `;
        if (debug) {
          logger.log(LOG_LEVEL.ERROR, UNIINITIALIZED_ERROR)
        } else {
          logger.log(LOG_LEVEL.DEBUG, UNIINITIALIZED_ERROR)
        }
      }
    }

    let datafileString = localStorage.getItem('optimizelyDatafile');
    if (datafileString) {
      try {
        currentDatafile = JSON.parse(datafileString)
        this.optimizelyClientInstance = optimizely.createInstance({
          datafile: currentDatafile,
          logger,
          ...rest
        });
      } catch (err) {
        logger.log(LOG_LEVEL.DEBUG, 'Could not parse datafile stored in localstorage under \'optimizelyDatafile\'')
      }
    }

    function pollForDatafile() {
      // Request the datafile every second. If the datafile has changed
      // since the last time we've seen it, then re-instantiate the client
      const DATAFILE_URL = `https://cdn.optimizely.com/datafiles/${sdkKey}.json`;

      fetch(DATAFILE_URL)
        .then(function(response) { return response.json(); })
        .then(function(latestDatafile) {
          const latestDatafileString = JSON.stringify(latestDatafile)
          if (latestDatafileString !== JSON.stringify(currentDatafile)) {
            logger.log(LOG_LEVEL.DEBUG, 'MANAGER: Received an updated datafile and is re-initializing')
            // The datafile is different! Let's re-instantiate the client
            optimizelyClientInstance = optimizely.createInstance({
              datafile: latestDatafile,
              logger,
              ...rest
            });
            currentDatafile = latestDatafile;
            localStorage.setItem('optimizelyDatafile', latestDatafileString);
          }
        })
    }

    setInterval(pollForDatafile, 1000);
  }

  isFeatureEnabled(featureKey, userId) {
    userId = userId || Math.random().toString()
    return this.optimizelyClientInstance.isFeatureEnabled(featureKey, userId);
  }
}


class Singleton {

  configure(...args) {
    this.instance = new OptimizelyManager(...args);
  }

  getClient() {
    return this.instance;
  }
}

export default new Singleton();
