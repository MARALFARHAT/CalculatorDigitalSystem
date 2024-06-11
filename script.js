'use strict';

const html = document.querySelector('html');
const toggle = document.querySelector('.toggle');
const screen = document.getElementById('screen');
const buttons = document.querySelectorAll('.item');
const booleanSection = document.getElementById('boolean-section');
const evaluateBooleanButton = document.getElementById('evaluate-boolean');
const booleanInput = document.getElementById('boolean-input');
const booleanResult = document.getElementById('boolean-result');
const algebraSection = document.getElementById('algebra-section');
const evaluateAlgebraButton = document.getElementById('evaluate-algebra');
const algebraInput = document.getElementById('algebra-input');
const algebraResult = document.getElementById('algebra-result');
const xValueInput = document.getElementById('x-value');
const yValueInput = document.getElementById('y-value');
let expression = '';

const updateTheme = () => {
  const themeGetter = localStorage.getItem('theme');
  if (themeGetter === null) {
    return (html.classList = 'theme-1');
  }
  const themeMain = JSON.parse(themeGetter);
  html.classList = themeMain;
  toggle.id = themeMain;
};

const updateBg = (e) => {
  if (toggle.id === 'theme-1') {
    toggle.id = 'theme-2';
    html.classList = 'theme-2';
    localStorage.setItem('theme', JSON.stringify('theme-2'));
  } else if (toggle.id === 'theme-2') {
    toggle.id = 'theme-3';
    html.classList = 'theme-3';
    localStorage.setItem('theme', JSON.stringify('theme-3'));
  } else {
    toggle.id = 'theme-1';
    html.classList = 'theme-1';
    localStorage.setItem('theme', JSON.stringify('theme-1'));
  }
};

toggle.addEventListener('click', updateBg);
updateTheme();

const complement = (bin) => {
  return bin.split('').map(bit => (bit === '0' ? '1' : '0')).join('');
};

const twosComplement = (bin) => {
  let comp = complement(bin);
  let carry = 1;
  let result = '';
  for (let i = comp.length - 1; i >= 0; i--) {
    let bit = parseInt(comp[i]) + carry;
    if (bit === 2) {
      result = '0' + result;
      carry = 1;
    } else {
      result = bit.toString() + result;
      carry = 0;
    }
  }
  return result;
};
const parseBooleanExpression = (expr) => {
  expr = expr.replace(/AND/g, '&&')
             .replace(/OR/g, '||')
             .replace(/([A-Z])'/g, '!$1')
             .replace(/XOR/g, '^');

  // Convert variables (A, B, C, etc.) to true/false for testing purposes
  expr = expr.replace(/\bA\b/g, 'true')
             .replace(/\bB\b/g, 'false')
             .replace(/\bC\b/g, 'true');

  return expr;
};

const evaluateBooleanExpression = (expr) => {
  expr = parseBooleanExpression(expr);

  // Custom XOR function
  const xor = (a, b) => (a || b) && !(a && b);

  try {
    return eval(expr.replace(/\^/g, 'xor'));
  } catch {
    return 'Error';
  }
};

const evaluateAlgebraExpression = (expr, scope) => {
  try {
    return math.evaluate(expr, scope).toString();
  } catch (error) {
    return 'Error';
  }
};

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const buttonValue = e.target.innerText;
    if (buttonValue === 'RESET') {
      expression = '';
    } else if (buttonValue === '=') {
      try {
        expression = eval(expression);
      } catch {
        expression = 'Error';
      }
    } else if (buttonValue === 'x') {
      expression += '*';
    } else if (buttonValue === 'DEL') {
      expression = expression.slice(0, -1);
    } else if (buttonValue === 'BIN-DEC') {
      try {
        expression = parseInt(expression, 2).toString(10);
      } catch {
        expression = 'Error';
      }
    } else if (buttonValue === 'DEC-BIN') {
      try {
        expression = parseInt(expression, 10).toString(2);
      } catch {
        expression = 'Error';
      }
    } else if (buttonValue === 'DEC-HEX') {
      try {
        expression = parseInt(expression, 10).toString(16).toUpperCase();
      } catch {
        expression = 'Error';
      }
    } else if (buttonValue === 'HEX-DEC') {
      try {
        expression = parseInt(expression, 16).toString(10);
      } catch {
        expression = 'Error';
      }
    } else if (buttonValue === 'COMPLEMENT') {
      try {
        expression = complement(expression);
      } catch {
        expression = 'Error';
      }
    } else if (buttonValue === "2'S COMP") {
      try {
        expression = twosComplement(expression);
      } catch {
        expression = 'Error';
      }
    } else if (buttonValue === 'BOOLEAN') {
      booleanSection.style.display = booleanSection.style.display === 'none' ? 'block' : 'none';
    } else if (buttonValue === 'ALGEBRA') {
      algebraSection.style.display = algebraSection.style.display === 'none' ? 'block' : 'none';
    } else if (expression.toString().length > 11) {
      expression = expression.toString().substring(0, 12);
    } else {
      expression += buttonValue;
    }
    screen.innerHTML = expression
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  });
});

evaluateBooleanButton.addEventListener('click', () => {
  const booleanExpression = booleanInput.value.toUpperCase();
  const result = evaluateBooleanExpression(booleanExpression);
  booleanResult.innerHTML = `Result: ${result}`;
});

evaluateAlgebraButton.addEventListener('click', () => {
  const algebraExpression = algebraInput.value;
  const xValue = parseFloat(xValueInput.value) || 0;
  const yValue = parseFloat(yValueInput.value) || 0;
  const scope = { x: xValue, y: yValue };

  const result = evaluateAlgebraExpression(algebraExpression, scope);
  algebraResult.innerHTML = `Result: ${result}`;
});
