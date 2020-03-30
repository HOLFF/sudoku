/*
For creation of this the p5.js library was used
Author of this version: Erharter Leonhard
*/

let board;
let fixed;
let change;
let columns = 9;
let rows = 9;
let canv;
let size= screen.height/2;
let cell = screen.height/18;
let input;
let genbut;
let checkbut;
let upbut;
let solvebut;
let stopsolvebut;
let info;
let nums=[9,9,9,9,9,9,9,9,9];
let block=false;


function setup() {

  //creating the canvas where the cells will be drawn
  canv = createCanvas(size, size);
  canv.position((screen.width-size)/2,0);


  //creating button elements for check, upload ,solve and stopsolve

  checkbut = createButton('Check');
  checkbut.position(10,70);
  checkbut.mousePressed(check);

  upbut = createFileInput(handleFile);
  upbut.position(10,100);

  solvebut = createButton('Start Solve')
  solvebut.position(10,130);
  solvebut.mousePressed(solve);

  stopsolvebut = createButton('Stop Solve')
  stopsolvebut.position(10,160);
  stopsolvebut.mousePressed(stopsolve);

  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  fixed = new Array(columns);
  for (let i = 0; i < columns; i++) {
    fixed[i] = new Array(rows);
  }
  change = new Array(columns);
  for (let i = 0; i < columns; i++) {
    change[i] = new Array(rows);
  }
  //not looping the draw for better preformance
  noLoop();
  pregen();
}

function draw() {
 
    
  //drawing the grid background and lines
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if(!check())fill(255,0,0)
      else fill(0,255,0)
      stroke(0);
      rect(i*height/9, j * height/9, height/9-1, height/9-1);
    }
  }
  //drawing the numbers
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      fill(0);
      stroke(0);
      textAlign(RIGHT,BOTTOM);
      textSize(40);
      if(board[j][i]==0) text('', i*height/9, j * height/9, height/9-1, height/9-1);
       else text(board[j][i], i*height/9, j * height/9, height/9-1, height/9-1);
    }
  }
}


function pregen(){
  //planned use for generating a new sudoku but computing power
  // withput using backtracking is too small
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      fixed[i][j]=0;
    }
  }
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      change[i][j]='x';
    }
  }
  let pos=0;
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      while(change[i][j]=='x'){
          if(nums[pos]!=0){
            change[i][j] = pos+1;
            nums[pos]-=1;
          }
          else pos+=1;
      }
    }
  }
  merge();
  redraw();

}

function check() {
  //checking if the solution is valid
  for ( let i = 1; i < 4;i++) {
    for ( let j = 1; j < 4;j++) {
      if(!checkrect(i,j)) return false;
    }
  }
  for(let i = 0; i < 9;i++){
    if(!checkcol(i)) return false;
  }
  for(let i = 0; i < 9;i++){
    if(!checkrow(i)) return false;
  }
  redraw();
  return true;
}

function solve(){
  block=true;
while(!check()&&block){
  reorder();
}
}

function stopsolve(){
  block=false;
  noLoop();
}

function handleFile(file){
  //uploading a txt file from your pc
  nums=[9,9,9,9,9,9,9,9,9];
  let rv = 0;
  let count = 0;
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      fixed[i][j]=file.data.charAt(rv);
      if(count == 8){ rv+=3; count =0;}
      else {rv+=2;  count+=1;}
    }
  }
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
        if(fixed[i][j]==0)change[i][j]='x';
        else change[i][j]=0;
    }
  }

  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      for(let k = 1; k<10;k++){
        if(fixed[i][j]==k)nums[k-1]-=1;
      }
    }
  }
let pos=0;
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      while(change[i][j]=='x'){
          if(nums[pos]!=0){
            change[i][j] = pos+1;
            nums[pos]-=1;
          }
          else pos+=1;
      }
    }
  }

  merge();
  redraw();
}

function checkrect(x,y){
  //checking a small 3x3 grid for correctness
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
  //checking the columns 
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
  //checking the rows
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

function merge(){
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if(fixed[i][j]<change[i][j]) board[i][j]=change[i][j];
      else board[i][j]=fixed[i][j];
    }
  }
}

function reorder(){
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if(change[i][j]!=0){
        let temp=change[i][j];
        let x = floor(random(9));
        let y = floor(random(9));
        while(change[x][y]==0){
          x=floor(random(9));
          y=floor(random(9));
        }
          change[i][j]=change[x][y];
          change[x][y]=temp;
          if(check()) noLoop();        
      }
    }
    if(check())noLoop();
  }
  merge();
}