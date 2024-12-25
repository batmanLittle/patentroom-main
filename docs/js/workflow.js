$(document).ready(function () {
  // Отображаем первую картинку и описание по умолчанию
  $(".workflow__description").hide().eq(0).show();
  $(".workflow__img").removeClass("active").eq(0).addClass("active");
  $(".workflow__item").eq(0).addClass("workflow__item-active");

  // Обработчик клика на кнопки
  $(".workflow__item").on("click", function () {
    var index = $(this).index();

    // Скрываем все описания и изображения, убираем активные классы
    $(".workflow__description").hide();
    $(".workflow__img").removeClass("active");
    $(".workflow__item").removeClass("workflow__item-active");

    // Отображаем соответствующий текст и изображение
    $(".workflow__description").eq(index).show();
    $(".workflow__img").eq(index).addClass("active");
    $(this).addClass("workflow__item-active");
  });
});
