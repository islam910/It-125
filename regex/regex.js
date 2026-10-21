const form = document.getElementById("regex-form");

const fioRegex =
    /^[А-ЯЁа-яё]+(?:-[А-ЯЁа-яё]+)?(?:\s+[А-ЯЁа-яё]+(?:-[А-ЯЁа-яё]+)?){1,2}$/;

const phoneRegex =
    /^(?:\+996|0)\s?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const fio = document.getElementById("fio").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    const fioError = document.getElementById("fio-error");
    const phoneError = document.getElementById("phone-error");
    const emailError = document.getElementById("email-error");
    const result = document.getElementById("result");

    let valid = true;

    if (fioRegex.test(fio)) {
        fioError.textContent = "ФИО введено правильно";
        fioError.style.color = "green";
    } else {
        fioError.textContent = "Введите корректное ФИО";
        fioError.style.color = "red";
        valid = false;
    }

    if (phoneRegex.test(phone)) {
        phoneError.textContent = "Номер телефона введён правильно";
        phoneError.style.color = "green";
    } else {
        phoneError.textContent = "Пример: +996 555 123 456";
        phoneError.style.color = "red";
        valid = false;
    }

    if (emailRegex.test(email)) {
        emailError.textContent = "Почта введена правильно";
        emailError.style.color = "green";
    } else {
        emailError.textContent = "Введите корректную почту";
        emailError.style.color = "red";
        valid = false;
    }

    if (valid) {
        result.textContent = "Все данные прошли проверку!";
        result.style.color = "green";
    } else {
        result.textContent = "Проверьте правильность заполнения полей";
        result.style.color = "red";
    }
});
