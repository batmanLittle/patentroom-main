// Функция для перевода rem в px
function remToPx(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// Универсальная функция для инициализации Swiper с кнопками
function initializeSwiperWithButtons(
  swiperSelector,
  prevButtonId,
  nextButtonId,
  breakpoints
) {
  var swiperInstance = new Swiper(swiperSelector, {
    slidesPerView: 1,
    spaceBetween: remToPx(2.8),
    loop: false,

    breakpoints: breakpoints || {
      769: {
        slidesPerView: 4,
      },
    },
  });

  // Обновление состояния кнопок
  function updateButtons() {
    if (swiperInstance.isBeginning) {
      $(prevButtonId).addClass("inactive");
    } else {
      $(prevButtonId).removeClass("inactive");
    }

    if (swiperInstance.isEnd) {
      $(nextButtonId).addClass("inactive");
    } else {
      $(nextButtonId).removeClass("inactive");
    }
  }

  // Начальная проверка состояния кнопок
  updateButtons();

  // Обработчики событий для кнопок
  $(prevButtonId).on("click", function () {
    swiperInstance.slidePrev();
  });

  $(nextButtonId).on("click", function () {
    swiperInstance.slideNext();
  });

  // Обновление состояния кнопок при изменении слайда
  swiperInstance.on("slideChange", updateButtons);

  // Обновление состояния кнопок при изменении размера экрана
  $(window).on("resize", function () {
    setTimeout(updateButtons, 300);
  });

  return swiperInstance;
}

$(document).ready(function () {
  // Инициализация слайдера для блога
  initializeSwiperWithButtons(".blog__slider", "#blog-prev", "#blog-next", {
    769: {
      slidesPerView: 4,
    },
  });

  // Инициализация слайдера для команды
  initializeSwiperWithButtons(".team__slider", "#team-prev", "#team-next", {
    769: {
      slidesPerView: 4,
    },
  });

  // Инициализация слайдера для отзывов
  initializeSwiperWithButtons(
    ".reviews__slider",
    "#reviews-prev",
    "#reviews-next",
    {
      769: {
        slidesPerView: 3,
      },
    }
  );
});
