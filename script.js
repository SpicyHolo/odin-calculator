/* References to DOM elements */

const textDisplay = document.querySelector("#calc-input");

// operators
const basicOperatorButtons = {
    divide:        {DOM: document.querySelector("#divide"),        symbol: "/"},
    multiply:      {DOM: document.querySelector("#multiply"),      symbol: "*"},
    subtract:      {DOM: document.querySelector("#subtract"),      symbol: "-"},
    add:           {DOM: document.querySelector("#add"),           symbol: "+"},
}

const specialOperatorButtons = {
    floatingPoint: {DOM: document.querySelector("#floatingPoint"), symbol: "."},
    equals:        {DOM: document.querySelector("#equals"),        symbol: "="},
}

// digits
const digitButtons = (() => Array.from({length: 10}, (_, i) => ({DOM: document.querySelector(`#digit_${i}`), digit: i})))();

// function Buttons
const clearButton = document.querySelector('#clear');
const backspaceButton = document.querySelector('#backspace');

/* Button click events */

// digit buttons
digitButtons.forEach((button) => button.DOM.addEventListener('click', () => textDisplay.value += button.digit));

// Operator buttons
for (const key in basicOperatorButtons) {
    const button = basicOperatorButtons[key];
    button.DOM.addEventListener('click', () => textDisplay.value += button.symbol);
}

for (const key in specialOperatorButtons) {
    const button = specialOperatorButtons[key];
    button.DOM.addEventListener('click', () => textDisplay.value += button.symbol);
}


clearButton.addEventListener('click', () => textDisplay.value = "");
backspaceButton.addEventListener('click', () => textDisplay.value = textDisplay.value.slice(0, -1));


function operate(num1, num2, operator)
{
    const operatorFunctions = {
        '/': (a, b) => a/b,
        '*': (a, b) => a*b,
        '-': (a, b) => a-b,
        '+': (a, b) => a+b,
    }

    return (operatorFunctions[operator])(num1, num2);
}