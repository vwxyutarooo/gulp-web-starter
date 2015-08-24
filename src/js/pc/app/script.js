module.exports = (function($){
  $(document).ready(function(){

    /* Setup Foundation
    ---------------------------------------- */
    var fa = {
      init: function() {
        if(typeof $.prototype.foundation !== 'function') return;
        $(document).foundation();
      }
    }
    fa.init();

  });
})(jQuery);
