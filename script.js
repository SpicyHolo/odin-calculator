// Global variables
let leftOperand = 0;
let rightOperand = undefined;
let operator = undefined;

let specialOperand = 0;
let specialMode = false;

/* References to DOM elements, add click events */
const textDisplay = document.querySelector("#calc-input");

// basic operator buttons
const basicOperatorButtons = {
    "÷": document.querySelector("#divide"),
    "×": document.querySelector("#multiply"),
    "-": document.querySelector("#subtract"),
    "+": document.querySelector("#add"),
}

for (const key in basicOperatorButtons) {
    const button = basicOperatorButtons[key];
    button.addEventListener('click', () => updateBasicOperator(key));
}

// special operator buttons
const specialOperatorButtons = {
    ".": document.querySelector("#floatingPoint"),
    "=": document.querySelector("#equals"),
}
specialOperatorButtons["="].addEventListener('click', evaluateExpression);
specialOperatorButtons["."].addEventListener('click', addDeicmalPoint);

// digit buttons
const digitButtons = (() => Array.from({length: 10}, (_, i) => ({DOM: document.querySelector(`#digit_${i}`), digit: i})))();
digitButtons.forEach((button) => button.DOM.addEventListener('click', () => updateOperands(button.digit)));

// function Buttons
const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', clearAll);

const backspaceButton = document.querySelector('#backspace');
backspaceButton.addEventListener('click', useBackspace);

/* Add keyboard support */
function keydownHelper(button, fun)
{
    button.classList.add('active');
    fun();
}

function keyUpHelper(button)
{
    button.classList.remove('active');
}

document.addEventListener('keydown', (event) => {
    if ("0123456789".includes(event.key)) // digits 0-9
        keydownHelper(digitButtons[event.key].DOM, () => updateOperands(digitButtons[event.key].digit));

    else if (event.key === "+")
        keydownHelper(basicOperatorButtons["+"], () => updateBasicOperator("+"));

    else if (event.key === "-")
        keydownHelper(basicOperatorButtons["+"], () => updateBasicOperator("-"));

    else if (event.key === "/")
        keydownHelper(basicOperatorButtons["÷"], () => updateBasicOperator("÷"));

    else if (event.key === "*")
        keydownHelper(basicOperatorButtons["×"], () => updateBasicOperator("×"));

    else if (event.key === "=" || event.key === "Enter")
        keydownHelper(specialOperatorButtons["="], evaluateExpression);

    else if (event.key === "." || event.key === ",")
        keydownHelper(specialOperatorButtons["."], addDeicmalPoint);

    else if (event.key === "Backspace" || event.key === "Delete")
        keydownHelper(backspaceButton, useBackspace);
});

document.addEventListener('keyup', (event) => {
    if ("0123456789".includes(event.key))
        keyUpHelper(digitButtons[event.key].DOM);
    
    else if (event.key === "+")
        keyUpHelper(basicOperatorButtons["+"]);

    else if (event.key === "-")
        keyUpHelper(basicOperatorButtons["+"]);

    else if (event.key === "/")
        keyUpHelper(basicOperatorButtons["÷"]);

    else if (event.key === "*")
        keyUpHelper(basicOperatorButtons["×"]);

    else if (event.key === "=" || event.key === "Enter")
        keyUpHelper(specialOperatorButtons["="]);

    else if (event.key === "." || event.key === ",")
        keyUpHelper(specialOperatorButtons["."]);

    else if (event.key === "Backspace" || event.key === "Delete")
        keyUpHelper(backspaceButton);

});


/* functions */
// Given two numbers and an operator returns the result of calculations
function operate(num1, num2, operator)
{
    const operatorFunctions = {
        '÷': (a, b) => a/b,
        '×': (a, b) => a*b,
        '-': (a, b) => a-b,
        '+': (a, b) => a+b,
    }

    // parseFloat is added, because when using "." button leftOperand/rightOperand may be a string
    return (operatorFunctions[operator])(parseFloat(num1), parseFloat(num2));
}

