//Score
var score;
var numberOfPegs;

//Object of Peg
var selectedPeg = { x: undefined, y: undefined };

//Creation of pegs 
var createId = function (rowN, colN) 
{
  return 'peg-' + rowN + '-' + colN;
}

//Dynamic id
var getPositionFromId = function (id) {
  var idParts = id && id.length ? id.split('-') : [];
  if (idParts.length === 3) {
    return {x: parseInt(idParts[1]),y: parseInt(idParts[2])};
  }
  return {};
}

// Generate functional board
var generateCell = function (cell, rowN, colN) {
  var html = '<button id="' + createId(rowN, colN) + '" class="';
  if (cell && cell.value) {
    html += 'peg';
  }
  else if (cell && cell.value === 0) {
    html += 'hole';
  }
  else {
    html += 'hidden';
  }
  html += '"></button>';
  return html;
}

var generateRow = function (row, rowN) {
  var html = '<ul>';
  for (var j = 0; j < row.length; j++) {
    html += generateCell(row[j], rowN, j);
  }
  html += '</ul>';
  return html;
}

var generateBoard = function (board) {
  var html = '';
  for (var i = 0; i < board.length; i++) {
    html += generateRow(board[i], i);
  }
  return html;
}

//Non-selected peg function
var unselectPeg = function () {
  if (selectedPeg.x !== undefined && selectedPeg.y !== undefined) {
    var prevSelectedId = createId(selectedPeg.x, selectedPeg.y);
    document.getElementById(prevSelectedId).className = 'peg';
  }
}

// Function to return a specify element
var getElement = function (id) {
  var element = document.getElementById(id);
  return element || {};
}

// Function to solve the problem that the suggestions not dissappear when there are more than one
var hideRecommendation = function () {
  var suggestions = document.getElementsByClassName('suggestion');
  while (suggestions.length > 0) {
    for (var i = 0; i < suggestions.length; i++) {
      suggestions[i].className = 'hole';
    }
  }
}

// Function to list move recommendations for a ball
var searchRecommendations = function(myBall){
  var suggestions = [];
  var near = {
    above:  getElement(createId(myBall.x-1,myBall.y)),
    right:  getElement(createId(myBall.x,myBall.y+1)),
    below:  getElement(createId(myBall.x+1,myBall.y)),
    left:   getElement(createId(myBall.x,myBall.y-1))
  };
  var possible = {
      above:  getElement(createId(myBall.x-2,myBall.y)),
      right:  getElement(createId(myBall.x,myBall.y+2)),
      below:  getElement(createId(myBall.x+2,myBall.y)),
      left:   getElement(createId(myBall.x,myBall.y-2))
  };
  if (near.above.className === 'peg' && possible.above.className === 'hole') {
    suggestions.push(possible.above);
  }
  if (near.right.className === 'peg' && possible.right.className === 'hole') {
    suggestions.push(possible.right);
  }
  if (near.below.className === 'peg' && possible.below.className === 'hole') {
    suggestions.push(possible.below);
  }
  if (near.left.className === 'peg' && possible.left.className === 'hole') {
    suggestions.push(possible.left);
  }
  return suggestions;
}

//Function to count if there are any possible move
var countRecommendations = function () {
  var ballPlaces = document.getElementsByClassName('peg');
  var winner = document.getElementById('winner');
  for (var i = 0; i < ballPlaces.length; i++) {
    var thisBall = getPositionFromId(ballPlaces[i].id);
    var suggestions = searchRecommendations(thisBall);
    if (suggestions.length > 0) {
      return {};
    }
  }
  if(winner.textContent !== 'YOU WON THE GAME'){
    winner.textContent = 'GAME OVER: NO MORE POSSIBLE MOVES.';
    showRankingDiv(true,'YOUR SCORE'+' '+ score);
  }
}

