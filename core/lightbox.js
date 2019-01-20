$(() => {
  $('a[data-lightbox]').click((ev) => {
    $('<div>').attr({
      id: 'overlay',
      class: 'overlay'
    }).prependTo('body');

    const $self = $(ev.currentTarget);
    $self.addClass('active');

    const $img = $self.children();
    $img.attr('src', $self.attr('href'));

    return false;
  });
});
