window.require.register("index", function(exports, require, module) {
  module.exports = function anonymous(locals) {
  var buf = [];
  buf.push("<!DOCTYPE html><audio id=\"audio\" src=\"/mp3/test.mp3\" controls=\"controls\"></audio><link href=\"/css/app.css\" rel=\"stylesheet\" type=\"text/css\"><script src=\"//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js\"></script><script src=\"/js/underscore.js\"></script><script src=\"/js/dancer.js\"></script><script src=\"/js/app.js\"></script><script>require('scripts/app')\n</script><div id=\"channels\"><div id=\"kick\" class=\"channel\"></div><div id=\"snare\" class=\"channel\"></div></div>");;return buf.join("");
  };
});
