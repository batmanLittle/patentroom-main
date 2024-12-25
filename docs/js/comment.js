// comment
$(document).ready(function () {
  $(".all-com__reply").on("click", function () {
    const nestedBlock = $(this).siblings(".all-com__nested");

    if (nestedBlock.length) {
      nestedBlock.toggleClass("active");

      const isActive = nestedBlock.hasClass("active");
      $(this)
        .find("p")
        .text(isActive ? "Скрыть" : "Показать ещё 2 ответа");
    } else {
      console.error("Блок .all-com__nested не найден");
    }
  });
});

// ответить

$(document).ready(function () {
  $(".reply-button").on("click", function () {
    const newComBlock = $(this).closest(".all-com__block").find(".new-com");

    newComBlock.removeClass("hidden");

    $(this).css("opacity", "0");
  });
});
