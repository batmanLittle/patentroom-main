//cat-pricing
$(document).ready(function () {
  $(".cat-pricing__cat-btn").on("click", function () {
    const $thisButton = $(this);
    const $parentItem = $thisButton.closest(".cat-pricing__cat-item");
    const $subList = $parentItem.find(".cat-pricing__sub-list");

    $subList.stop(true, true).slideToggle(300);

    $thisButton.toggleClass("active");
  });
});
