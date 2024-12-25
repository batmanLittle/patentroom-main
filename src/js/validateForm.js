class FormValidator {
  constructor(formSelector, validators) {
    this.$form = $(formSelector);
    this.validators = validators;
    this.formId = this.$form.attr("id");
    this.formInteractions = {}; // Для отслеживания взаимодействий
    this.phoneMask = null;

    this.init();
  }

  init() {
    this.setupPhoneMask();
    this.setupEventListeners();
    this.toggleSubmitButton(); // Изначально блокируем кнопку
  }

  setupPhoneMask() {
    const phoneInput = this.$form.find("#phone");
    if (phoneInput.length) {
      this.phoneMask = IMask(phoneInput[0], {
        mask: "+7 (000) 000-00-00",
      });
    }
  }

  getPhoneUnmaskedValue() {
    return this.phoneMask ? this.phoneMask.unmaskedValue : "";
  }

  toggleError(field, errorMessageId, message = "") {
    const errorField = this.$form.find(`#${errorMessageId}`);

    // Привязываем стандартный класс ошибки к инпуту
    field.toggleClass("err-form", message !== "");

    // Дополнительная логика для файлового поля
    if (field.attr("type") === "file") {
      // Находим связанный label (если есть)
      const label = this.$form.find(`label[for="${field.attr("id")}"]`);

      if (label.length) {
        label.toggleClass("upload-label-err", message !== ""); // Добавляем/убираем класс ошибки для label
      } else {
        field.closest("label").toggleClass("upload-label-err", message !== "");
      }
    }

    // Управляем сообщением об ошибке
    message ? errorField.text(message).show() : errorField.hide();
  }

  validateField(field, fieldName, force = false) {
    if (this.formInteractions[fieldName] || force) {
      const fieldValidators =
        typeof this.validators[fieldName] === "function"
          ? this.validators[fieldName](this)
          : this.validators[fieldName];

      const isRequired = field.prop("required");
      let value = field.val(); // Получаем значение поля

      // Вот эта часть — обработка файлов:
      if (field.attr("type") === "file") {
        value = ""; // Для файлов передаем пустое значение в валидацию
      } else if (field.attr("readonly")) {
        value = field.val(); // Для readonly полей значение из val
      }

      const errorMessage = this.runValidators(
        value,
        fieldValidators,
        isRequired,
        field
      );

      this.toggleError(field, `${fieldName}-error`, errorMessage);
      return !errorMessage;
    }

    return false;
  }

  runValidators(value, validators, isRequired, field) {
    if (!isRequired && value.trim() === "") return "";

    for (const { test, message } of validators) {
      if (!test(value, field)) return message; // Передаем поле field в тесты для проверки файлов
    }
    return "";
  }

  validateConsent(force = false) {
    const consentField = this.$form.find("#dataConsent");
    if (!consentField.length) return true;

    const consentChecked = consentField.is(":checked");

    if (this.formInteractions["dataConsent"] || force) {
      this.toggleError(
        consentField,
        "consent-error",
        consentChecked
          ? ""
          : "Вы должны согласиться на обработку персональных данных"
      );
    }

    return consentChecked;
  }

  checkFormValidity(force = false) {
    const fieldsToValidate = this.$form
      .find("input:visible, textarea:visible") // Учитываем только видимые поля
      .filter((_, el) => this.validators[el.id] !== undefined);

    let allFieldsValid = true;

    fieldsToValidate.each((_, input) => {
      const $input = $(input);
      const fieldIsValid = this.validateField($input, $input.attr("id"), force);

      if (!fieldIsValid) {
        allFieldsValid = false;
      }
    });

    const consentValid = this.validateConsent(force);

    const isFormValid = allFieldsValid && consentValid;

    this.toggleSubmitButton(isFormValid);
    return isFormValid;
  }

  toggleSubmitButton(isValid = false) {
    const submitButton = this.$form.find('button[type="submit"]');
    if (isValid) {
      submitButton.removeClass("button-inactive");
    } else {
      submitButton.addClass("button-inactive");
    }
  }

  setupEventListeners() {
    // Слушаем события input и blur для текстовых полей и текстовых областей
    this.$form.on("input blur", "input:visible, textarea:visible", (e) => {
      const field = $(e.target);
      const fieldName = field.attr("id");

      this.formInteractions[fieldName] = true;

      if (this.validators[fieldName]) {
        this.validateField(field, fieldName);
      }

      this.checkFormValidity();
    });

    // Слушаем изменение для поля согласия (чекбокс)
    this.$form.on("change", "#dataConsent", () => {
      this.formInteractions["dataConsent"] = true;

      this.checkFormValidity();
    });

    // Обработка изменения для файлового инпута
    this.$form.on("change", "input[type='file']", (e) => {
      const field = $(e.target);
      const fieldName = field.attr("id");

      this.formInteractions[fieldName] = true;

      if (this.validators[fieldName]) {
        this.validateField(field, fieldName);
      }

      this.checkFormValidity();
    });

    // Слушаем событие отправки формы
    this.$form.on("submit", (e) => {
      e.preventDefault();

      const isFormValid = this.checkFormValidity(true);

      if (isFormValid) {
        const modalId = this.$form.find('button[type="submit"]').data("modal");

        // Закрываем текущее модальное окно
        this.$form.closest(".modal").removeClass("modal-active");

        // Сбрасываем форму
        this.$form[0].reset();
        this.resetFormState();

        // Открываем модальное окно "Спасибо" после небольшой задержки
        if (modalId) {
          $(`#${modalId}`).addClass("modal-active");
        }
      }
    });
  }

  resetFormState() {
    this.formInteractions = {};
    this.toggleSubmitButton(false);

    if (this.phoneMask) {
      this.phoneMask.destroy();
      this.setupPhoneMask();
    }
  }
}

