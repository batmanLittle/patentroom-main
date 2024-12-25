$(document).ready(function () {
  let currentStep = 1;
  let isTooltipActive = false;

  $(".tooltip-block").hide();

  // Функция для показа подсказки
  function showTooltip(step) {
    $(".overlay").fadeIn();

    let tooltipSelector = `#tooltip${step}`;
    let highlightSelector = `#highlight${step}`;

    if (step === 1 || step === 4) {
      if (step === 1 && $(window).width() <= 768) {
        tooltipSelector = `#tooltip${step}.hide-desktop`;
      } else if (step === 1) {
        tooltipSelector = `#tooltip${step}.hide-mobile`;
      }

      if (step === 4) {
        if ($(window).width() <= 768) {
          tooltipSelector = `#tooltip${step}.hide-desktop`;
          highlightSelector = `#highlight${step}.hide-desktop`;
        } else {
          tooltipSelector = `#tooltip${step}.hide-mobile`;
          highlightSelector = `#highlight${step}.hide-mobile`;
        }
      }
    }

    $(tooltipSelector).fadeIn().css("display", "flex");
    $(highlightSelector).addClass(`highlight highlight${step}`);

    scrollToTooltip(tooltipSelector); // Скроллим к блоку с подсказкой

    lockSteps(); //юлок шагов
    isTooltipActive = true;

    console.log(`Показ подсказки для шага ${step}`);
  }

  // Функция для скрытия подсказки
  function hideTooltip(step) {
    $(".overlay").fadeOut();

    let tooltipSelector = `#tooltip${step}`;
    let highlightSelector = `#highlight${step}`;

    if (step === 1 || step === 4) {
      if (step === 1) {
        tooltipSelector = `#tooltip${step}.hide-desktop, #tooltip${step}.hide-mobile`;
      }
      if (step === 4) {
        tooltipSelector = `#tooltip${step}.hide-desktop, #tooltip${step}.hide-mobile`;
        highlightSelector = `#highlight${step}.hide-desktop, #highlight${step}.hide-mobile`;
      }
    }

    $(tooltipSelector).fadeOut().css("display", "none");
    $(highlightSelector).removeClass(`highlight highlight${step}`);

    unlockSteps();
    isTooltipActive = false;

    console.log(`Скрытие подсказки для шага ${step}`);
  }

  function lockSteps() {
    $(".reg-stage__list .reg-stage__item").css("pointer-events", "none");
  }

  function unlockSteps() {
    $(".reg-stage__list .reg-stage__item").css("pointer-events", "auto");
  }

  function scrollToTooltip(tooltipSelector) {
    const $tooltipBlock = $(tooltipSelector).closest(".tooltip-block");

    if ($tooltipBlock.length) {
      $("html, body").animate(
        {
          scrollTop:
            $tooltipBlock.offset().top -
            ($(window).height() / 2 - $tooltipBlock.outerHeight() / 2),
        },
        500
      );
    }
  }

  $("[data-modal='r2s']").on("click", function () {
    if (!isTooltipActive) {
      currentStep = 1;
      showTooltip(currentStep);
    }
  });

  $(".tooltip-next").on("click", function () {
    if ($(this).hasClass("tooltip-end")) {
      hideTooltip(currentStep);
    } else {
      const nextStep = $(this).data("target");

      hideTooltip(currentStep);
      currentStep = nextStep;
      showTooltip(currentStep);
    }
  });

  $(".tooltip-close, .overlay").on("click", function () {
    hideTooltip(currentStep);
  });

  $(".reg-stage__list").on("click", ".reg-stage__item", function (e) {
    if (isTooltipActive) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  });
});
