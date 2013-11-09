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
  var Channel, ChannelView, app, init;

  Channel = require('scripts/models/channel');

  ChannelView = require('scripts/views/channel');

  app = {};

  init = function() {
    var audio, channel, channels, dancer, _i, _len;
    app.dancer = dancer = new Dancer();
    audio = document.getElementById('audio');
    channels = [
      new Channel({
        id: 'kick'
      }, {
        app: app
      }), new Channel({
        id: 'bass',
        threshold: 0.01,
        frequency: [30, 31]
      }, {
        app: app
      }), new Channel({
        id: 'snare',
        threshold: 0.005,
        frequency: [200, 210]
      }, {
        app: app
      }), new Channel({
        id: 'hat',
        threshold: 0.002,
        frequency: [400, 410]
      }, {
        app: app
      }), new Channel({
        id: 'treble',
        threshold: 0.001,
        frequency: [500, 510]
      }, {
        app: app
      })
    ];
    for (_i = 0, _len = channels.length; _i < _len; _i++) {
      channel = channels[_i];
      channel.view = new ChannelView({
        model: channel
      });
      $('#channels').append(channel.view.render().$el);
    }
    app.channels = channels;
    dancer.between(0, 60, function() {});
    dancer.load(audio);
    return dancer.play();
  };

  jQuery(init);

  module.exports = app;
  
});
window.require.register("scripts/models/channel", function(exports, require, module) {
  var Channel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Channel = (function(_super) {
    __extends(Channel, _super);

    function Channel() {
      _ref = Channel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Channel.prototype.defaults = function() {
      return {
        threshold: 0.3,
        frequency: [0, 10]
      };
    };

    Channel.prototype.initialize = function(attrs, options) {
      this.options = options != null ? options : {};
      this.app = this.options.app;
      this.kick = this.app.dancer.createKick({
        threshold: this.get('threshold'),
        frequency: this.get('frequency'),
        onKick: _.bind(this.onKick, this),
        offKick: _.bind(this.offKick, this)
      });
      return this.kick.on();
    };

    Channel.prototype.onKick = function(mag) {
      return this.trigger('kick:on', mag);
    };

    Channel.prototype.offKick = function(mag) {
      return this.trigger('kick:off', mag);
    };

    return Channel;

  })(Backbone.Model);

  module.exports = Channel;
  
});
window.require.register("scripts/views/channel", function(exports, require, module) {
  var ChannelView, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('templates/channel');

  ChannelView = (function(_super) {
    __extends(ChannelView, _super);

    function ChannelView() {
      _ref = ChannelView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ChannelView.prototype.template = template;

    ChannelView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.listenTo(this.model, 'kick:on', this.onKick);
      return this.listenTo(this.model, 'kick:off', this.offKick);
    };

    ChannelView.prototype.render = function() {
      this.setElement($(this.template(this.model.toJSON())));
      return this;
    };

    ChannelView.prototype.onKick = function(mag) {
      return this.$el.addClass('on');
    };

    ChannelView.prototype.offKick = function(mag) {
      return this.$el.removeClass('on');
    };

    return ChannelView;

  })(Backbone.View);

  module.exports = ChannelView;
  
});
