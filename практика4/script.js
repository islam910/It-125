let counterValue = 0;


const counterElement = document.getElementById("counter");


function updateCounter() {

    counterElement.textContent = counterValue;

    counterElement.classList.remove(
        "positive",
        "negative",
        "zero"
    );

    if (counterValue > 0) {

        counterElement.classList.add("positive");

    }

    else if (counterValue < 0) {

        counterElement.classList.add("negative");

    }

    else {

        counterElement.classList.add("zero");

    }
}


function increaseCounter() {

    counterValue++;

    updateCounter();
}


function decreaseCounter() {

    counterValue--;

    updateCounter();
}


function resetCounter() {

    counterValue = 0;

    updateCounter();
}

function getRandomInt(min, max) {

    min = Math.ceil(min);

    max = Math.floor(max);

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function generateLottery() {

    const container =
        document.getElementById("lotteryNumbers");

    container.innerHTML = "";


    for (let i = 0; i < 6; i++) {

        const number = getRandomInt(1, 99);



        const formattedNumber =
            String(number).padStart(2, "0");


        const ball =
            document.createElement("div");


        ball.classList.add("lottery-ball");


   
        ball.textContent = formattedNumber;


        container.appendChild(ball);
    }
}
