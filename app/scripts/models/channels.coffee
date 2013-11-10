Channel = require './channel'

class Channels extends Backbone.Collection
  model: Channel
  localStorage: new Backbone.LocalStorage("Channels")

  initialize: (models, @options) ->

module.exports = Channels