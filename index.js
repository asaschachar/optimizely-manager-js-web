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
   * Creates a singleton instance of a manager which then can be used
   * to interact with the Optimizely SDK anywhere in your application.
   */
  var optimizely = require('@optimizely/optimizely-sdk');

  var defaultLogger = require('@optimizely/optimizely-sdk/lib/plugins/logger');

  var LOG_LEVEL = require('@optimizely/optimizely-sdk/lib/utils/enums').LOG_LEVEL;

  var OptimizelyManager =
  /*#__PURE__*/
  function () {
    function OptimizelyManager(_ref) {
      var sdkKey = _ref.sdkKey,
          logLevel = _ref.logLevel,
          rest = _objectWithoutProperties(_ref, ["sdkKey", "logLevel"]);

      _classCallCheck(this, OptimizelyManager);

      logLevel = logLevel || LOG_LEVEL.DEBUG;
      var currentDatafile = {};
      var logger = defaultLogger.createLogger({
        logLevel: logLevel
      });
      logger.log(LOG_LEVEL.DEBUG, 'MANAGER: Loading Optimizely Manager');
      this.optimizelyClientInstance = {
        isFeatureEnabled: function isFeatureEnabled() {
          var UNIINITIALIZED_ERROR = "MANAGER: isFeatureEnabled called but Optimizely not yet initialized.\n\n          If you just started your web app, wait a minute and try the request again.\n\n          OR try moving your OptimizelyManager initialization higher in your application startup code\n          OR move your isFeatureEnabled call later in your application lifecycle.\n          OR ignore this error and turn it into a warning by changinge the logLevel\n\n          If this error persists, contact Optimizely!\n        ";
          logger.log(LOG_LEVEL.ERROR, UNIINITIALIZED_ERROR);
        }
      };
      var datafileString = localStorage.getItem('optimizelyDatafile');

      if (datafileString) {
        try {
          currentDatafile = JSON.parse(datafileString);
          this.optimizelyClientInstance = optimizely.createInstance(_objectSpread({
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
    }

    _createClass(OptimizelyManager, [{
      key: "isFeatureEnabled",
      value: function isFeatureEnabled(featureKey, userId) {
        userId = userId || Math.random().toString();
        return this.optimizelyClientInstance.isFeatureEnabled(featureKey, userId);
      }
    }]);

    return OptimizelyManager;
  }();

  var Singleton =
  /*#__PURE__*/
  function () {
    function Singleton() {
      _classCallCheck(this, Singleton);
    }

    _createClass(Singleton, [{
      key: "configure",
      value: function configure() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.instance = _construct(OptimizelyManager, args);
      }
    }, {
      key: "getClient",
      value: function getClient() {
        return this.instance;
      }
    }]);

    return Singleton;
  }();

  var main = new Singleton();

  return main;

}));
