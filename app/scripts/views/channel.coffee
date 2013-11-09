template = require 'templates/channel'

class ChannelView extends Backbone.View
  template: template
  events:
    'change .threshold': ->
      @model.set 'threshold', parseFloat @$('.threshold').val()
      @$("[data-value-for='threshold']").val @model.get 'threshold'
    'change [data-value-for="threshold"]': ->
      @model.set 'threshold', parseFloat(@$("[data-value-for='threshold']").val())
      @$('.threshold').val @model.get('threshold')

    'change .frequency': ->
      @model.set 'frequency', parseFloat @$('.frequency').val()
      @$("[data-value-for='frequency']").val @model.get 'frequency'
    'change [data-value-for="frequency"]': ->
      @model.set 'frequency', parseFloat(@$("[data-value-for='frequency']").val())
      @$('.frequency').val @model.get('frequency')

    'change .frequencyRange': ->
      @model.set 'frequencyRange', parseFloat @$('.frequencyRange').val()
      @$("[data-value-for='frequencyRange']").val @model.get 'frequencyRange'
    'change [data-value-for="frequencyRange"]': ->
      @model.set 'frequencyRange', parseFloat(@$("[data-value-for='frequencyRange']").val())
      @$('.frequencyRange').val @model.get('frequencyRange')

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