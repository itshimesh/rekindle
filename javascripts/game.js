const PUZZLE_DIFFICULTY = 3;
const PUZZLE_HOVER_TINT = '#009900';
//Change hover tint, border color, start triggers, and end game behaviour

var _canvas;
var _stage;

var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;

var _mouse;

var _maxWidth, _maxHeight;

function init() {
  _img = new Image();
  _img.addEventListener('load', onImage, false);
  _img.src = photoURL;
}

function onImage(e) {
  _maxWidth = $(document).width() * 0.5;
  console.log(_maxWidth);
  _maxHeight = $(document).height() * 0.5;
  if (_img.width > _maxWidth) {
    _pieceWidth = Math.floor(_maxWidth / PUZZLE_DIFFICULTY);
  } else {
    _pieceWidth = Math.floor(_img.width / PUZZLE_DIFFICULTY);
  }
  _pieceHeight = Math.floor(_img.height / PUZZLE_DIFFICULTY);
  _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
  _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
  setCanvas();
  initPuzzle();
}

function setCanvas() {
  _canvas = document.getElementById('canvas');
  _stage = _canvas.getContext('2d');
  _canvas.width = _puzzleWidth;
  _canvas.height = _puzzleHeight;
  _canvas.style.border = "1px solid black";
}

function initPuzzle() {
  _pieces = [];
  _mouse = {
    x: 0,
    y: 0
  };
  _currentPiece = null;
  _currentDropPiece = null;
  _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
  buildPieces();
}

function buildPieces() {
  var i;
  var piece;
  var xPos = 0;
  var yPos = 0;
  for (i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++) {
    piece = {};
    piece.sx = xPos;
    piece.sy = yPos;
    _pieces.push(piece);
    xPos += _pieceWidth;
    if (xPos >= _puzzleWidth) {
      xPos = 0;
      yPos += _pieceHeight;
    }
  }
  shufflePuzzle();
}

function shufflePuzzle() {
  _pieces = shuffleArray(_pieces);
  _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
  var i;
  var piece;
  var xPos = 0;
  var yPos = 0;
  for (i = 0; i < _pieces.length; i++) {
    piece = _pieces[i];
    piece.xPos = xPos;
    piece.yPos = yPos;
    _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
    _stage.strokeRect(xPos, yPos, _pieceWidth, _pieceHeight);
    xPos += _pieceWidth;
    if (xPos >= _puzzleWidth) {
      xPos = 0;
      yPos += _pieceHeight;
    }
  }
  document.onmousedown = onPuzzleClick;
}

function shuffleArray(o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function onPuzzleClick(e) {
  console.log();

  if (e.pageX || e.pageX == 0) {
    _mouse.x = e.pageX - _canvas.offsetLeft;
    _mouse.y = e.pageY - _canvas.offsetTop;
    console.log("How Y is calculated:"+e.screenY+"is the screenY");
    console.log("How Y is calculated:"+_canvas.offsetTop+"is the offset");
  } else if (e.x || e.x == 0) {
    _mouse.x = e.x - _canvas.offsetLeft;
    _mouse.y = e.y - _canvas.offsetTop;
  }
  _currentPiece = checkPieceClicked();
  if (_currentPiece != null) {
    _stage.clearRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
    _stage.save();
    _stage.globalAlpha = .9;
    _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    document.onmousemove = updatePuzzle;
    document.onmouseup = pieceDropped;
  }
}

function checkPieceClicked() {
  var i;
  var piece;
  for (i = 0; i < _pieces.length; i++) {
    piece = _pieces[i];
    if (_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)) {
      //PIECE NOT HIT
      if (i == 8) {
        console.log('mouse - x = ' + _mouse.x + 'and y = ' + _mouse.y);
        console.log('piece - x = ' + piece.xPos + 'and y = ' + piece.yPos);
        console.log('piece dim - width' + _pieceWidth + 'height' + _pieceHeight);
      }
    } else {
      console.log('HIT! - x = ' + _mouse.x + 'and y = ' + _mouse.y);
      return piece;
    }
  }
  return null;
}

function updatePuzzle(e) {
  _currentDropPiece = null;
  if (e.screenX || e.screenX == 0) {
    _mouse.x = e.screenX - _canvas.offsetLeft;
    _mouse.y = e.screenY - _canvas.offsetTop;
  } else if (e.x || e.x == 0) {
    _mouse.x = e.x - _canvas.offsetLeft;
    _mouse.y = e.y - _canvas.offsetTop;
  }
  _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
  var i;
  var piece;
  for (i = 0; i < _pieces.length; i++) {
    piece = _pieces[i];
    if (piece == _currentPiece) {
      continue;
    }
    _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    if (_currentDropPiece == null) {
      if (_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)) {
        //NOT OVER
      } else {
        _currentDropPiece = piece;
        _stage.save();
        _stage.globalAlpha = .4;
        _stage.fillStyle = PUZZLE_HOVER_TINT;
        _stage.fillRect(_currentDropPiece.xPos, _currentDropPiece.yPos, _pieceWidth, _pieceHeight);
        _stage.restore();
      }
    }
  }
  _stage.save();
  _stage.globalAlpha = .6;
  _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
  _stage.restore();
  _stage.strokeRect(_mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
}

function pieceDropped(e) {
  document.onmousemove = null;
  document.onmouseup = null;
  if (_currentDropPiece != null) {
    var tmp = {
      xPos: _currentPiece.xPos,
      yPos: _currentPiece.yPos
    };
    _currentPiece.xPos = _currentDropPiece.xPos;
    _currentPiece.yPos = _currentDropPiece.yPos;
    _currentDropPiece.xPos = tmp.xPos;
    _currentDropPiece.yPos = tmp.yPos;
  }
  resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin() {
  _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
  var gameWin = true;
  var i;
  var piece;
  for (i = 0; i < _pieces.length; i++) {
    piece = _pieces[i];
    _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    if (piece.xPos != piece.sx || piece.yPos != piece.sy) {
      gameWin = false;
    }
  }
  if (gameWin) {
    setTimeout(gameOver, 500);
  }
}

function gameOver() {
  document.onmousedown = null;
  document.onmousemove = null;
  document.onmouseup = null;

  $(".cover-heading").text("Congratulations!")
  $("#main-text").text("You solved the puzzle. Reconnect with");
  $("#again,#reconnect").fadeIn();
}