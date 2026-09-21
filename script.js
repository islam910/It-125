// ============================
// COUNTER
// ============================

let counterValue = 0;


// Получаем элемент с числом
const counterElement = document.getElementById("counter");


// Обновляем внешний вид счетчика
function updateCounter() {

    counterElement.textContent = counterValue;

    // Удаляем старые классы
    counterElement.classList.remove(
        "positive",
        "negative",
        "zero"
    );

    // Если число больше нуля
    if (counterValue > 0) {

        counterElement.classList.add("positive");

    }

    // Если число меньше нуля
    else if (counterValue < 0) {

        counterElement.classList.add("negative");

    }

    // Если число равно нулю
    else {

        counterElement.classList.add("zero");

    }
}


// Увеличить
function increaseCounter() {

    counterValue++;

    updateCounter();
}


// Уменьшить
function decreaseCounter() {

    counterValue--;

    updateCounter();
}


// Сбросить
function resetCounter() {

    counterValue = 0;

    updateCounter();
}


// ============================
// ЛОТО
// ============================


// Функция для случайного числа
function getRandomInt(min, max) {

    min = Math.ceil(min);

    max = Math.floor(max);

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// Генерация 6 чисел
function generateLottery() {

    // Получаем контейнер
    const container =
        document.getElementById("lotteryNumbers");

    // Очищаем предыдущие числа
    container.innerHTML = "";


    // Создаем 6 кружков
    for (let i = 0; i < 6; i++) {

        // Получаем случайное число от 1 до 99
        const number = getRandomInt(1, 99);


        // Форматируем число:
        // 5 превращается в 05
        // 25 остается 25
        const formattedNumber =
            String(number).padStart(2, "0");


        // Создаем HTML-элемент
        const ball =
            document.createElement("div");


        // Добавляем класс
        ball.classList.add("lottery-ball");


        // Записываем число внутрь кружка
        ball.textContent = formattedNumber;


        // Добавляем кружок на страницу
        container.appendChild(ball);
    }
}