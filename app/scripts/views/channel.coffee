template = require 'templates/channel'

class ChannelView extends Backbone.View
  template: template

  initialize: (options={}) ->
    @listenTo @model, 'kick:on', @onKick
    @listenTo @model, 'kick:off', @offKick

  render: ->
    @setElement $(@template @model.toJSON())
    @

  onKick: (mag) ->
    @$el.addClass 'on'

  offKick: (mag) ->
    @$el.removeClass 'on'

module.exports = ChannelView