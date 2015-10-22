(function() {
  var bindToTop, initTotop;

  $(function() {
    initTotop();
    return bindToTop();
  });

  initTotop = function() {
    return $(window).scroll(function(event) {
      var winPos;
      winPos = $(window).scrollTop();
      if (winPos > window.screen.height) {
        $("#totop").show();
      }
      if (winPos < window.screen.height) {
        return $("#totop").hide();
      }
    });
  };

  bindToTop = function() {
    return $('#totop').on('click', function() {
      return $('html, body').animate({
        scrollTop: 0
      }, 1000);
    });
  };

}).call(this);
