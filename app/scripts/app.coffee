window.dancer = dancer = new Dancer()
audio = document.getElementById('audio')

class Channel
  threshold: 0.3
  frequency: [0, 10]

  constructor: (@options) ->


    @kick = dancer.createKick
      threshold: @threshold
      frequency: @frequency
      onKick: (mag) ->
        console.log 'kick@ ', mag
      offKick: (mag) ->
        #console.log 'kick off@ ', mag
    @kick.on()

snare = new Channel id 'snare'

dancer.between 0, 60, ->
  #console.log @getFrequency(400)


dancer.load audio
dancer.play()