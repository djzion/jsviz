WIDTH = 640
HEIGHT = 480

class Visuals extends Backbone.View
  el: '#visuals'

  initialize: ->
    @scene = new THREE.Scene()
    @camera = new THREE.PerspectiveCamera()
    @renderer = new THREE.WebGLRenderer()
    @scene.add @camera

    radius = 50
    segments = 16
    rings = 16

    @sphereMaterial =
      new THREE.MeshLambertMaterial
        color: 0xCC0000

    @sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings), @sphereMaterial
    )
    @sphere.geometry.dynamic = true
    @scene.add @sphere

    @model.on 'note:on:kick', =>
      @camera.rotation.x += 0.1

  render: ->
    @camera.position.z = 300
    @renderer.setSize(WIDTH, HEIGHT)
    @$el.append @renderer.domElement
    @renderer.render(@scene, @camera)

  redraw: ->
    @renderer.render(@scene, @camera)

module.exports = Visuals