WIDTH = 640
HEIGHT = 480

class Visuals2D extends Backbone.View
  el: '#visuals'
  sprites: []

  initialize: ->
    @renderer = PIXI.autoDetectRenderer WIDTH, HEIGHT
    @stage = new PIXI.Stage()

    @model.on 'note:on:kick', (mag) =>
      sprite = @addSprite()
      sprite.x *= mag
      sprite.y += mag

  initGraphics: ->
    @graphics = new PIXI.Graphics()
    @graphics.lineStyle(10, 0xffd900, 1);
    @stage.addChild @graphics
    @graphics.beginFill(0xFF700B, 1)
    @graphics.drawRect(@x, 10, 100, 100)

  addSprite: ->
    sprite = PIXI.Sprite.fromImage('/img/quartz.jpg')
    sprite.position.x = Math.random() * WIDTH
    sprite.position.y = Math.random() * HEIGHT
    sprite.width = 100
    sprite.height = 100
    @stage.addChild sprite
    @sprites.push sprite

  updateSprites: ->
    for sprite in sprites
      sprite.alpha *= 0.99

  render: ->
    @$el.append @renderer.view

  redraw: ->
    #@graphics.clear()
    #@graphics.beginFill(0xFF700B, 1)
    #@graphics.drawRect(@x, 10, 100, 100)
    @updateSprites()
    @renderer.render @stage

module.exports = Visuals2D