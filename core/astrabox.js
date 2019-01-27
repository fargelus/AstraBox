$(() => {
  $('a[data-astrabox]').click(function(ev) {
    ev.preventDefault();
    const $astraboxCont = $('<div>').attr({
      id: 'astrabox-container',
      class: 'astrabox-container',
    }).appendTo('body');

    // astrabox - картинка
    const $innerImage = $(this).find('img');

    // координаты относительно целевой картинки
    const innerImageCoords = $innerImage.offset();
    const $astraboxImg = $('<img class="astrabox-img">');
    $astraboxImg.data({
        initLeft: innerImageCoords.left,
        initTop: innerImageCoords.top,
      })
      .animate({
        left: '50%',
        top: '50%',
      })
      .attr('src', $(this).attr('href') )
      .appendTo($astraboxCont);

    return false;
  });

  $(document).on('click', '#astrabox-container', (ev) => {
    const $self = $(ev.target);

    const $astraboxImg = $self.find('.astrabox-img');
    const left = $astraboxImg.data('initLeft');
    const top = $astraboxImg.data('initTop');

    $astraboxImg.animate({
      left: left + $astraboxImg.width() / 2,
      top: left + $astraboxImg.height() / 2,
      queue: false,
    }, 500, () => {
      $self.remove();
    });
  });
});
