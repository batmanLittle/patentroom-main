$(document).ready(function () {
  const $marqueeList = $(".marquee__list");
  const itemWidth = $marqueeList.children().first().outerWidth(true);
  const totalWidth = itemWidth * $marqueeList.children().length;
  const animationDuration = totalWidth * 100;

  // Дублируем элементы, чтобы создать бесконечный эффект
  $marqueeList.append($marqueeList.html());
  $marqueeList.append($marqueeList.html());
  $marqueeList.append($marqueeList.html());
  $marqueeList.append($marqueeList.html());
  // Устанавливаем начальную позицию
  $marqueeList.css({
    width: totalWidth * 4 + "px",
    animation: `marquee ${animationDuration}ms linear infinite`,
  });

  // CSS для анимации
  $("<style>")
    .prop("type", "text/css")
    .html(
      `
                        @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-${totalWidth * 4}px); }
                }
            `
    )
    .appendTo("head");
});
