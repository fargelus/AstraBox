(function ($) {
  if (!$) {
    throw new Error('This plugin needs jQuery');
  }

  $.fn.astrabox = function () {
    const ZOOM_RATIO = 1.5;

    function getParentCenter($parent, $el) {
      return {
        x: $parent.width() / 2 - $el[0].width / 2,
        y: $parent.height() / 2 - $el[0].height / 2,
      };
    }

    function zoomIn($el) {
      const w = $el.width();
      const h = $el.height();
      $el.width(w * ZOOM_RATIO);
      $el.height(h * ZOOM_RATIO);
    }

    function zoomOut($el) {
      const w = $el.width();
      const h = $el.height();
      $el.width(w / ZOOM_RATIO);
      $el.height(h / ZOOM_RATIO);
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
        const { initLeft, initTop } = $astraboxInner.data('initialImgCoords');
        $astraboxInner
          .find('.astrabox-title')
          .fadeOut('fast')
          .end()
          .animate({
            left: initLeft,
            top: initTop,
            queue: false,
          }, 500, () => {
            $self.remove();
          });
      });

      $(document).on('click', '.astrabox-img', (ev) => {
        const $img = $(ev.target);
        $img.toggleClass('zoom-in zoom-out');
        if ($img.hasClass('zoom-out')) {
          zoomIn($img);
        } else {
          zoomOut($img);
        }

        const center = getParentCenter($('.astrabox-container'), $img);
        $img
          .parent()
          .css({
            top: center.y,
            left: center.x,
          });
      });
    }

    return this.each(function () {
      defineHandlers($(this));
    });
  };

  $('[data-astrabox]').astrabox();
}(jQuery));
