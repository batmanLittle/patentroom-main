// кнопка blog в мобильной версии

$(document).ready(function () {
  // Переменная для жеста
  let startX, endX;
  // Обработчик для кнопки "Показать текст"
  $(".blog__button-mobile").on("click", function () {
    console.log("ggg");
    var $parentSlideBox = $(this).closest(".blog__slide-box");
    var $currentText = $parentSlideBox.find(".blog__slide-text");

    // Удаляем класс active у всех блоков с текстом, кроме текущего
    $(".blog__slide-text").not($currentText).removeClass("text-active");

    // Переключаем класс active у текущего блока текста
    $currentText.toggleClass("text-active");
  });

  // Обработчик для начала жеста
  $(".blog__slide-box").on("mousedown touchstart", function (e) {
    startX = e.clientX || e.touches[0].clientX; // Получаем начальную позицию
  });

  $(".blog__slide-box").on("mouseup touchend", function (e) {
    endX = e.clientX || e.changedTouches[0].clientX; // Получаем конечную позицию

    if (startX > endX + 20 || startX < endX - 20) {
      $(".blog__slide-text").removeClass("text-active");
    }
  });

  $("#blog-prev").on("click", function () {
    $(".blog__slide-text").removeClass("text-active");
  });

  $("#blog-next").on("click", function () {
    $(".blog__slide-text").removeClass("text-active");
  });
});

//переключения цвета кнопок
$(document).ready(function () {
  $(".blog-pg__menu-item").first().addClass("active");

  $(".blog-pg__menu-item").on("click", function () {
    $(".blog-pg__menu-item").removeClass("active");

    $(this).addClass("active");
  });
});
