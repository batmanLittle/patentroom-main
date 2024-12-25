//ДЛЯ ИНПУТА ДАТА ВЫДАЧИ
$(document).ready(function () {
  const passportDateInput = $("#passportDate");

  // Устанавливаем плейсхолдер при загрузке страницы
  passportDateInput.attr({
    type: "text",
    placeholder: "Дата выдачи",
  });

  //  меняем тип на date
  passportDateInput.on("focus", function () {
    $(this).attr("type", "date").removeAttr("placeholder");
  });

  //  возвращаем тип на text, если значение пустое
  passportDateInput.on("blur", function () {
    if (!$(this).val()) {
      $(this).attr({
        type: "text",
        placeholder: "Дата выдачи",
      });
    }
  });
});

// Функция для переключения видимости пароля
function togglePasswordVisibility() {
  $(document).on("click", ".toggle-password", function () {
    const inputField = $(this).siblings("input.form-input");
    const eyeIcon = $(this).find("img");

    if (inputField.length && eyeIcon.length) {
      if (inputField.attr("type") === "password") {
        inputField.attr("type", "text");
        eyeIcon.attr("src", "./assets/images/icon-eye-off.svg");
      } else {
        inputField.attr("type", "password");
        eyeIcon.attr("src", "./assets/images/icon-eye.svg");
      }
    }
  });
}

$(document).ready(function () {
  togglePasswordVisibility();
});
