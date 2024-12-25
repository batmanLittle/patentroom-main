//редактировать данные в инпуте

$(document).ready(function () {
  // Обработчик кнопки "Редактировать/Сохранить"
  $(".edit-btn").on("click", function () {
    const formBox = $(this).closest(".account-data__form-box");

    // Проверяем, что находимся в блоке с паролем
    const isPasswordBox = formBox.hasClass("account-data__password");
    const isEditing = $(this).data("editing") || false;

    if (isEditing) {
      if (isPasswordBox) {
        // Выполняем проверку совпадения нового пароля и его подтверждения
        const newPassword = formBox.find("#newPassword").val();
        const confirmPassword = formBox.find("#confirmPassword").val();

        if (newPassword !== confirmPassword) {
          formBox
            .find("#confirmPassword-error")
            .text("Пароли не совпадают")
            .css("display", "inline");
          return;
        } else {
          formBox.find("#confirmPassword-error").text("").hide();
        }

        formBox.find("#newPassword, #confirmPassword").closest("li").remove();
      }

      // Завершаем редактирование
      formBox.find(".form-input").prop("disabled", true);
      formBox.find("#password").attr("type", "password");
      formBox.find(".icon-eye").attr("src", "./assets/images/icon-eye.svg");

      $(this).find(".txt16-days").text("редактировать");
      $(this).data("editing", false);
    } else {
      // Включаем режим редактирования
      formBox.find(".form-input").prop("disabled", false);

      if (isPasswordBox) {
        formBox.find("#password").attr("type", "text");
        formBox
          .find(".icon-eye")
          .attr("src", "./assets/images/icon-eye-off.svg");

        // Добавляем поля для нового пароля и его подтверждения
        const newPasswordFields = `
            <li class="account-data__form-item">
              <label class="form-label">
                <input
                  name="newPassword"
                  id="newPassword"
                  class="form-input"
                  type="password"
                  placeholder="Новый Пароль"
                  required
                />
                <span class="error-message" id="newPassword-error"></span>
                <button type="button" class="toggle-password">
                  <img
                    src="./assets/images/icon-eye-off.svg"
                    alt="icon-eye"
                    class="icon-eye"
                  />
                </button>
              </label>
            </li>
            <li class="account-data__form-item">
              <label class="form-label">
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  class="form-input"
                  type="password"
                  placeholder="Повторите Пароль"
                  required
                />
                <span class="error-message" id="confirmPassword-error"></span>
                <button type="button" class="toggle-password">
                  <img
                    src="./assets/images/icon-eye-off.svg"
                    alt="icon-eye"
                    class="icon-eye"
                  />
                </button>
              </label>
            </li>`;

        formBox.find(".account-data__form-list").append(newPasswordFields);
      }

      $(this).find(".txt16-days").text("сохранить");
      $(this).data("editing", true);
    }
  });

  // Логика переключения видимости пароля
  $(document).on("click", ".toggle-password", function () {
    const inputField = $(this).siblings("input");
    const eyeIcon = $(this).find("img");

    if (inputField.attr("type") === "password") {
      inputField.attr("type", "text");
      eyeIcon.attr("src", "./assets/images/icon-eye-off.svg");
    } else {
      inputField.attr("type", "password");
      eyeIcon.attr("src", "./assets/images/icon-eye.svg");
    }
  });
});
