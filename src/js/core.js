(function ($) {
  if (!$) {
    throw new Error('This plugin needs jQuery');
  }

  $.fn.astrabox = function () {
    // ******* HELPERS ********
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
    // ******* END OF HELPERS ********

    // jQuery cached vars
    const $astraboxCont = $('<div>').attr({
      class: 'astrabox-container',
    });
    const $astraboxInner = $('<div>').attr({
      class: 'astrabox-inner',
    });
    const popupImg = document.createElement('img');
    const $astraboxTitle = $('<h6>').attr({
      class: 'astrabox-title',
    });
    // ******************

    function resetPrevState() {
      $astraboxTitle.show();

      const $img = $(popupImg);
      if ($img.hasClass('zoom-out')) {
        zoomOut($img);
        $img
          .removeClass('zoom-out')
          .addClass('zoom-in');
      }
    }

    function bindAstraboxEvents() {
      resetPrevState();

      $astraboxCont.one('click', (ev) => {
        const $self = $(ev.target);

        // Если клик на области с картинкой
        if ($self.closest('.astrabox-inner').length) return;

        const { initLeft, initTop } = $astraboxInner.data('initialImgCoords');
        $astraboxTitle.fadeOut('fast');
        $astraboxInner
          .animate({
            left: initLeft,
            top: initTop,
            queue: false,
          }, 500, () => {
            $self.remove();
          });
      });

      $(popupImg).on('click', (ev) => {
        ev.stopPropagation();

        const $img = $(ev.target);
        $img.toggleClass('zoom-in zoom-out');
        if ($img.hasClass('zoom-out')) {
          zoomIn($img);
        } else {
          zoomOut($img);
        }

        const center = getParentCenter($astraboxCont, $img);
        $img
          .parent()
          .css({
            top: center.y,
            left: center.x,
          });
      });
    }

    function buildCarcase() {
      $astraboxCont.hide();
      $astraboxInner
        .append($astraboxTitle)
        .append(popupImg)
        .appendTo($astraboxCont);
    }

    buildCarcase();

    function defineClickHandler($el) {
      $el.click((ev) => {
        ev.preventDefault();

        const $initialLinkToImg = $(ev.currentTarget);
        const title = $initialLinkToImg.attr('data-title') || '';
        const imgUrl = $initialLinkToImg.attr('href');

        popupImg.onload = function () {
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
        popupImg.setAttribute('src', imgUrl);
        popupImg.classList.add('astrabox-img', 'zoom-in');

        $astraboxTitle.text(title);
        $astraboxCont.appendTo('body');

        bindAstraboxEvents();
      });
    }

    return this.each(function () {
      defineClickHandler($(this));
    });
  };

  $('[data-astrabox]').astrabox();
}(jQuery));
