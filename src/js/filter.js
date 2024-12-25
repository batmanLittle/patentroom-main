//фильтры  в акккаунет поиск
$(document).ready(function () {
  $("#filter-btn").on("click", function () {
    $(".acc-search__filter").toggleClass("hidden");

    const iconFilter = $(this).find(".icon-set-img");
    const iconClose = $(this).find(".icon-close-menu");

    if ($(".acc-search__filter").hasClass("hidden")) {
      iconFilter.show();
      iconClose.hide();
    } else {
      iconFilter.hide();
      iconClose.show();
    }
  });
});

//acc-search__filter-cl_list
$(document).ready(function () {
  const itemList = $(".acc-search__filter-cl_list");

  const items = ["Все", ...Array.from({ length: 45 }, (_, i) => i + 1)];

  items.forEach((item, index) => {
    const listItem = $(`<li><p class="txt24-days">${item}</p></li>`);
    if (index === 0) listItem.addClass("active");

    listItem.on("click", function () {
      itemList.find("li").removeClass("active");
      $(this).addClass("active");
    });

    itemList.append(listItem);
  });
});
