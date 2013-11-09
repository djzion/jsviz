init = ->
  window.dancer = dancer = new Dancer()
  audio = document.getElementById('audio')

  class Channel
    threshold: 0.3
    frequency: [0, 10]

    constructor: (@options) ->
      @id = @options.id
      @$el = $("##{@id}")
      @kick = dancer.createKick
        threshold: @options.threshold
        frequency: @options.frequency
        onKick: _.bind(@onKick, @)
        offKick: _.bind(@offKick, @)
      @kick.on()

    onKick: (mag) ->
      @$el.addClass 'on'

    offKick: (mag) ->
      @$el.removeClass 'on'

  kick = window.kick = new Channel id: 'kick'
  snare = window.snare = new Channel id: 'snare', threshold: 0.005, frequency: [200, 210]

  dancer.between 0, 60, ->
    #console.log @getFrequency(400)


  dancer.load audio
  dancer.play()

jQuery init