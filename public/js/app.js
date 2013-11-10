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
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
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

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/app", function(exports, require, module) {
var App, Channel, ChannelView, Channels, Visuals, app, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Channel = require('scripts/models/channel');

Channels = require('scripts/models/channels');

ChannelView = require('scripts/views/channel');

Visuals = require('scripts/views/visuals.2d');

App = (function(_super) {
  __extends(App, _super);

  function App() {
    _ref = App.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  App.prototype.init = function() {
    var audio, dancer, onTick,
      _this = this;
    this.dancer = dancer = new Dancer();
    audio = document.getElementById('audio');
    this.channels = new Channels([], {
      app: this
    });
    this.channels.each(function(channel) {
      channel.view = new ChannelView({
        model: channel
      });
      return $('#channels').append(channel.view.render().$el);
    });
    this.load();
    this.visuals = new Visuals({
      model: this
    });
    this.visuals.render();
    onTick = function() {
      _this.visuals.redraw();
      return window.requestAnimationFrame(onTick);
    };
    window.requestAnimationFrame(onTick);
    dancer.load(audio);
    return dancer.play();
  };

  App.prototype["new"] = function() {
    return this.channels.reset([
      new Channel({
        name: 'kick'
      }), new Channel({
        name: 'bass',
        threshold: 0.01,
        frequency: 30
      }), new Channel({
        name: 'snare',
        threshold: 0.005,
        frequency: 200
      }), new Channel({
        name: 'hat',
        threshold: 0.002,
        frequency: 400
      }), new Channel({
        name: 'treble',
        threshold: 0.001,
        frequency: 500
      })
    ]);
  };

  App.prototype.save = function() {
    return this.channels.each(function(channel) {
      return channel.save();
    });
  };

  App.prototype.load = function() {
    var _this = this;
    return this.channels.fetch().then(function() {
      return _this.channels.each(function(channel) {
        channel.view = new ChannelView({
          model: channel
        });
        return $('#channels').append(channel.view.render().$el);
      });
    });
  };

  return App;

})(Backbone.Model);

app = new App;

jQuery(function() {
  return app.init();
});

module.exports = app;

});

;require.register("scripts/models/channel", function(exports, require, module) {
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
      frequency: 0,
      frequencyRange: 10
    };
  };

  Channel.prototype.initialize = function(attrs, options) {
    var _this = this;
    this.options = options != null ? options : {};
    this.app = this.collection.options.app;
    this.kick = this.app.dancer.createKick({
      onKick: _.bind(this.onKick, this),
      offKick: _.bind(this.offKick, this)
    });
    this.kick.on();
    this.on('change:threshold', function() {
      return _this.kick.threshold = _this.get('threshold');
    });
    this.on('change:frequency change:frequencyRange', function() {
      return _this.kick.frequency = [_this.get('frequency'), _this.get('frequency') + _this.get('frequencyRange')];
    });
    this.trigger('change:threshold');
    return this.trigger('change:frequency');
  };

  Channel.prototype.onKick = function(mag) {
    this.trigger('kick:on', mag);
    return this.app.trigger("note:on:" + (this.get('name')), mag);
  };

  Channel.prototype.offKick = function(mag) {
    this.trigger('kick:off', mag);
    return this.app.trigger("note:off:" + (this.get('name')), mag);
  };

  return Channel;

})(Backbone.Model);

module.exports = Channel;

});

