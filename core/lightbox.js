$(() => {
  $('a[data-lightbox]').click(function(ev) {
    const $lightboxCont = $('<div>').attr({
      id: 'lightbox-container',
      class: 'lightbox-container',
    });

    const $innerImage = $(this).find('img');
    const innerImageCoords = $innerImage.offset();
    const $lightBoxImg = $('<img class="lightbox-img">')
      .css({
        left: innerImageCoords.left,
        top: innerImageCoords.top,
      })
      .data({
        initLeft: innerImageCoords.left,
        initTop: innerImageCoords.top,
      })
      .animate({
        left: '50%',
        top: '50%',
      }, 350)
      .attr('src', $(this).attr('href') )
      .appendTo($lightboxCont);

    $('body').append($lightboxCont);
    return false;
  });

  $(document).on('click', '#lightbox-container', (ev) => {
    const $self = $(ev.target);

    const $lightBoxImg = $self.find('.lightbox-img');
    // TODO анимация стартует одновременно для контейнера и картинки
    $lightBoxImg.animate({
      left: $lightBoxImg.data('initLeft'),
      top: $lightBoxImg.data('initTop'),
    }, () => {
        $self.remove();
    });
  });
});
