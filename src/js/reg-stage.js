//шаги Регистрация товарного знака, подача заявки
$(document).ready(function () {
  $(".reg-stage").each(function () {
    const stageContainer = $(this);

    // Скрываем все блоки с ID внутри текущего контейнера
    stageContainer.find(".reg-stage__box, .rs-pp__block").hide();

    // Показать первый активный блок
    const firstModal = stageContainer
      .find(".reg-stage__list li.active")
      .data("modal");
    stageContainer
      .find("#" + firstModal)
      .addClass("active")
      .show();

    // Обработчик клика для переключения
    stageContainer.find(".reg-stage__list li").on("click", function () {
      const targetModal = $(this).data("modal");

      // Убрать активные классы и скрыть только нужные блоки
      stageContainer.find(".reg-stage__list li").removeClass("active");
      stageContainer.find(".blur-effect").removeClass("active");
      stageContainer
        .find(".reg-stage__box, .rs-pp__block")
        .removeClass("active")
        .hide();

      // Активировать текущий элемент и показать соответствующий блок
      $(this).addClass("active");
      $(this).find(".blur-effect").addClass("active");
      stageContainer
        .find("#" + targetModal)
        .addClass("active")
        .show();
    });
  });
});

//переключение кнопок плюс/минус
$(document).ready(function () {
  $(".rs-serv-item_icon").on("click", function () {
    const parentItem = $(this).closest(".rs-serv-item");
    const plusIcon = $(this).find("img").eq(0);
    const minusIcon = $(this).find("img").eq(1);
    const questionIcon = parentItem.find(".rs-serv-item_info img").eq(0);
    const questionIconActive = parentItem.find(".rs-serv-item_info img").eq(1);

    parentItem.toggleClass("rs-serv-item-dark");

    if (parentItem.hasClass("rs-serv-item-dark")) {
      plusIcon.hide();
      minusIcon.show();
      questionIcon.hide();
      questionIconActive.show();
    } else {
      plusIcon.show();
      minusIcon.hide();
      questionIcon.show();
      questionIconActive.hide();
    }
  });
});

//кнопки rs-invoice-opt
$(document).ready(function () {
  $(".rs-invoice-opt").on("click", function () {
    $(".rs-invoice-opt").removeClass("active");

    $(this).addClass("active");
  });
});

//закреп
//закрыть окно ошибка оплаты
$(document).ready(function () {
  $(".box-sticky-btn").on("click", function () {
    $(this).closest(".box-sticky-pay").hide();
  });
});

//кнопка открытия инфы о классе
$(document).ready(function () {
  $(".rs-classes__item-btn").on("click", function () {
    const $btn = $(this);
    const $hiddenContent = $btn
      .closest(".rs-classes__item")
      .find(".rs-classes__item-hidden");

    $hiddenContent.slideToggle(300);

    $btn.toggleClass("active");

    $btn.find("svg").toggle();
  });
});
