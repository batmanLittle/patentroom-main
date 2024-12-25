//кнопка плюч минус
$(document).ready(function () {
  $(".rs-pp-classes__item-icon").on("click", function () {
    const button = $(this);
    const parentItem = button.closest(".rs-pp-classes__item");
    const spanElement = parentItem.find(".rs-pp-classes__item-desc span");

    button.find("img").toggle();

    spanElement.toggleClass("rs-pp-classes__item-span");
  });
});

//кнопка редактировать
$(document).ready(function () {
  $("#rs-pp-num .block-edit").on("click", function () {
    const container = $(this).closest("#rs-pp-num");
    const inputField = container.find(".form-input");

    if (inputField.prop("disabled")) {
      inputField.prop("disabled", false).focus();
      $(this).find("p").text("сохранить");
    } else {
      inputField.prop("disabled", true);
      $(this).find("p").text("редактировать");
    }
  });
});