//для переключения форм
$(document).ready(function () {
  // Переключение секций формы
  $(".account-form-option").on("click", function (event) {
    event.preventDefault();

    const targetFormId = $(this).data("target"); // Получаем целевой блок
    const formContainer = $(this).closest(".account-form");

    // Снимаем активный класс с кнопок
    formContainer.find(".account-form-option").removeClass("active");
    $(this).addClass("active");

    // Скрываем все секции с классом account-form-block и показываем только целевую
    formContainer.find(".account-form-block").each(function () {
      const block = $(this);
      if (block.attr("id")) {
        block.hide(); // Скрываем блоки с ID
      }
    });

    formContainer.find(`.account-form-block[id="${targetFormId}"]`).show(); // Показываем целевой блок

    // Включаем чекбокс "Я самозанятый" только для блока individ
    const selfEmployedCheckbox = formContainer.find("#selfEmployed");
    if (targetFormId === "individ") {
      selfEmployedCheckbox.closest(".form-label").show(); // Показываем чекбокс
    } else {
      selfEmployedCheckbox.prop("checked", false); // Сбрасываем чекбокс
      selfEmployedCheckbox.closest(".form-label").hide(); // Скрываем чекбокс
    }
  });

  // Инициализация: показываем только первую форму, остальные скрываем только если у них есть ID
  const formContainer = $(".account-form"); // Получаем форму
  const firstOption = formContainer.find(".account-form-option").first(); // Находим первую кнопку
  firstOption.addClass("active"); // Делаем её активной
  const firstTarget = firstOption.data("target"); // Получаем её target

  formContainer.find(".account-form-block").each(function () {
    const block = $(this);
    if (block.attr("id") && block.attr("id") !== firstTarget) {
      block.hide(); // Скрываем только блоки с ID
    }
  });

  formContainer.find(`.account-form-block[id="${firstTarget}"]`).show(); // Показываем первую связанную секцию
});

