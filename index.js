let result = document.getElementById("result");


let student = {
    name: "Ислам",
    surname: "Исмаилов",
    group: "IT-101",
    currentMonth: 5,
    graduate: false,
    direction: "Программирование",
    completedMonths: 5
};

result.innerHTML +=
    "<h3>1. Информация о студенте</h3>" +
    "Имя: " + student.name + "<br>" +
    "Фамилия: " + student.surname + "<br>" +
    "Группа: " + student.group + "<br>" +
    "Текущий месяц обучения: " + student.currentMonth + "<br>" +
    "Выпускник: " + student.graduate + "<br>" +
    "Направление: " + student.direction + "<br>" +
    "Пройдено месяцев: " + student.completedMonths + "<hr>";


let bankAccount = {
    accountNumber: "1234567890",
    currency: "USD",
    balance: 1500,
    ownerName: "Ислам Исмаилов",
    blocked: false
};

result.innerHTML +=
    "<h3>2. Банковский счет</h3>" +
    "Номер счета: " + bankAccount.accountNumber + "<br>" +
    "Валюта: " + bankAccount.currency + "<br>" +
    "Баланс: " + bankAccount.balance + "<br>" +
    "Владелец: " + bankAccount.ownerName + "<br>" +
    "Заблокирован: " + bankAccount.blocked + "<hr>";


let firstName = prompt("Введите ваше имя:");
let lastName = prompt("Введите вашу фамилию:");

result.innerHTML +=
    "<h3>3. Приветствие</h3>" +
    "Здравствуйте, " + firstName + " " + lastName + "!<hr>";


let number1 = Number(prompt("Введите первое число:"));
let number2 = Number(prompt("Введите второе число:"));

let comparison;

if (number1 > number2) {
    comparison = "Первое число больше";
} else if (number2 > number1) {
    comparison = "Второе число больше";
} else {
    comparison = "Числа равны";
}

result.innerHTML +=
    "<h3>4. Сравнение чисел</h3>" +
    number1 + " и " + number2 + "<br>" +
    comparison + "<hr>";


let color = prompt("Введите цвет светофора:");

let traffic;

if (color === "красный") {
    traffic = "Стой!";
} else if (color === "желтый") {
    traffic = "Жди!";
} else if (color === "зеленый") {
    traffic = "Иди!";
} else {
    traffic = "Такого цвета нет";
}

result.innerHTML +=
    "<h3>5. Светофор</h3>" +
    "Цвет: " + color + "<br>" +
    "Действие: " + traffic + "<hr>";


let number = Number(prompt("Введите число от 1 до 9:"));

let roman = "";

if (number === 1) {
    roman = "I";
} else if (number === 2) {
    roman = "II";
} else if (number === 3) {
    roman = "III";
} else if (number === 4) {
    roman = "IV";
} else if (number === 5) {
    roman = "V";
} else if (number === 6) {
    roman = "VI";
} else if (number === 7) {
    roman = "VII";
} else if (number === 8) {
    roman = "VIII";
} else if (number === 9) {
    roman = "IX";
} else {
    roman = "Неверное число";
}

result.innerHTML +=
    "<h3>6. Конвертер чисел</h3>" +
    number + " → " + roman + "<hr>";

let multiplicationNumber =
    Number(prompt("Введите число от 2 до 10:"));

let table = "";

for (let i = 1; i <= 10; i++) {
    table +=
        multiplicationNumber +
        " × " +
        i +
        " = " +
        multiplicationNumber * i +
        "<br>";
}

result.innerHTML +=
    "<h3>7. Таблица умножения</h3>" +
    table +
    "<hr>";

let cards = [
    "46782346",
    "45781218",
    "79874568",
    "12157845",
    "36151845",
    "41250895",
    "41201961"
];

let visaCount = 0;

for (let i = 0; i < cards.length; i++) {
    if (cards[i][0] === "4") {
        visaCount++;
    }
}

result.innerHTML +=
    "<h3>8. Карты VISA</h3>" +
    "Карт VISA " + visaCount + " из " + cards.length + ".";
