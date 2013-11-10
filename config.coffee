exports.config =
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/
      order:
        before: [
          'vendor/scripts/underscore.js'
          'vendor/scripts/backbone.js'
        ]

    stylesheets:
      joinTo:
        'css/app.css' : /^(app|vendor)/

    templates:
      joinTo:
        'js/templates.js': /.+\.jade$/

  plugins:
    jade:
      options:
        pretty: yes # Adds pretty-indentation whitespaces to output (false by default)