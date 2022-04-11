const board_tile_width = 3;
const board_tile_height = 3;
const board_border = 'black';
const board_background = "white";
//const tile_col = 'lightblue';
const tile_border = 'darkblue';
const tile_size = 10;
const player_size = 4;
const player_col = 'blue';
const player_border = 'black';

// Get the canvas element
const board = document.getElementById("board");
// Return a two dimensional drawing context
const board_ctx = board.getContext("2d");

board.width = board_tile_width * tile_size;
board.height = board_tile_height * tile_size;

//function to return color string given the r,g,b values
function rgb(r, g, b){
  r = Math.floor(r);
  g = Math.floor(g);
  b = Math.floor(b);
  return ["rgb(",r,",",g,",",b,")"].join("");
}

// Initialize player position
var player = {x:1, y:1};
var playerCorners=[];
var playerTiles = [];


// get the positions of the corners given location and size
function getCorners(x,y,size){
	var tempCorners = [];
	tempCorners[0] = {x:x,y:y}; //top left
  tempCorners[1] = {x:x+size,y:y}; //top right
  tempCorners[2] = {x:x,y:y+size}; //bottom left
  tempCorners[3] = {x:x+size,y:y+size}; //bottom right
  return tempCorners;
}

// get the tile index at each corner
function getTilesAtCorners(x,y,size){
	var tempCorners = getCorners(x,y,size);
  var tempCornerTiles = [];
  tempCornerTiles[0] = getTileIndex(tempCorners[0].x, tempCorners[0].y);
  tempCornerTiles[1] = getTileIndex(tempCorners[1].x, tempCorners[1].y);
  tempCornerTiles[2] = getTileIndex(tempCorners[2].x, tempCorners[2].y);
  tempCornerTiles[3] = getTileIndex(tempCorners[3].x, tempCorners[3].y);
  return tempCornerTiles;
}

// Initialize tile array
var tiles = [];
function getTileIndex(x,y){
	// index = x + (width * y)
	return Math.floor(x/tile_size) + ((board.width/tile_size) * Math.floor(y/tile_size));
}

// Add key event listener
document.addEventListener("keydown", movePlayer);

// Start game
main();
    
// main function called to start game
function main() {
	clearCanvas();
  generateTiles();
	drawTiles();
  drawPlayer();
  
  playerCorners = getCorners(player.x, player.y, player_size);
  playerTiles = getTilesAtCorners(player.x, player.y, player_size);
  
  //var intervalID = setInterval(update, 1000/30);
}

// Update function to be called repeatedly to update game state
function update(){
	clearCanvas();
  drawTiles();
  drawPlayer();
}
    
// draw a border around the canvas
function clearCanvas() {
	//  Select the color to fill the drawing
	board_ctx.fillStyle = board_background;
	//  Select the color for the border of the canvas
	board_ctx.strokestyle = board_border;
	// Draw a "filled" rectangle to cover the entire canvas
	board_ctx.fillRect(0, 0, board.width, board.height);
	// Draw a "border" around the entire canvas
	board_ctx.strokeRect(0, 0, board.width, board.height);
}

// Draw the player
function drawPlayer() {
	// Set the color of the player
	board_ctx.fillStyle = player_col;
	// Set the border color of the player
	board_ctx.strokestyle = player_border;
	// Draw a "filled" rectangle to represent the player at the coordinates its located at
	board_ctx.fillRect(player.x, player.y, player_size, player_size);
	// Draw a border around the snake part
	board_ctx.strokeRect(player.x, player.y, player_size, player_size);
}
    
// loop through drawing the tiles
function drawTiles() {
	// Draw each part
	tiles.forEach(drawTile)
}
    
// Draw one tile on the canvas
function drawTile(tile) {
	// Set the color of the tile
	board_ctx.fillStyle = tile.color;
	// Set the border color of the tile 
	board_ctx.strokestyle = tile_border;
	// Draw a "filled" rectangle to represent the tile at the coordinates the tlile is located
	board_ctx.fillRect(tile.x * tile_size, tile.y * tile_size, tile_size, tile_size);
	// Draw a border around the tile
	board_ctx.strokeRect(tile.x * tile_size, tile.y * tile_size, tile_size, tile_size);
}

function generateTiles(){
	tiles=[];
  var tileIndex=0;
	for(var ty=0;ty<board.height/tile_size;ty++){
  	for(var tx=0;tx<board.width/tile_size;tx++){
    	var tileValue = 0;
      var tileColor = 'white';
      if(ty>=2){
      	tileValue=1;
        tileColor='red';
      }
      tiles[tileIndex] = {x:tx, y:ty, value:tileValue, color:tileColor};
      tileIndex = tileIndex+1;
    }
  }
}

function onEnterTile(tileIndex){
  console.log(tiles[tileIndex]);
  var value = tiles[tileIndex].value;
  
  if(value!=0){
  	return false;
  }
  //return true if can enter this tile
  return true;
}

function movePlayer(event){  
	const LEFT_KEY = 37;
	const RIGHT_KEY = 39;
	const UP_KEY = 38;
	const DOWN_KEY = 40;
	const keyPressed = event.keyCode;
  var dx = 0;
  var dy = 0;
 
	if (keyPressed == LEFT_KEY){  
  	dx = -1;
    dy = 0;
	}
	if (keyPressed == UP_KEY){    
		dx = 0;
    dy = -1;
	}
	if (keyPressed == RIGHT_KEY){    
		dx = 1;
    dy = 0;
	}
	if (keyPressed == DOWN_KEY){    
		dx = 0;
    dy = 1;
	}
  
  var nextX = player.x+dx;
  var nextY = player.y+dy;
  //check if next position is within the board bounds
  if(nextX<(board.width)-player_size && nextX>0){
  	if(nextY<(board.height)-player_size && nextY>0){
      //check next position tiles types
      var nextPlayerTiles = getTilesAtCorners(nextX, nextY, player_size);
      var canEnter = true;
      if(dx==1){//moved right
      	if(nextPlayerTiles[1] != playerTiles[1]){
        	cantEnter = onEnterTile(nextPlayerTiles[1]);
        }
        if(nextPlayerTiles[3] != playerTiles[3]){
        	cantEnter = onEnterTile(nextPlayerTiles[3]);
        }
      }
      if(dx==-1){//moved left
      	if(nextPlayerTiles[0] != playerTiles[0]){
        	cantEnter = onEnterTile(nextPlayerTiles[0]);
        }
        if(nextPlayerTiles[2] != playerTiles[2]){
        	cantEnter = onEnterTile(nextPlayerTiles[2]);
        }
      }
      if(dy==1){//moved down
      	if(nextPlayerTiles[2] != playerTiles[2]){
        	cantEnter = onEnterTile(nextPlayerTiles[2]);
        }
        if(nextPlayerTiles[3] != playerTiles[3]){
        	cantEnter = onEnterTile(nextPlayerTiles[3]);
        }
      }
      if(dy==-1){//moved up
      	if(nextPlayerTiles[0] != playerTiles[0]){
        	cantEnter = onEnterTile(nextPlayerTiles[0]);
        }
        if(nextPlayerTiles[1] != playerTiles[1]){
        	cantEnter = onEnterTile(nextPlayerTiles[1]);
        }
      }
      if(canEnter == true){
        player.x = nextX;
        player.y = nextY;
        playerCorners = getCorners(player.x, player.y, player_size);
  			playerTiles = getTilesAtCorners(player.x, player.y, player_size);
      }
    }
  }
  update();
}
