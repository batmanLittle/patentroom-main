//question
$(document).ready(function () {
  $(".questions__item-btn").on("click", function () {
    const $thisButton = $(this);
    const $parentItem = $thisButton.closest(".questions__item");
    const $subList = $parentItem.find(".question__item-toggle");

    $subList.stop(true, true).slideToggle(200);

    $thisButton.toggleClass("active");
  });
});
