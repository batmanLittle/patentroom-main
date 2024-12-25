$(".modal-close").on("click", closeModal);
$(".modal-close-menu").on("click", closeModal);
function closeModal() {
  $(".modal").removeClass("modal-active");
  $("body").removeClass("no-scroll");
}
$('[data-modal="modal-invoice"]').on("click", () => {
  $("#modal-invoice").addClass("modal-active");
  $("body").addClass("no-scroll");
});

$('[data-modal="modal-discuss"]').on("click", () => {
  $("#modal-discuss").addClass("modal-active");
  $("body").addClass("no-scroll");
});

$('[data-modal="modal-nl"]').on("click", () => {
  $("#modal-nl").addClass("modal-active");
  $("body").addClass("no-scroll");
});

$('[data-modal="modal-calc"]').on("click", () => {
  $("#modal-calc").addClass("modal-active");
  $("body").addClass("no-scroll");
});

$('[data-modal="modal-menu"]').on("click", () => {
  $("#modal-menu").addClass("modal-active");
  $("body").addClass("no-scroll");
});

$('[data-modal="modal-search"]').on("click", () => {
  $("#modal-search").addClass("modal-active");
  $("body").addClass("no-scroll");
});

//модалка аккаун-меню
$(document).ready(function () {
  $('[data-modal="modal-acc"]').on("click", function () {
    const modal = $("#modal-acc");
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      modal.toggleClass("active");

      $("#menu-acc").toggleClass("visible hidden");
      $("#close-acc").toggleClass("hidden visible");
    }
  });

  $(".hide-mobile[data-modal='modal-acc']").on("click", function () {
    $("#modal-acc").toggleClass("active");
  });
});

//модалка каклькулятор
$(document).ready(function () {
  $(".modal-calc__right-item").on(
    "click",
    ".modal-calc__right-btn",
    function () {
      $(this)
        .closest(".modal-calc__right-item")
        .find(".modal-calc__right-btn")
        .removeClass("active");

      $(this).addClass("active");
    }
  );
});

//модалка для карточки поиска
$(document).ready(function () {
  function adjustText() {
    var lettersToCutDesktop = 250; // Максимальное количество символов для десктопа
    var lettersToCutMobile = 170; // Максимальное количество символов для мобильных

    // Проверяем ширину экрана
    var isMobile = $(window).width() <= 768;

    // Устанавливаем нужное количество символов в зависимости от устройства
    var lettersToCut = isMobile ? lettersToCutMobile : lettersToCutDesktop;

    $(".modal-search__class").each(function () {
      var contentWrapper = $(this);
      var contentText = contentWrapper.data("original-text"); // Получаем полный текст из data-атрибута

      if (!contentText) {
        contentText = contentWrapper.text().trim();
        contentWrapper.data("original-text", contentText);
      }

      // Проверяем, если текст превышает максимальную длину
      if (contentText.length > lettersToCut) {
        var visibleText = contentText.substr(0, lettersToCut);
        contentWrapper.html(
          visibleText + "... <button class='txt-btn'>читать далее</button>"
        );
      } else {
        contentWrapper.html(contentText);
      }
    });
  }

  adjustText();

  $(window).resize(function () {
    adjustText();
  });

  $(document).on("click", ".txt-btn", function (e) {
    e.preventDefault();
    var contentWrapper = $(this).parent();
    var originalText = contentWrapper.data("original-text");
    contentWrapper.html(originalText);
  });
});