//переключение и собирание инфы с левого блока r1s
$(document).ready(function () {
  $(".r1s__left-btn").on("click", function (event) {
    event.preventDefault();

    const targetFormId = $(this).data("target");
    const formContainer = $(this).closest(".r1s__left");

    // Сбрасываем активность со всех кнопок и восстанавливаем их изображения
    formContainer.find(".r1s__left-btn").each(function () {
      $(this).removeClass("active");
      const imgElements = $(this).find("img");
      imgElements.eq(0).hide(); // Скрываем активное изображение
      imgElements.eq(1).show(); // Показываем неактивное изображение
    });

    // Устанавливаем активность на текущую кнопку
    $(this).addClass("active");
    const currentImgElements = $(this).find("img");
    currentImgElements.eq(0).show(); // Показываем активное изображение
    currentImgElements.eq(1).hide(); // Скрываем неактивное изображение

    // Скрываем все формы и показываем только целевую
    formContainer.find(".r1s__left-form").hide();
    $(`#${targetFormId}`).show();
  });

  // Инициализация: показываем первую кнопку и связанную с ней форму
  const firstButton = $(".r1s__left-btn.active");
  const firstTarget = firstButton.data("target");
  $(`#${firstTarget}`).show();
});

//ошибки для валидации
const validationRules = {
  login: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[a-zA-Z0-9._-]+$/.test(val),
      message:
        "Логин может содержать только латинские буквы, цифры, точки, дефисы и подчеркивания",
    },
    {
      test: (val) => val.length >= 5,
      message: "Логин должен содержать не менее 5 символов",
    },
    {
      test: (val) => val.length <= 20,
      message: "Логин не должен превышать 20 символов",
    },
  ],
  password: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => val.length >= 8,
      message: "Пароль должен содержать не менее 8 символов",
    },
    {
      test: (val) => /[A-Z]/.test(val),
      message: "Пароль должен содержать хотя бы одну заглавную букву",
    },
    {
      test: (val) => /[a-z]/.test(val),
      message: "Пароль должен содержать хотя бы одну строчную букву",
    },
    {
      test: (val) => /[0-9]/.test(val),
      message: "Пароль должен содержать хотя бы одну цифру",
    },
    {
      test: (val) => /[\W_]/.test(val),
      message: "Пароль должен содержать хотя бы один специальный символ",
    },
  ],
  applicantAddressTranslit: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[A-Za-z0-9\s\.,\-()]+$/.test(val),
      message:
        "Транслитерация адреса должна содержать только латинские буквы, цифры и символы (,.-())",
    },
    {
      test: (val) => val.length <= 150,
      message: "Адрес не должен превышать 150 символов",
    },
  ],
  imageUpload: [
    {
      test: (val, field) => field[0].files.length > 0,
      message: "Файл обязателен для загрузки",
    },
    {
      test: (val, field) => {
        if (field[0].files.length > 0) {
          const file = field[0].files[0];
          return file.size <= 10 * 1024 * 1024; // 10 МБ
        }
        return true; // Если файла нет, пропускаем эту проверку
      },
      message: "Файл должен быть не больше 10МБ",
    },
    {
      test: (val, field) => {
        if (field[0].files.length > 0) {
          const file = field[0].files[0];
          return ["image/jpeg", "image/png"].includes(file.type);
        }
        return true; // Если файла нет, пропускаем эту проверку
      },
      message: "Файл должен быть в формате JPEG или PNG",
    },
  ],
  applicantNameTranslit: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[A-Za-z0-9\s\.,\-()]+$/.test(val),
      message:
        "Транслитерация наименования заявителя должна содержать только латинские буквы, цифры и символы (,.-())",
    },
    {
      test: (val) => val.length <= 100,
      message: "Транслитерация наименования не должна превышать 100 символов",
    },
  ],

  applicantName: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁё0-9\s\.,\-()]+$/.test(val),
      message:
        "Наименование заявителя должно содержать только буквы, цифры, пробелы и специальные символы (,.-())",
    },
    {
      test: (val) => val.length <= 100,
      message: "Наименование заявителя не должно превышать 100 символов",
    },
  ],

  fullRepresentativeName: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/.test(val),
      message: "ФИО должно содержать три слова: Фамилия Имя Отчество",
    },
  ],

  phone: function (formInstance) {
    return [
      {
        test: () => formInstance.getPhoneUnmaskedValue().length > 0,
        message: "Это поле обязательно",
      },
      {
        test: () => formInstance.getPhoneUnmaskedValue().length === 10,
        message: "Телефон должен содержать 10 цифр",
      },
    ];
  },
  name: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁёA-Za-z\s]+$/.test(val),
      message: "Имя должно состоять только из букв",
    },
  ],
  email: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
      message: "Неверный формат email",
    },
  ],
  question: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => val.length >= 10,
      message: "Вопрос должен содержать не менее 10 символов",
    },
    {
      test: (val) => val.length <= 300,
      message: "Вопрос не должен превышать 100 символов",
    },
  ],
  surname: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁё\s]+$/.test(val),
      message: "Фамилия должна содержать только буквы",
    },
  ],
  patronymic: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁё\s]+$/.test(val),
      message: "Отчество должно содержать только буквы",
    },
  ],
  fullName: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-ЯЁ][а-яё]+\s[А-ЯЁ]\.[А-ЯЁ]\.$/.test(val),
      message: "ФИО должно быть в формате: Фамилия И.О.",
    },
  ],
  registrationAddress: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
  ],
  postalAddress: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
  ],
  issuedBy: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁёA-Za-z\s]+$/.test(val),
      message: "Кем выдан должно содержать только буквы и пробелы",
    },
  ],
  passportSeries: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{4}$/.test(val),
      message: "Серия паспорта должна содержать 4 цифры",
    },
  ],
  passportNumber: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{6}$/.test(val),
      message: "Номер паспорта должен содержать 6 цифр",
    },
  ],
  passportDate: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
      message: "Дата должна быть в формате ГГГГ-ММ-ДД",
    },
  ],
  departmentCode: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{3}-\d{3}$/.test(val),
      message: "Код подразделения должен быть в формате 000-000",
    },
  ],
  snils: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{3}-\d{3}-\d{3} \d{2}$/.test(val),
      message: "СНИЛС должен быть в формате 000-000-000 00",
    },
  ],
  inn: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{10}$|^\d{12}$/.test(val),
      message: "ИНН должен содержать 10 или 12 цифр",
    },
  ],
  bankName: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁёA-Za-z0-9\s,.-]+$/.test(val),
      message:
        "Название банка может содержать только буквы, цифры и символы ,.-",
    },
  ],
  bik: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{9}$/.test(val),
      message: "БИК должен содержать 9 цифр",
    },
  ],
  accountNumber: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{20}$/.test(val),
      message: "Расчетный счет должен содержать 20 цифр",
    },
  ],
  ogrnip: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{15}$/.test(val),
      message: "ОГРНИП должен содержать 15 цифр",
    },
  ],
  kpp: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{9}$/.test(val),
      message: "КПП должен содержать 9 цифр",
    },
  ],
  organization: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁёA-Za-z0-9\s]+$/.test(val),
      message:
        "Наименование компании может содержать только буквы, цифры и пробелы",
    },
  ],
  representative: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁё\s]+$/.test(val),
      message: "Поле должно содержать только буквы",
    },
  ],
  basedOn: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^[А-Яа-яЁёA-Za-z0-9\s,.-]+$/.test(val),
      message: "Поле может содержать только буквы, цифры и символы ,.-",
    },
  ],
  ogrn: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d{13}$/.test(val),
      message: "ОГРН должен содержать 13 цифр",
    },
  ],
  regNumber: [
    { test: (val) => val.trim() !== "", message: "Это поле обязательно" },
    {
      test: (val) => /^\d+$/.test(val),
      message: "Поле должно содержать только цифры",
    },
  ],
};

