(function ($) {
  if (!$) {
    throw new Error('This plugin needs jQuery');
  }

  $.fn.astrabox = function () {
    function defineHandlers($el) {
      $el.click((ev) => {
        const $astraboxCont = $('<div>').attr({
          class: 'astrabox-container',
        });

        const $astraboxInner = $('<div>').attr({
          class: 'astrabox-inner',
        }).appendTo($astraboxCont);

        // ссылка на astrabox-картинку
        const $astraboxLink = $(ev.currentTarget);
        const title = $astraboxLink.attr('data-title') || '';
        $astraboxInner.append(`<h6 class="astrabox-title">${title}</h6>`);

        // astrabox - картинка
        const $innerImage = $(ev.target);

        // координаты относительно целевой картинки
        const innerImageCoords = $innerImage.offset();
        $('<img class="astrabox-img">').appendTo($astraboxInner);

        $astraboxInner
          .data('initialImgCoords', {
            initLeft: innerImageCoords.left,
            initTop: innerImageCoords.top,
          })
          .animate({
            left: '50%',
            top: '50%',
          })
          .find('.astrabox-img')
          .attr('src', $astraboxLink.attr('href'));

        $astraboxCont.appendTo('body');
        return false;
      });

      $(document).on('click', '.astrabox-container', (ev) => {
        const $self = $(ev.target);

        const $astraboxInner = $self.find('.astrabox-inner');
        const {
          initLeft: left,
          initTop: top,
        } = $astraboxInner.data('initialImgCoords');

        const $astraboxImg = $astraboxInner.find('.astrabox-img');

        $astraboxInner
          .find('.astrabox-title')
          .fadeOut('fast')
          .end()
          .animate({
            left: left + $astraboxImg.width() / 2,
            top: top + $astraboxImg.height() / 2,
            queue: false,
          }, 500, () => {
            $self.remove();
          });
      });
    }

    return this.each(function () {
      defineHandlers($(this));
    });
  };

  $('[data-astrabox]').astrabox();
}(jQuery));
