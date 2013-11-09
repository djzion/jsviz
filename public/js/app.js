(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("scripts/app", function(exports, require, module) {
  var init;

  init = function() {
    var Channel, audio, dancer, kick, snare;
    window.dancer = dancer = new Dancer();
    audio = document.getElementById('audio');
    Channel = (function() {
      Channel.prototype.threshold = 0.3;

      Channel.prototype.frequency = [0, 10];

      function Channel(options) {
        this.options = options;
        this.id = this.options.id;
        this.$el = $("#" + this.id);
        this.kick = dancer.createKick({
          threshold: this.options.threshold,
          frequency: this.options.frequency,
          onKick: _.bind(this.onKick, this),
          offKick: _.bind(this.offKick, this)
        });
        this.kick.on();
      }

      Channel.prototype.onKick = function(mag) {
        return this.$el.addClass('on');
      };

      Channel.prototype.offKick = function(mag) {
        return this.$el.removeClass('on');
      };

      return Channel;

    })();
    kick = window.kick = new Channel({
      id: 'kick'
    });
    snare = window.snare = new Channel({
      id: 'snare',
      threshold: 0.005,
      frequency: [200, 210]
    });
    dancer.between(0, 60, function() {});
    dancer.load(audio);
    return dancer.play();
  };

  jQuery(init);
  
});
