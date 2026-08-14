// Application Runtime State
const display = document.getElementById('display');
const themeToggle = document.getElementById('theme-toggle');
let shouldResetDisplay = false; // Flag to reset display on fresh numbers input after evaluation

// ==================== ENGINE COMPUTATION PIPELINES ====================
function appendValue(val) {
    // If a calculation was just completed, typing a new number should replace it instead of appending
    if (shouldResetDisplay) {
        if (!isNaN(val) || val === '.') {
            display.value = '';
        }
        shouldResetDisplay = false;
    }

    // Guard constraint: Block entering multiple sequential floating points
    if (val === '.' && display.value.split(/[\+\-\*\/]/).pop().includes('.')) {
        return;
    }

    // Replace fallback initial zero state safely
    if (display.value === '0' && val !== '.') {
        display.value = val;
    } else {
        display.value += val;
    }
}

function clearDisplay() {
    display.value = '';
    shouldResetDisplay = false;
}

function deleteLastChar() {
    display.value = display.value.slice(0, -1);
}

function processCalculation() {
    let expression = display.value;
    if (!expression) return;

    try {
        // Sanitize the text input string down to approved mathematical character syntax structures only
        const sanitizedExpression = expression.replace(/[^0-9\+\-\*\/\.]/g, '');
        
        // Execute math calculation parsing safely using standard Function constructors instead of raw global eval()
        const result = new Function(`return (${sanitizedExpression})`)();
        
        if (result === undefined || isNaN(result) || !isFinite(result)) {
            display.value = 'Error';
        } else {
            // Trim float points if precision goes excessively wide
            display.value = Number(result.toFixed(8)).toString();
        }
        shouldResetDisplay = true;
    } catch (err) {
        display.value = 'Error';
        shouldResetDisplay = true;
    }
}

// ==================== EVENT ROUTER LISTENERS ====================

// Click handlers for UI Grid buttons
document.querySelector('.buttons').addEventListener('click', (e) => {
    const target = e.target;
    if (!target.matches('button')) return;

    const val = target.getAttribute('data-val');
    const action = target.getAttribute('data-action');

    if (val) appendValue(val);
    if (action === 'clear') clearDisplay();
    if (action === 'delete') deleteLastChar();
    if (action === 'calculate') processCalculation();
});

// Full native physical keyboard sync mapping
document.addEventListener('keydown', (e) => {
    const validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/'];
    
    if (validInputs.includes(e.key)) {
        e.preventDefault();
        appendValue(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        processCalculation();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLastChar();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        clearDisplay();
    }
});

// ==================== COLOR THEME MANAGEMENT ====================
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.querySelector('.mode-icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
});