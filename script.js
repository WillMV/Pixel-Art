const color = document.getElementsByClassName('color');
const pixel = document.getElementsByClassName('pixel');
const pixelRow = document.getElementsByClassName('pixel-row')
const pixelBoard = document.getElementById('pixel-board');
const clearBoard = document.getElementById('clear-board');
const hasBorder = document.getElementById('has-border');
const input = document.getElementById('board-size');
const boardBtn = document.getElementById('generate-board');
const colorPalette = document.getElementById('color-palette');
const colorButton = document.getElementById('button-random-color');
const HEX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

color[0].style.backgroundColor = 'black';
color[1].style.backgroundColor = 'red';
color[2].style.backgroundColor = 'green';
color[3].style.backgroundColor = 'blue';

let isMousePressed = false

function restoreColorPalette() {
  if (localStorage.colorPalette) {
    const palette = JSON.parse(localStorage.colorPalette);
    for (let i = 1; i < color.length; i += 1) {
      color[i].style.backgroundColor = palette[i - 1];
    }
  }
}

function colorSelector(event) {
  if (event.target.className === 'color') {
    for (let index = 0; index < color.length; index += 1) {
      color[index].className = 'color';
    }
    event.target.classList = [`${event.target.className} selected`];
  }
}

function saveBoard(event) {
  let colors = [];
  if (localStorage.pixelBoard) {
    colors = JSON.parse(localStorage.pixelBoard);
  }
  for (let index = 0; index < pixel.length; index += 1) {
    if (pixel[index] === event.target) {
      colors[index] = pixel[index].style.backgroundColor;
    }
  }
  localStorage.pixelBoard = JSON.stringify(colors);
}

function restoreColorBoard() {
  let colors = [];
  if (localStorage.pixelBoard) {
    colors = JSON.parse(localStorage.pixelBoard);
    for (let index = 0; index < pixel.length; index += 1) {
      pixel[index].style.backgroundColor = colors[index];
    }
  }
}

function removeBoard() {
  const rowLength = pixelRow.length;
  for (let index = 0; index < rowLength; index += 1) {
    pixelBoard.removeChild(pixelRow[0]);
  }
}

function createPixel(column) {
  const className = hasBorder.checked
    ? 'pixel border'
    : 'pixel';
  for (let index = 0; index < input.value; index++) {
    const div = document.createElement('div');
    div.className = className;
    // div.draggable = false
    column.appendChild(div);
  }
}

function createRow() {
  const div = document.createElement('div');
  div.className = 'pixel-row';
  pixelBoard.appendChild(div);
  createPixel(div)
}

function newBoard() {
  localStorage.boardSize = JSON.stringify(input.value);
  if (input.value > 1 && input.value <= 128) {
    removeBoard();
    for (let index = 0; index < input.value; index += 1) {
      createRow();
    }
    restoreColorBoard();
    restoreColorPalette();
  } else {
    alert('Board inválido!');
  }
}

function paint(event) {
  const className = hasBorder.checked
    ? 'pixel border'
    : 'pixel';
  const selected = document.querySelector('.selected');
  if (event.target.className === className) {
    event.target.style.backgroundColor = selected.style.backgroundColor;
    saveBoard(event);
  }
}

function selectColor() {
  let hexKey = '#';
  for (let i = 0; i < 6; i += 1) {
    const index = Math.floor(Math.random() * HEX.length);
    hexKey += HEX[index];
  }
  return hexKey;
}

function colorGenerator() {
  const setPalette = [];
  for (let index = 1; index < color.length; index += 1) {
    color[index].style.backgroundColor = selectColor();
    setPalette[index - 1] = color[index].style.backgroundColor;
  }
  localStorage.colorPalette = JSON.stringify(setPalette);
}

function clearAll() {
  for (let index = 0; index < pixel.length; index += 1) {
    pixel[index].style.backgroundColor = 'white';
  }
  localStorage.removeItem('pixelBoard');
}

function handleMouseMove(event) {
  if (isMousePressed) {
    paint(event)
  }
}

function handleMouseDown() {
  isMousePressed = true
}

function handleMouseUp() {
  isMousePressed = false
}

if (localStorage.boardSize) {
  input.value = JSON.parse(localStorage.boardSize);
  newBoard();
} else {
  input.value = 5
  newBoard();
}

this.addEventListener('mousedown', handleMouseDown)
this.addEventListener('mouseup', handleMouseUp)
this.addEventListener('mouseleave', handleMouseUp)
colorPalette.addEventListener('click', colorSelector);
clearBoard.addEventListener('click', clearAll);
pixelBoard.addEventListener('mousemove', handleMouseMove)
colorButton.addEventListener('click', colorGenerator);
hasBorder.addEventListener('click', newBoard)

boardBtn.addEventListener('click', () => {
  localStorage.removeItem('pixelBoard');
  newBoard()
});


