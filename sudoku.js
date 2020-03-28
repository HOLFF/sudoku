/*
For creation of this the p5.js library was used
Author of this version: Erharter Leonhard
*/

let board;
let columns = 9;
let rows = 9;
let canv;
let size= screen.height/2;
let cell = screen.height/18;
let input;
let genbut;
let checkbut;
let upbut;
let info;


function setup() {

  //creating the canvas where the cells will be drawn
  canv = createCanvas(size, size);
  canv.position((screen.width-size)/2,0);

  //creating a dom element to show text to the player because text() only works inside a canvas
  info = createP('Input Number of filled cells(17-40)');
  info.position(65,-3);

  //creating an number input element with default value 24 means 24 fields of the sudoku are filled
  input = createInput('24','number');
  input.position(10, 10);
  input.size(50); 
  
  //creating button elements for generate, check, upload and solve
  genbut = createButton('Generate');
  genbut.position(10,40);
  genbut.mousePressed(generate);

  checkbut = createButton('Check');
  checkbut.position(10,70);
  checkbut.mousePressed(check);

  upbut = createFileInput(handleFile);
  upbut.position(10,100);

  solvebut = createButton('Solve')
  solvebut.position(10,130);
  solvebut.mousePressed(solve);

  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
}

noLoop();
}

function draw() {
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      fill(255);
      stroke(0);
      rect(i*height/9, j * height/9, height/9-1, height/9-1);
    }
  }
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      fill(0);
      stroke(0);
      textAlign(RIGHT,BOTTOM);
      textSize(40);
      text(board[j][i], i*height/9, j * height/9, height/9-1, height/9-1);
    }
  }

}

function generate() {
  
}

function check() {
  for ( let i = 1; i < 4;i++) {
    for ( let j = 1; j < 4;j++) {
      if(!checkrect(i,j)) return false;
    }
  }
  for(let i = 0; i < 9;i++){
    if(!checkcol[i]) return false;
  }
  for(let i = 0; i < 9;i++){
    if(!checkrow[i]) return false;
  }
  return true;
}

function solve(){
}

function handleFile(file){
  let rv = 0;
  let count = 0;
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      board[i][j]=file.data.charAt(rv);
      if(count == 8){ rv+=3; count =0;}
      else {rv+=2;  count+=1;}
    }
  }
  redraw();
}

function checkrect(x,y){
  let string='';
  for ( let i = (x-1)*3; i < x*3;i++) {
    for ( let j = (y-1)*3; j < y*3;j++) {
      string+= board[i][j];
    }
  }
  for(let i = 1;i<10;i++){
    let out=split(string,String(i));

  if(out.length>2){
    return false;
  }
  }
  return true;
}

function checkcol(col){
  let string='';
  for ( let i = 0; i < 9;i++) {
      string+= board[i][col];
  }
  for(let i = 1;i<10;i++){
    let out=split(string,String(i));
    if(out.length>2){
    return false;
  }
}
return true;
}

function checkrow(row){
  let string='';
  for ( let i = 0; i < 9;i++) {
      string+= board[row][i];
  }
  for(let i = 1;i<10;i++){
    let out=split(string,String(i));
    if(out.length>2){
    return false;
  }
}
return true;
}