// Move pegs functions and score with peg-counter
//Choosing the Peg , if it is a peg , is a selected peg or it is a suggestion
var choosePeg = function (evt) {
  var ball = evt.target;
  var ballClass = ball.className;
  unselectPeg();
  hideRecommendation();
  if (ballClass === 'peg') {
    selectPeg(ball);
  }
  else if (ballClass === 'selected') {
    selectedPeg.x = undefined;
    selectedPeg.y = undefined;
  }
  else if (ballClass === 'suggestion') {
    moveBall(ball);
   countRecommendations();
  }
}

//Execute the movement
var moveBall = function (ball) {
  ball.className = 'peg';
  var prevSelectedId = createId(selectedPeg.x, selectedPeg.y);
  var refreshScore = document.getElementById('score');
  var winner = document.getElementById('winner');
  var counter = document.getElementById('pegs-remaining');
  document.getElementById(prevSelectedId).className = 'hole';
  var id = getPositionFromId(ball.id);
  if (id.x > selectedPeg.x) {
    var middleBall = createId(selectedPeg.x + 1, selectedPeg.y);
  }
  else if (id.x < selectedPeg.x) {
    var middleBall = createId(selectedPeg.x - 1, selectedPeg.y);
  }
  else if (id.y > selectedPeg.y) {
    var middleBall = createId(selectedPeg.x, selectedPeg.y + 1);
  }
  else if (id.y < selectedPeg.y) {
    var middleBall = createId(selectedPeg.x, selectedPeg.y - 1);
  }
  document.getElementById(middleBall).className = 'hole';
  selectedPeg.x = undefined;
  selectedPeg.y = undefined;
  score += 100;
  refreshScore.textContent = 'SCORE' +'  '+ score;
  numberOfPegs = numberOfPegs - 1;
  counter.textContent = 'PEGS' +'  '+ numberOfPegs; 
  if (numberOfPegs === 1) {
    if (id.x == 3 && id.y == 3){
      winner.textContent = 'YOU WON THE GAME';
      showRankingDiv(true,'YOUR SCORE'+' '+ score);
    }
    else{
      winner.textContent = 'GAME OVER:THE LAST BALL IS NOT IN THE CENTER '
      showRankingDiv(true,'YOUR SCORE'+' '+ score);
    }
  }
}

// Posibbles movements and Count possibles movements
var showRecommendations = function () {
  var near = {
    above: getElement(createId(selectedPeg.x - 1, selectedPeg.y)),
    left: getElement(createId(selectedPeg.x, selectedPeg.y - 1)),
    right: getElement(createId(selectedPeg.x, selectedPeg.y + 1)),
    below: getElement(createId(selectedPeg.x + 1, selectedPeg.y)),
  }
  var possible = {
    above: getElement(createId(selectedPeg.x - 2, selectedPeg.y)),
    left: getElement(createId(selectedPeg.x, selectedPeg.y - 2)),
    right: getElement(createId(selectedPeg.x, selectedPeg.y + 2)),
    below: getElement(createId(selectedPeg.x + 2, selectedPeg.y)),
  }
  if (near.above.className === 'peg' && possible.above.className === 'hole') {
    possible.above.className = 'suggestion';
  }
  if (near.left.className === 'peg' && possible.left.className === 'hole') {
    possible.left.className = 'suggestion';
  }
  if (near.right.className === 'peg' && possible.right.className === 'hole') {
    possible.right.className = 'suggestion';
  }
  if (near.below.className === 'peg' && possible.below.className === 'hole') {
    possible.below.className = 'suggestion';
  }
}
var thisBall = { x: undefined, y: undefined }
var selectPeg = function (peg) {
var idparts = getPositionFromId(peg.id);
selectedPeg.x = idparts.x;
selectedPeg.y = idparts.y;
peg.className = 'selected';
showRecommendations(); 
}

//Pegs handler
var addPegsEventHandlers = function (pegs) {
  for (var i = 0; i < pegs.length; i++) {
   pegs[i].onclick = choosePeg;
  }
}

//MENU

