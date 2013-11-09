Channel = require 'scripts/models/channel'
ChannelView = require 'scripts/views/channel'
app = {}

init = ->
  app.dancer = dancer = new Dancer()
  audio = document.getElementById('audio')

  channels = [
    new Channel {id: 'kick'}, app: app
    new Channel {id: 'bass', threshold: 0.01, frequency: [30, 31]}, app: app
    new Channel {id: 'snare', threshold: 0.005, frequency: [200, 210]}, app: app
    new Channel {id: 'hat', threshold: 0.002, frequency: [400, 410]}, app: app
    new Channel {id: 'treble', threshold: 0.001, frequency: [500, 510]}, app: app
  ]

  for channel in channels
    channel.view = new ChannelView model: channel
    $('#channels').append channel.view.render().$el

  app.channels = channels

  dancer.between 0, 60, ->
    #console.log @getFrequency(400)

  dancer.load audio
  dancer.play()

jQuery init

module.exports = app