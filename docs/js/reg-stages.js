// 9. Детальная услуги
$(document).ready(function () {
  let currentIndex = 0;

  function updateContent(index) {
    // Скрываем все описания и изображения
    $(".reg-stages__description").hide().removeClass("active");
    $(".reg-stages__img").hide().removeClass("active");
    $(".reg-stages__item").removeClass("reg-stages__item-active");

    // Отображаем соответствующие элементы
    $(".reg-stages__description").eq(index).show().addClass("active");
    $(".reg-stages__img").eq(index).show().addClass("active");
    $(".reg-stages__item").eq(index).addClass("reg-stages__item-active");
  }

  // Обработчик клика по элементам списка
  $(".reg-stages__item").on("click", function () {
    currentIndex = $(this).index();
    updateContent(currentIndex);
  });

  // Обработчик клика на кнопку переключения
  $(".reg-stages__btn").on("click", function () {
    currentIndex = (currentIndex + 1) % $(".reg-stages__item").length;
    updateContent(currentIndex);
  });

  // Инициализация — показываем первый элемент
  updateContent(currentIndex);
});
