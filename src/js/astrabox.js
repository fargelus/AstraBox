(function AstraBox($) {
  if (!$) {
    throw new Error('This plugin needs jQuery');
  }

  $('a[data-astrabox]').click((ev) => {
    const $astraboxCont = $('<div>').attr({
      id: 'astrabox-container',
      class: 'astrabox-container',
    }).appendTo('body');

    // ссылка на astrabox-картинку
    const $astraboxLink = $(ev.currentTarget);
    // astrabox - картинка
    const $innerImage = $(ev.target);

    // координаты относительно целевой картинки
    const innerImageCoords = $innerImage.offset();
    const $astraboxImg = $('<img class="astrabox-img">');

    $astraboxImg
      .data('initialImgCoords', {
        initLeft: innerImageCoords.left,
        initTop: innerImageCoords.top,
      })
      .animate({
        left: '50%',
        top: '50%',
      })
      .attr('src', $astraboxLink.attr('href'))
      .appendTo($astraboxCont);

    return false;
  });

  $(document).on('click', '#astrabox-container', (ev) => {
    const $self = $(ev.target);

    const $astraboxImg = $self.find('.astrabox-img');
    const { initLeft: left, initTop: top } = $astraboxImg.data('initialImgCoords');

    $astraboxImg.animate({
      left: left + $astraboxImg.width() / 2,
      top: top + $astraboxImg.height() / 2,
      queue: false,
    }, 500, () => {
      $self.remove();
    });
  });
}(jQuery));
