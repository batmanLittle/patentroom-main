//акктивные и завершенные заявки
$(document).ready(function () {
  const firstButton = $(".account-req__top-btn").first();
  const target = firstButton.data("target");
  const firstList = $("#" + target);

  firstButton.addClass("active");
  firstList.show();

  $(".account-req__top-btn").on("click", function () {
    const target = $(this).data("target");
    const listToShow = $("#" + target);

    $(".account-req__top-btn").removeClass("active");
    $(this).addClass("active");

    $(".account-req__top-btn").each(function () {
      const targetList = $("#" + $(this).data("target"));
      targetList.hide();
    });

    listToShow.show();
  });
});
