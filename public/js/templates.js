window.require.register("index", function(exports, require, module) {
  module.exports = function anonymous(locals) {
  var buf = [];
  buf.push("<!DOCTYPE html><audio id=\"audio\" src=\"/mp3/test.mp3\" controls=\"controls\"></audio><link href=\"/css/app.css\" rel=\"stylesheet\" type=\"text/css\"><script src=\"//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js\"></script><script src=\"/js/underscore.js\"></script><script src=\"/js/backbone.js\"></script><script src=\"/js/three.js\"></script><script src=\"/js/dancer.js\"></script><script src=\"/js/jade.runtime.js\"></script><script src=\"/js/app.js\"></script><script src=\"/js/templates.js\"></script><script>window.app = require('scripts/app')\n</script><div id=\"channels\"></div>");;return buf.join("");
  };
});
window.require.register("templates/channel", function(exports, require, module) {
  module.exports = function anonymous(locals) {
  var buf = [];
  var locals_ = (locals || {}),id = locals_.id,threshold = locals_.threshold,frequency = locals_.frequency,frequencyRange = locals_.frequencyRange;buf.push("<div" + (jade.attrs({ 'data-channel':(id), "class": [('channel')] }, {"data-channel":true})) + "><label>Threshold</label><input" + (jade.attrs({ 'data-value-for':("threshold"), 'value':(threshold) }, {"data-value-for":true,"value":true})) + "/><input" + (jade.attrs({ 'value':(threshold), 'type':("range"), 'min':("0"), 'max':("1"), 'step':("0.005"), "class": [('threshold')] }, {"value":true,"type":true,"min":true,"max":true,"step":true})) + "/><label>Frequency</label><input" + (jade.attrs({ 'data-value-for':("frequency"), 'value':(frequency) }, {"data-value-for":true,"value":true})) + "/><input" + (jade.attrs({ 'value':(frequency), 'type':("range"), 'min':("0"), 'max':("511"), "class": [('frequency')] }, {"value":true,"type":true,"min":true,"max":true})) + "/><label>Freq. Range</label><input" + (jade.attrs({ 'data-value-for':("frequencyRange"), 'value':(frequencyRange) }, {"data-value-for":true,"value":true})) + "/><input" + (jade.attrs({ 'value':(frequencyRange), 'type':("range"), 'min':("0"), 'max':("100"), "class": [('frequencyRange')] }, {"value":true,"type":true,"min":true,"max":true})) + "/></div>");;return buf.join("");
  };
});