//Reset
var resetBoard = function () {
 //Initializing array that represents a board
var board = [
  [, , { value: 1 }, { value: 1 }, { value: 1 }, ,,],
  [, , { value: 1 }, { value: 1 }, { value: 1 }, ,,],
  [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
  [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
  [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
  [, , { value: 1 }, { value: 1 }, { value: 1 }, ,,],
  [, , { value: 1 }, { value: 1 }, { value: 1 }, ,,]
]
  var boardReseted = document.getElementById('board');
  boardReseted.innerHTML = generateBoard(board);
  var winner = document.getElementById('winner');
  var pegsss = boardReseted.getElementsByTagName('button');
  addPegsEventHandlers(pegsss);
  score = 0;
  var putScore = document.getElementById('score');
  putScore.textContent = 'SCORE' +'  '+ score;
  numberOfPegs = 32;
  var counter = document.getElementById('pegs-remaining');
  counter.textContent = 'PEGS' +'  '+ numberOfPegs; 
  winner.textContent = 'PEG SOLITAIRE';
}

//Save the game
var boardValues = function () {
  var currentBoard = [];
  var myBoard = document.getElementById('board');
  var myUls = myBoard.getElementsByTagName('ul');
   for (var i = 0; i < myUls.length; i++) {
    var myUl = [];
    var myButtons = myUls[i].getElementsByTagName('button');
    for (var j = 0; j < myButtons.length; j++) {
      if (myButtons[j].className === 'peg' || myButtons[j].className === 'selected') 
      { myUl.push({ value: 1 }); }
      else if (myButtons[j].className === 'hole' || myButtons[j].className === 'suggestion') { myUl.push({ value: 0 }); }
      else { myUl.push(undefined); }
    } currentBoard.push(myUl);
  }
  return currentBoard;
}

var savePegs = function (){
  //Saving an object of name "game" with the attributes : board,score and number of pegs 
  var game = {board:boardValues(),Score:score,Pegs:numberOfPegs};
  localStorage.setItem('savefile', JSON.stringify(game));
} 

// Load Game
var LoadPegs = function () {
  var savedGame = JSON.parse(localStorage.getItem('savefile'));
  var loadedBoard = document.getElementById('board');
  loadedBoard.innerHTML = generateBoard(savedGame.board);
  var loadedScore = document.getElementById('score');
  loadedScore.textContent = 'SCORE' +'  '+ savedGame.Score;
  var loadedPegs = document.getElementById('pegs-remaining');
  loadedPegs.textContent = 'PEGS' +' '+ savedGame.Pegs; 
  var balls = loadedBoard.getElementsByTagName('button');
  score = parseInt(savedGame.Score);
  numberOfPegs = savedGame.Pegs;
  addPegsEventHandlers(balls);
 }

// HighScores
var viewRanking = function(){
  var rankingDiv = getElement('ranking');
  rankingDiv.className = 'diplay-block';
  var header = getElement('ranking-header');
  header.innerText = 'RANKING';
  var userData = getElement('user-data');
  userData.className = 'display-none';
  var userRank = getElement('user-rank');  
  userRank.className = 'display-block';
  var close = getElement('close-ranking-button');
  close.onclick = closeRankingDiv;
  userRank.innerHTML = usersPoints();
} 

// Show Higscores and names
var closeRankingDiv = function(){
   var rankingDiv = getElement('ranking');
   rankingDiv.className = 'display-none';
   var ListPlayers = getElement('user-rank');
   ListPlayers.className = 'display-none';
}

//Function to get date
function getDate() {
  var date = new Date();
  var yyyy = date.getFullYear();
  var dd = date.getDate();
  var mm = (date.getMonth() + 1);
  //Puts the 0 for the numbers below 2 digits
  if (dd < 10) {
      dd = '0' + dd;
  }
  if (mm < 10) {
      mm = '0' + mm;
  }
  var currentDay = yyyy + '-' + mm + '-' + dd
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  //Puts the 0 for the numbers below 2 digits
  if (hours < 10) {
      hours = '0' + hours;
  }
  if (minutes < 10) {
      minutes = '0' + minutes;
  }
  if (seconds < 10) {
      seconds = '0' + seconds;
  }
  return currentDay;
}

//Saving players skills
var savePoints = function (userName) {
  var points = score;
  var dateToday = getDate();
  var userRank = document.getElementById('user-rank');
   //Validations
  if (userName == '') {
     alert('Debes ingresar tu nickname');
     return {};
  }
  if(userName.length < 3){
    alert('El nombre debe tener mas de tres caracteres');
     return {};
  }
  if (userName.length > 12) {
    alert('El nombre debe tener menos de doce caracteres');
     return {};
  }
  //Creating an array which will contain: username, points in game and date
  if (!localStorage.getItem('RankingPlayer')) {
      localStorage.setItem('RankingPlayer', '[]');
  }
  var RankingPlayer = JSON.parse(localStorage.getItem('RankingPlayer'));
  RankingPlayer.push({ date: dateToday.toString(),userName: userName, points: points });
  if (RankingPlayer.length >15) {
    RankingPlayer.length = 15;
  }
  localStorage.setItem('RankingPlayer', JSON.stringify(RankingPlayer));
}

var usersPoints = function(){
  //Getting the array wich will represent the ranking of players
  localStorage.getItem('RankingPlayer');
  var rankingPlayer = JSON.parse(localStorage.getItem('RankingPlayer'));
  rankingPlayer.sort(
    function (a, b) {
        if (a.points > b.points) {
            return -1;
        }
        if (a.points < b.points) {
            return 1;
        }
        return 0;
    }
);
  var listHTML = '<ul>'
  for (let i = 0; i < rankingPlayer.length; i++) {
      listHTML += '<li> ' + (i + 1) + '.' + '[' + rankingPlayer[i].date + ']' +'   '+
       rankingPlayer[i].userName + '   ' + rankingPlayer[i].points + ' </li>';
  }
  listHTML += '</ul>';
  return listHTML;
}
//Show and hide divs and put the players scores in the ranking
var formEvents = function (evt) {
  var userName = document.getElementById('userName');
  savePoints(userName.value);
  var rankingDiv = getElement('ranking');
  var header = getElement('ranking-header');
  header.innerText = 'RANKING';
  var userData = getElement('user-data');
  userData.className = 'display-none';
  var userRank = document.getElementById('user-rank');
  userRank.className = 'display-block';
  document.getElementById('userName').value = '';
  userRank.innerHTML = usersPoints();
}

//Show and hide divs
var showRankingDiv = function (bool, message = '') {
  var close = getElement('close-ranking-button');
  close.onclick = closeRankingDiv;
  var rankingDiv = getElement('ranking');
  var userData = getElement('user-data');
  var header = getElement('ranking-header');
  header.innerText = message;
  if (bool) {
    userData.className = 'display-block';
    rankingDiv.className = 'display-block';
    var submit = document.getElementById('submit');
    submit.onclick = formEvents;
  } 
  else {
    rankingDiv.className = 'display-none';
  }
}

// Initialize game
var init = function () {
  resetBoard();
  var boardElement = document.getElementById('board');
  var pegs = boardElement.getElementsByTagName('button');
  addPegsEventHandlers(pegs)
  var newGame = document.getElementById('reset');
  newGame.onclick = resetBoard;
  var saveGame = document.getElementById('save');
  saveGame.onclick = savePegs;
  var loadGame = document.getElementById('load');
  loadGame.onclick = LoadPegs;
  var putScore = document.getElementById('score');
  putScore.textContent = 'SCORE' +' '+ score;
  var counter = document.getElementById('pegs-remaining');
  counter.textContent = 'PEGS' +' '+ numberOfPegs; 
  var high = document.getElementById('highscores');
  high.onclick = viewRanking;
  //localStorage.clear();
}
// Load of the document
window.onload = init;

