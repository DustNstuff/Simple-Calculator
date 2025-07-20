// Simple Calculator JavaScript
// Security note: We avoid using eval() for security reasons

let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';

// Memory feature
let memory = 0;

function appendToDisplay(value) {
    // Security: Validate input to prevent XSS
    if (typeof value !== 'string') return;
    
    // Only allow safe characters
    const allowedChars = /^[0-9+\-*/.()]$/;
    if (!allowedChars.test(value)) return;
    
    currentInput += value;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    display.value = '';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

function calculate() {
    try {
        // Security: Safe evaluation without eval()
        let result = safeEvaluate(currentInput);
        
        if (result === null) {
            display.value = 'Error';
            currentInput = '';
            return;
        }
        
        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
        currentInput = result.toString();
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
    }
}

function safeEvaluate(expression) {
    // Security: Safe mathematical evaluation
    // Remove any non-mathematical characters
    const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
    
    // Basic validation
    if (!sanitized || sanitized !== expression) {
        return null;
    }
    
    try {
        // Using Function constructor instead of eval for better security
        return Function('"use strict"; return (' + sanitized + ')')();
    } catch (e) {
        return null;
    }
}

// Memory functions
function memoryAdd() {
    const currentValue = parseFloat(display.value) || 0;
    memory += currentValue;
    alert(`Memory updated: ${memory}`);
}

function memoryRecall() {
    display.value = memory;
}

function memoryClear() {
    memory = 0;
    alert('Memory cleared');
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
    
    event.preventDefault();
});
