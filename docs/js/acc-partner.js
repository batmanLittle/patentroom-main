//партнерская программа

$(document).ready(function () {
  $(".acc-partner__btn").on("click", function () {
    const target = $(this).index();
    const blocks = $(".acc-partner__right");

    $(".acc-partner__btn").removeClass("active");
    $(this).addClass("active");

    blocks.hide().eq(target).show();
  });

  // первый блок по умолчанию
  $(".acc-partner__btn").first().addClass("active");
  $(".acc-partner__right").hide().first().show();
});
