(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.OptimizelyManager = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

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
  var optimizely = require('@optimizely/optimizely-sdk');

  var defaultLogger = require('@optimizely/optimizely-sdk/lib/plugins/logger');

  var LOG_LEVEL = require('@optimizely/optimizely-sdk/lib/utils/enums').LOG_LEVEL;

  function OptimizelyManager(_ref) {
    var sdkKey = _ref.sdkKey,
        debug = _ref.debug,
        rest = _objectWithoutProperties(_ref, ["sdkKey", "debug"]);

    var currentDatafile = {};
    var logLevel = debug ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARNING;
    var logger = defaultLogger.createLogger({
      logLevel: logLevel
    });
    logger.log(LOG_LEVEL.DEBUG, 'MANAGER: Loading Optimizely Manager');
    var optimizelyClientInstance = {
      isFeatureEnabled: function isFeatureEnabled() {
        var UNIINITIALIZED_ERROR = "MANAGER: isFeatureEnabled called but Optimizely not yet initialized.\n\n        If you just started your web app, wait a minute and try the request again.\n\n        OR try moving your OptimizelyManager initialization higher in your application startup code\n        OR move your isFeatureEnabled call later in your application lifecycle.\n        OR ignore this error and turn it into a warning by setting debug=false\n\n        If this error persists, contact Optimizely!\n\n        TODO: Enable a blocking for Optimizely through the manager\n      ";

        if (debug) {
          logger.log(LOG_LEVEL.ERROR, UNIINITIALIZED_ERROR);
        } else {
          logger.log(LOG_LEVEL.DEBUG, UNIINITIALIZED_ERROR);
        }
      }
    };
    var datafileString = localStorage.getItem('optimizelyDatafile');

    if (datafileString) {
      try {
        currentDatafile = JSON.parse(datafileString);
        optimizelyClientInstance = optimizely.createInstance(_objectSpread({
          datafile: currentDatafile,
          logger: logger
        }, rest));
      } catch (err) {
        logger.log(LOG_LEVEL.DEBUG, 'Could not parse datafile stored in localstorage under \'optimizelyDatafile\'');
      }
    }

    function pollForDatafile() {
      // Request the datafile every second. If the datafile has changed
      // since the last time we've seen it, then re-instantiate the client
      var DATAFILE_URL = "https://cdn.optimizely.com/datafiles/".concat(sdkKey, ".json");
      fetch(DATAFILE_URL).then(function (response) {
        return response.json();
      }).then(function (latestDatafile) {
        var latestDatafileString = JSON.stringify(latestDatafile);

        if (latestDatafileString !== JSON.stringify(currentDatafile)) {
          logger.log(LOG_LEVEL.DEBUG, 'MANAGER: Received an updated datafile and is re-initializing'); // The datafile is different! Let's re-instantiate the client

          optimizelyClientInstance = optimizely.createInstance(_objectSpread({
            datafile: latestDatafile,
            logger: logger
          }, rest));
          currentDatafile = latestDatafile;
          localStorage.setItem('optimizelyDatafile', latestDatafileString);
        }
      });
    }

    setInterval(pollForDatafile, 1000);
    return {
      isFeatureEnabled: function isFeatureEnabled() {
        var _optimizelyClientInst;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // Check to see if we need to generate a userId
        if (args[1] === undefined) args[1] = Math.random().toString();
        return (_optimizelyClientInst = optimizelyClientInstance).isFeatureEnabled.apply(_optimizelyClientInst, args);
      },
      getClient: function getClient() {
        return this;
      }
    };
  }

  var Singleton =
  /*#__PURE__*/
  function () {
    function Singleton() {
      _classCallCheck(this, Singleton);

      if (!Singleton.instance) {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        Singleton.instance = _construct(OptimizelyManager, args);
      }
    }

    _createClass(Singleton, [{
      key: "isFeatureEnabled",
      value: function isFeatureEnabled() {
        var _Singleton$instance;

        return (_Singleton$instance = Singleton.instance).isFeatureEnabled.apply(_Singleton$instance, arguments);
      }
    }]);

    return Singleton;
  }();

  return Singleton;

}));
