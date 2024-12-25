//лк страницы для карточек
$(document).ready(function () {
  let cardsPerPage = $(window).width() > 768 ? 9 : 7;
  const totalCards = $(".search-result__item").length;
  let totalPages = Math.ceil(totalCards / cardsPerPage);
  let currentPage = 1;

  // Функция для переключения классов кнопок
  function updateButtons() {
    const $prevButton = $("#cards-prev");
    const $nextButton = $("#cards-next");

    $prevButton.toggleClass("inactive", currentPage === 1);
    $nextButton.toggleClass("inactive", currentPage === totalPages);
  }

  // Функция для отображения карточек на текущей странице
  function showCards() {
    $(".search-result__item").hide();
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    $(".search-result__item").slice(start, end).show();
    updateButtons();
  }

  // Функция для обновления номеров страниц
  function updatePageNumbers() {
    const pageNumbersContainer = $(".page-numbers");
    pageNumbersContainer.empty();

    for (let i = 1; i <= totalPages; i++) {
      pageNumbersContainer.append(
        `<li class="page-number txt24-days ${
          i === currentPage ? "active" : ""
        }">${i}</li>`
      );
    }
  }

  // Обработчик клика по кнопкам "Назад" и "Вперед"
  $(".slider-button").on("click", function () {
    if ($(this).hasClass("inactive")) return;

    currentPage = $(this).is("#cards-next") ? currentPage + 1 : currentPage - 1;
    showCards();
    updatePageNumbers();
  });

  // Обработчик клика по номеру страницы
  $(document).on("click", ".page-number", function () {
    currentPage = parseInt($(this).text(), 10);
    showCards();
    updatePageNumbers();
  });

  $(window).on("resize", function () {
    const newCardsPerPage = $(window).width() > 768 ? 9 : 7;
    if (newCardsPerPage !== cardsPerPage) {
      cardsPerPage = newCardsPerPage;
      totalPages = Math.ceil(totalCards / cardsPerPage);
      currentPage = 1;
      showCards();
      updatePageNumbers();
    }
  });

  showCards();
  updatePageNumbers();
});
