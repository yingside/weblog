(function() {
  var changeCategory, init;

  $(function() {
    init();
    return changeCategory();
  });

  init = function() {
    var category;
    category = location.hash;
    if (category !== '') {
      return $(category).removeClass("hide");
    } else {
      return $('#all').removeClass("hide");
    }
  };

  changeCategory = function() {
    return $('.catelink').on('click', function() {
      var category;
      $('section.category').addClass('hide');
      category = $(this).data('target-cate');
      return $(category).removeClass("hide");
    });
  };

}).call(this);