// Использование:  форма "form-reg-stage"
$(document).ready(() => {
  const formValidators = {
    organization: validationRules.organization,
    ogrn: validationRules.ogrn,
    registRusAddress: validationRules.registrationAddress,
    registrIPAddress: validationRules.registrationAddress,
    registrationAddress: validationRules.registrationAddress,
    registrationAddressIntl: validationRules.registrationAddress,
    servRus: validationRules.question,
    servLegal: validationRules.question,
    servEntrepr: validationRules.question,
    servIntl: validationRules.question,
    fullRepresentativeName: validationRules.fullRepresentativeName,
    ogrnip: validationRules.ogrnip,
    snils: validationRules.snils,
    inn: validationRules.inn,
    surname: validationRules.surname,
    name: validationRules.name,
    patronymic: validationRules.patronymic,
    applicantName: validationRules.applicantName,
    applicantNameTranslit: validationRules.applicantNameTranslit,
    imageUpload: validationRules.imageUpload,
    imageUpload2: validationRules.imageUpload,
    applicantAddressTranslit: validationRules.applicantAddressTranslit,
    trademarkName: validationRules.name,
    trademarkName2: validationRules.name,
  };

  new FormValidator("#form-reg-stage", formValidators);
});

// Использование:  форма support
$(document).ready(() => {
  const formValidators = {
    phone: validationRules.phone,
    name: validationRules.name,
    email: validationRules.email,
    question: validationRules.question,
  };

  new FormValidator("#form-support", formValidators);
});

