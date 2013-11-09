class Channel extends Backbone.Model

  defaults: ->
    threshold: 0.3
    frequency: 0
    frequencyRange: 10

  initialize: (attrs, @options={}) ->
    @app = @options.app
    @kick = @app.dancer.createKick
      onKick: _.bind(@onKick, @)
      offKick: _.bind(@offKick, @)
    @kick.on()

    @on 'change:threshold', =>
      @kick.threshold = @get 'threshold'
    @on 'change:frequency change:frequencyRange', =>
      @kick.frequency = [@get('frequency'), @get('frequency') + @get('frequencyRange')]
    @trigger 'change:threshold'
    @trigger 'change:frequency'

  onKick: (mag) ->
    @trigger 'kick:on', mag

  offKick: (mag) ->
    @trigger 'kick:off', mag

module.exports = Channel