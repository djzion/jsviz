Channel = require 'scripts/models/channel'
Channels = require 'scripts/models/channels'
ChannelView = require 'scripts/views/channel'
Visuals = require 'scripts/views/visuals.2d'

class App extends Backbone.Model

  init: ->
    @dancer = dancer = new Dancer()
    audio = document.getElementById('audio')

    @channels = new Channels([], app: @)
    @channels.each (channel) ->
      channel.view = new ChannelView model: channel
      $('#channels').append channel.view.render().$el

    @load()
    @visuals = new Visuals model: @
    @visuals.render()

    onTick = =>
      @visuals.redraw()
      window.requestAnimationFrame onTick
    window.requestAnimationFrame onTick

    dancer.load audio
    dancer.play()

  new: ->
    @channels.reset([
      new Channel {name: 'kick'}
      new Channel {name: 'bass', threshold: 0.01, frequency: 30}
      new Channel {name: 'snare', threshold: 0.005, frequency: 200}
      new Channel {name: 'hat', threshold: 0.002, frequency: 400}
      new Channel {name: 'treble', threshold: 0.001, frequency: 500}
    ])

  save: ->
    @channels.each (channel) ->
      channel.save()

  load: ->
    @channels.fetch().then =>
      @channels.each (channel) ->
        channel.view = new ChannelView model: channel
        $('#channels').append channel.view.render().$el

app = new App

jQuery ->
  app.init()

module.exports = app