// Использование:  форма договора(form-agr)
$(document).ready(() => {
  const formValidators = {
    surname: validationRules.surname,
    name: validationRules.name,
    patronymic: validationRules.patronymic,
    fullName: validationRules.fullName,
    registrationAddress: validationRules.registrationAddress,
    postalAddress: validationRules.registrationAddress,
    issuedBy: validationRules.issuedBy,
    passportSeries: validationRules.passportSeries,
    passportNumber: validationRules.passportNumber,
    passportDate: validationRules.passportDate,
    departmentCode: validationRules.departmentCode,
  };

  new FormValidator("#form-agr", formValidators);
});

// Использование:  форма партнерская программа(form-partner)
$(document).ready(() => {
  const formValidators = {
    entrSurname: validationRules.surname,
    surname: validationRules.surname,
    name: validationRules.name,
    entrName: validationRules.surname,
    patronymic: validationRules.patronymic,
    entrPatronymic: validationRules.patronymic,
    snils: validationRules.snils,
    inn: validationRules.inn,
    legalInn: validationRules.inn,
    entrInn: validationRules.inn,
    registrationAddress: validationRules.registrationAddress,
    legalAddress: validationRules.registrationAddress,
    entrAddress: validationRules.registrationAddress,
    passportSeries: validationRules.passportSeries,
    passportNumber: validationRules.passportNumber,
    passportDate: validationRules.passportDate,
    issuedBy: validationRules.issuedBy,
    ogrn: validationRules.ogrn,
    bankName: validationRules.bankName,
    bik: validationRules.bik,
    accountNumber: validationRules.accountNumber,
    ogrnip: validationRules.ogrnip,
    kpp: validationRules.kpp,
    organization: validationRules.organization,
    representative: validationRules.representative,
    basedOn: validationRules.basedOn,
  };

  new FormValidator("#form-partner", formValidators);
});

//Использование: форма подписки (form-nl)
$(document).ready(() => {
  const formValidators = {
    email: validationRules.email,
  };

  new FormValidator("#form-nl", formValidators);
});

//Использование: форма логина(form-signin)
$(document).ready(() => {
  const formValidators = {
    login: validationRules.login,
    password: validationRules.password,
  };

  new FormValidator("#form-signin", formValidators);
});

//Использование: форма логина(form-signup)
$(document).ready(() => {
  const formValidators = {
    name: validationRules.name,
    email: validationRules.email,
    phone: validationRules.phone,
  };

  new FormValidator("#form-signup", formValidators);
});

//Использование: форма логина(form-password)
$(document).ready(() => {
  const formValidators = {
    email: validationRules.email,
  };

  new FormValidator("#form-password", formValidators);
});

//Использование: форма регистрационный номер(form-reg-number)
$(document).ready(() => {
  const formValidators = {
    regNumber: validationRules.regNumber,
  };

  const formSelectors = [
    "#form-reg-number",
    "#form-reg-number-2",
    "#form-reg-number-3",
  ];

  formSelectors.forEach((formSelector) => {
    new FormValidator(formSelector, formValidators);
  });
});

//Использование: форма логина(form-recomm)
$(document).ready(() => {
  const formValidators = {
    recomm: validationRules.question,
  };

  const formSelectors = ["#form-recomm", "#form-recomm2"];

  formSelectors.forEach((formSelector) => {
    new FormValidator(formSelector, formValidators);
  });
});
