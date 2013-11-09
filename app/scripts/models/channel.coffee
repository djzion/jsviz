class Channel extends Backbone.Model
  defaults: ->
    threshold: 0.3
    frequency: [0, 10]

  initialize: (attrs, @options={}) ->
    @app = @options.app
    @kick = @app.dancer.createKick
      threshold: @get 'threshold'
      frequency: @get 'frequency'
      onKick: _.bind(@onKick, @)
      offKick: _.bind(@offKick, @)
    @kick.on()

  onKick: (mag) ->
    @trigger 'kick:on', mag

  offKick: (mag) ->
    @trigger 'kick:off', mag

module.exports = Channel