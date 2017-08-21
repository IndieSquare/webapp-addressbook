+function ($) {

  $('#commonModal').on('show.bs.modal', function (event) {
      var title = $(this).data('title');
      var body = $(this).data('body');
      $(this).find('.modal-title').text(title);
      $(this).find('.modal-body').text(body);
  });

}(jQuery);

function openCommonModal(title, body) {
  var button = $('#commonModal'), i;
  var keys = $.map(button.data() , function(value, key) { return key; });
  for(i = 0; i < keys.length; i++) {
      if (keys[i].indexOf('lorem') != -1) {
          $('button').removeAttr("data-" + keys[i]);
      }
  }
  button.attr('data-title', title);
  button.attr('data-body', body);
  button.modal();
}
