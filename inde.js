//Функция генерации массива чисел
function getRange(start, end, step = 1) {
    let result = [];

    for (let i = start; i <= end; i += step) {
        result.push(i);
    }

    return result;
}

console.log(getRange(1, 15));

console.log(getRange(10, 30, 5));


//Функция переворота строки

function myReverse(str) {
    let result = "";

    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }

    return result;
}

console.log(myReverse("123456789"));


//Функция маскировки банковской карты

function maskCard(card, symbol = "X") {
    let result = "";


    for (let i = 0; i < 6; i++) {
        result += card[i];
    }

    for (let i = 6; i < card.length - 4; i++) {
        result += symbol;
    }

    for (let i = card.length - 4; i < card.length; i++) {
        result += card[i];
    }

    return result;
}

console.log(maskCard("4815154823541789"));

console.log(maskCard("4815154823541789", "*"));
