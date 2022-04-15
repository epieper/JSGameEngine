const board_tile_width = 3;
const board_tile_height = 3;
const board_border = 'black';
const board_background = "white";
//const tile_col = 'lightblue';
const tile_border = 'darkblue';
const tile_size = 10;
const player_col = 'blue';
const player_border = 'black';

// Get the canvas element
const board = document.getElementById("board");
// Return a two dimensional drawing context
const board_ctx = board.getContext("2d");

board.width = board_tile_width * tile_size;
board.height = board_tile_height * tile_size;

// Initialize player position
var player = {x:1, y:1, size:4, corners:[], tiles:[]};

// Initialize tile array
var tiles = [];

var colliders = [];

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

  player.corners = getCorners(player);
  player.tiles = getTilesInBounds(player);
  console.log(player);
  //var intervalID = setInterval(update, 1000/30);
}

// Update function to be called repeatedly to update game state
function update(){
  clearCanvas();
  drawTiles();
  drawPlayer();
}

//function to return color string given the r,g,b values
function rgb(r, g, b){
  r = Math.floor(r);
  g = Math.floor(g);
  b = Math.floor(b);
  return ["rgb(",r,",",g,",",b,")"].join("");
}

function removeElement(array, element){
  var index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1); // 2nd parameter means remove one item only
  }
  return array;
}

function contains(array, element){
  var found = false;
  for(var i=0;i<array.length;i++){
    if(array[i] == element){
      found = true;
      break;
    }
  }
  return found;
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
  board_ctx.fillRect(player.x, player.y, player.size, player.size);
  // Draw a border around the snake part
  board_ctx.strokeRect(player.x, player.y, player.size, player.size);
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
      var tileType = 0;
      var tileValue = 0;
      var tileColor = 'white';
      if(ty>=2){
        tileType=1;
        tileColor='red';
      }
      tiles[tileIndex] = {x:tx, y:ty, type:tileType, value:tileValue, color:tileColor};
      tileIndex = tileIndex+1;
    }
  }
}

// get the positions of the corners given location and size
function getCorners(other){
  var tempCorners = [];
  tempCorners[0] = {x:other.x,y:other.y}; //top left
  tempCorners[1] = {x:other.x+other.size,y:other.y}; //top right
  tempCorners[2] = {x:other.x,y:other.y+other.size}; //bottom left
  tempCorners[3] = {x:other.x+other.size,y:other.y+other.size}; //bottom right
  return tempCorners;
}

function getTilesOnEdge(other,edge){
  var edgeTiles = [];
  if(edge==0){ //top edge
    for(var x=other.corners[0].x;x<other.corners[1].x;x++){
      edgeTiles.push(getTileIndex(x, other.corners[0].y - 1));
    }
  }else if(edge==1){//right edge
    for(var y=other.corners[3].y;y<other.corners[1].y;y++){
      edgeTiles.push(getTileIndex(other.corners[3].x + 1, y));
    }
  }else if(edge==2){//bottom edge
    for(var x=other.corners[2].x;x<other.corners[3].x;x++){
      edgeTiles.push(getTileIndex(x, other.corners[2].y + 1));
    }
  }else if(edge==3){//left edge
    for(var y=other.corners[2].y;y<other.corners[0].y;y++){
      edgeTiles.push(getTileIndex(other.corners[2].x - 1, y));
    }
  }
  return edgeTiles;
}

function getTilesInBounds(other){
  var tilesInBounds = [];
  for(var y=other.y + other.size;y>=other.y;y--){
    for(var x=other.x;x<other.size;x++){
      var tileIndex = getTileIndex(x,y);
      if (contains(tilesInBounds, tileIndex) == false) {
        tilesInBounds.push(tileIndex);
      }
    }
  }
  return tilesInBounds;
}

// get the tile index at each corner
function getTilesAtCorners(corners){
  var tempCornerTiles = [];
  tempCornerTiles[0] = getTileIndex(corners[0].x, corners[0].y);
  tempCornerTiles[1] = getTileIndex(corners[1].x, corners[1].y);
  tempCornerTiles[2] = getTileIndex(corners[2].x, corners[2].y);
  tempCornerTiles[3] = getTileIndex(corners[3].x, corners[3].y);
  return tempCornerTiles;
}

function getTileIndex(x,y){
  // index = x + (width * y)
  return Math.floor(x/tile_size) + ((board.width/tile_size) * Math.floor(y/tile_size));
}

function onEnter(other,tileIndex){
  console.log("Entered [" +tiles[tileIndex].x + "," + tiles[tileIndex].y + "]");
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

  player = move(player, {x:dx,y:dy})
  update();
}

function move(other, direction){
  var magnitude = Math.sqrt(Math.pow(direction.x,2) + Math.pow(direction.y,2));
  direction.x = Math.round(direction.x/magnitude);
  direction.y = Math.round(direction.y/magnitude);

  var nextX = other.x+direction.x;
  var nextY = other.y+direction.y;
  //check if next position is within the board bounds
  if(nextX<(board.width)-other.size && nextX>0){
    if(nextY<(board.height)-other.size && nextY>0){
      //check next position tiles types
      var nextTiles = [];
      var canEnter = true;
      if(direction.x==1){//moved right
        nextTiles = getTilesOnEdge(other, 1);
      }
      if(direction.x==-1){//moved left
        nextTiles = getTilesOnEdge(other, 3);
      }
      if(direction.y==1){//moved down
        nextTiles = getTilesOnEdge(other, 2);
      }
      if(direction.y==-1){//moved up
        nextTiles = getTilesOnEdge(other, 0);
      }
      for(var i=0;i<nextTiles.length;i++){
        if(contains(other.tiles, nextTiles[i]) == false){
          var type = tiles[nextTiles[i]].type;
          if(type==1){
            //type 1 = cannot enter
            canEnter = false;
          }
          if(canEnter == true){
            other.tiles.push(nextTiles[i]);
            onEnter(other, nextTiles[i]);
          }
        }
      }
      if(canEnter == true){
        other.x = nextX;
        other.y = nextY;
        other.corners = getCorners(other);
        other.tiles = getTilesInBounds(other);
      }
    }
  }
  return other;
}