// on pressing any digit
function updateOperands(pressedDigit)
{
    if (operator === undefined) // Operator is undefined / empty string => update left operand
    { 
        if (leftOperand === 0) // if operand is replace 0 with the pressedDigit
            leftOperand = parseFloat(pressedDigit);
        else 
            leftOperand = parseFloat(leftOperand.toString() + pressedDigit);
    }

    else // updating right operand
    {
        if (rightOperand === undefined)
        {
            rightOperand = parseFloat(pressedDigit);
        }
        else 
        {
            rightOperand = parseFloat(rightOperand.toString() + pressedDigit);
        }
    }

    updateDisplay();
};

// on pressing any basic operator
function updateBasicOperator(pressedOperator)
{
    specialMode = false;

    if (pressedOperator === undefined) // no other operator is defined
        operator = pressedOperator;

    else if (pressedOperator !== operator) 
    {
        if (rightOperand !== undefined) // evaluates expression if rightOperand is defined and a new operator was pressed (ex. 3 + 4 - => 7 -)
            evaluateExpression();
        operator = pressedOperator;
    }

    else if (pressedOperator == operator) // if the same operator was pressed twice, enter specialMode (every '=' repeats the chosen operation with the current leftOperand and result)
    {
        specialMode = true;
        specialOperand = leftOperand;
    }

    updateDisplay();
}

// on pressing "=", evaluates curent expression
function evaluateExpression()
{
    // Copy operands, if undefined use 0 instead.
    const tempLeftOperand = (leftOperand !== undefined) ? leftOperand : 0;
    const tempRightOperand = (rightOperand !== undefined) ? rightOperand : leftOperand;

    if (operator === undefined) // if operator's undefined, nothing happens
        return;

    else if (specialMode === true) // if specialMode is enabled, evaluating means, using operator as (leftOperand OPERATOR specialOperand)
    {
        const result = operate(leftOperand, specialOperand, operator);
        leftOperand = result;
    }

    else // normal evaluation: (leftOperand OPERATOR rightOperand)
    {
        const result = operate(tempLeftOperand, tempRightOperand, operator);

        // Clear operands, operator
        operator = undefined;
        leftOperand = result;
        rightOperand = undefined;
    }

    updateDisplay();
}

// resets calculator, clears all operands, operator
function clearAll()
{
    leftOperand = 0;
    rightOperand = undefined;
    operator = undefined;

    updateDisplay();
}

// removes last digit of current operand,
function useBackspace()
{
    if (rightOperand === undefined) // if rightOperand is not defined, backspace works on leftOperand
        leftOperand = removeLastDigit(leftOperand);
    else
        rightOperand = removeLastDigit(rightOperand);

    updateDisplay();
}

// removes last digit of given operand, if there's only one digit, changes operand to 0
function removeLastDigit(operand)
{
    if (operand === 0)
        return 0;

    else
    {
        const minLength = (operand > 0) ? 1 : 2; // lenght of a string with only one digit (if number is negative, that length is 2!)
        operand = operand.toString();
        if (operand.length <= minLength) // check if there's only one digit left
            return 0;

        else // remove last digit
        {
            operand = operand.slice(0, -1);
            return parseFloat(operand);
        }
    }

}

// Adds "." (decimalPoint) to current operand
function addDeicmalPoint()
{
    if (rightOperand === undefined)
        leftOperand = addDecimalPointHelper(leftOperand)
    else 
        rightOperand = addDecimalPointHelper(rightOperand);

    updateDisplay();
}

// Adds "." (decimalPoint) to given operand, only if the number currently doesn't have it
function addDecimalPointHelper(operand)
{
    operand = operand.toString();
    if (operand.includes("."))
        return operand;
    else
        return operand + ".";

}

// Updates display of calculator with current operands and operators
function updateDisplay()
{

    // Add left operand
    textDisplay.value = leftOperand;

    // Add operator
    if (operator !== undefined)
        textDisplay.value += operator;

    // Add right operand
    if (rightOperand !== undefined)
        textDisplay.value += rightOperand;
}