(function ($) {
  if (!$) {
    throw new Error('This plugin needs jQuery');
  }

  $.fn.astrabox = function () {
    // Используем повторно для перерасчета координат центра картинки
    function getImageCenterCoords($inner) {
      const isInner = $inner && $inner.length ? $inner : false;
      $inner = isInner || $('.astrabox-inner');

      const {
        initLeft: left,
        initTop: top,
      } = $inner.data('initialImgCoords');

      const $astraboxImg = $inner.find('.astrabox-img');
      return {
        left: left + $astraboxImg.width() / 2,
        top: top + $astraboxImg.height() / 2,
      };
    }

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
        $('<img class="astrabox-img zoom-in">').appendTo($astraboxInner);

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

        // Если клик на области с картинкой
        if ($self.closest('.astrabox-inner').length) return;

        const $astraboxInner = $self.find('.astrabox-inner');
        const imgCenterCoords = getImageCenterCoords($astraboxInner);
        $astraboxInner
          .find('.astrabox-title')
          .fadeOut('fast')
          .end()
          .animate({
            left: imgCenterCoords.left,
            top: imgCenterCoords.top,
            queue: false,
          }, 500, () => {
            $self.remove();
          });
      });

      $(document).on('click', '.astrabox-inner', (ev) => {
        const $self = $(ev.currentTarget);
        const $img = $self.find('.astrabox-img');
        $img.toggleClass('zoom-in zoom-out');
        $self.toggleClass('scale');
      });
    }

    return this.each(function () {
      defineHandlers($(this));
    });
  };

  $('[data-astrabox]').astrabox();
}(jQuery));