;require.register("scripts/models/channels", function(exports, require, module) {
var Channel, Channels, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Channel = require('./channel');

Channels = (function(_super) {
  __extends(Channels, _super);

  function Channels() {
    _ref = Channels.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Channels.prototype.model = Channel;

  Channels.prototype.localStorage = new Backbone.LocalStorage("Channels");

  Channels.prototype.initialize = function(models, options) {
    this.options = options;
  };

  return Channels;

})(Backbone.Collection);

module.exports = Channels;

});

;require.register("scripts/views/channel", function(exports, require, module) {
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

  ChannelView.prototype.events = {
    'change .threshold': function() {
      this.model.set('threshold', parseFloat(this.$('.threshold').val()));
      return this.$("[data-value-for='threshold']").val(this.model.get('threshold'));
    },
    'change [data-value-for="threshold"]': function() {
      this.model.set('threshold', parseFloat(this.$("[data-value-for='threshold']").val()));
      return this.$('.threshold').val(this.model.get('threshold'));
    },
    'change .frequency': function() {
      this.model.set('frequency', parseFloat(this.$('.frequency').val()));
      return this.$("[data-value-for='frequency']").val(this.model.get('frequency'));
    },
    'change [data-value-for="frequency"]': function() {
      this.model.set('frequency', parseFloat(this.$("[data-value-for='frequency']").val()));
      return this.$('.frequency').val(this.model.get('frequency'));
    },
    'change .frequencyRange': function() {
      this.model.set('frequencyRange', parseFloat(this.$('.frequencyRange').val()));
      return this.$("[data-value-for='frequencyRange']").val(this.model.get('frequencyRange'));
    },
    'change [data-value-for="frequencyRange"]': function() {
      this.model.set('frequencyRange', parseFloat(this.$("[data-value-for='frequencyRange']").val()));
      return this.$('.frequencyRange').val(this.model.get('frequencyRange'));
    },
    'change [data-value-for="name"]': function(evt) {
      return this.model.set('name', $(evt.currentTarget).val());
    }
  };

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

;require.register("scripts/views/visuals.2d", function(exports, require, module) {
var HEIGHT, Visuals2D, WIDTH, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WIDTH = 640;

HEIGHT = 480;

Visuals2D = (function(_super) {
  __extends(Visuals2D, _super);

  function Visuals2D() {
    _ref = Visuals2D.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Visuals2D.prototype.el = '#visuals';

  Visuals2D.prototype.sprites = [];

  Visuals2D.prototype.initialize = function() {
    var _this = this;
    this.renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
    this.stage = new PIXI.Stage();
    return this.model.on('note:on:kick', function(mag) {
      var sprite;
      sprite = _this.addSprite();
      sprite.x *= mag;
      return sprite.y += mag;
    });
  };

  Visuals2D.prototype.initGraphics = function() {
    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(10, 0xffd900, 1);
    this.stage.addChild(this.graphics);
    this.graphics.beginFill(0xFF700B, 1);
    return this.graphics.drawRect(this.x, 10, 100, 100);
  };

  Visuals2D.prototype.addSprite = function() {
    var sprite;
    sprite = PIXI.Sprite.fromImage('/img/quartz.jpg');
    sprite.position.x = Math.random() * WIDTH;
    sprite.position.y = Math.random() * HEIGHT;
    sprite.width = 100;
    sprite.height = 100;
    this.stage.addChild(sprite);
    return this.sprites.push(sprite);
  };

  Visuals2D.prototype.updateSprites = function() {
    var sprite, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = sprites.length; _i < _len; _i++) {
      sprite = sprites[_i];
      _results.push(sprite.alpha *= 0.99);
    }
    return _results;
  };

  Visuals2D.prototype.render = function() {
    return this.$el.append(this.renderer.view);
  };

  Visuals2D.prototype.redraw = function() {
    this.updateSprites();
    return this.renderer.render(this.stage);
  };

  return Visuals2D;

})(Backbone.View);

module.exports = Visuals2D;

});

;require.register("scripts/views/visuals", function(exports, require, module) {
var HEIGHT, Visuals, WIDTH, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WIDTH = 640;

HEIGHT = 480;

Visuals = (function(_super) {
  __extends(Visuals, _super);

  function Visuals() {
    _ref = Visuals.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Visuals.prototype.el = '#visuals';

  Visuals.prototype.initialize = function() {
    var radius, rings, segments,
      _this = this;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new THREE.WebGLRenderer();
    this.scene.add(this.camera);
    radius = 50;
    segments = 16;
    rings = 16;
    this.sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xCC0000
    });
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), this.sphereMaterial);
    this.sphere.geometry.dynamic = true;
    this.scene.add(this.sphere);
    return this.model.on('note:on:kick', function() {
      return _this.camera.rotation.x += 0.1;
    });
  };

  Visuals.prototype.render = function() {
    this.camera.position.z = 300;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.$el.append(this.renderer.domElement);
    return this.renderer.render(this.scene, this.camera);
  };

  Visuals.prototype.redraw = function() {
    return this.renderer.render(this.scene, this.camera);
  };

  return Visuals;

})(Backbone.View);

module.exports = Visuals;

});

;
//# sourceMappingURL=app.js.map