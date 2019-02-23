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

    function getParentCenter($parent, $el) {
      return {
        x: $parent.width() / 2 - $el[0].width / 2,
        y: $parent.height() / 2 - $el[0].height / 2,
      };
    }

    function defineHandlers($el) {
      $el.click((ev) => {
        ev.preventDefault();

        const $initialLinkToImg = $(ev.currentTarget);
        const title = $initialLinkToImg.attr('data-title') || '';
        const imgUrl = $initialLinkToImg.attr('href');

        const $astraboxCont = $('<div>').attr({
          class: 'astrabox-container',
        });
        const $astraboxInner = $('<div>').attr({
          class: 'astrabox-inner',
        });
        const img = document.createElement('img');
        img.onload = function () {
          $astraboxInner.append(this);

          const containerCenter = getParentCenter($astraboxCont, $(this));
          const $initialImg = $(ev.target);
          // координаты относительно целевой картинки
          const initialImgCoords = $initialImg.offset();
          $astraboxInner
            .data('initialImgCoords', {
              initLeft: initialImgCoords.left,
              initTop: initialImgCoords.top,
            })
            .animate({
              left: containerCenter.x,
              top: containerCenter.y,
            });

          $astraboxCont.show();
        };
        img.setAttribute('src', imgUrl);
        img.classList.add('astrabox-img', 'zoom-in');

        $astraboxInner.appendTo($astraboxCont);
        $astraboxInner.append(`<h6 class="astrabox-title">${title}</h6>`);
        $astraboxCont.hide().appendTo('body');
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
