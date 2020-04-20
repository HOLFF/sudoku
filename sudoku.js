/*
For creation of this the p5.js library was used
Author of this version: Erharter Leonhard
*/

let columns = 9;
let rows = 9;
let canv;
let data;
let upbut;
let solvebut;
let size = screen.height / 2;
let cell = screen.height / 18;
let ro;
let hard = false;

function setup() {

  //creating the canvas where the cells will be drawn
  canv = createCanvas(size, size);
  canv.position((screen.width - size) / 2, 0);


  //creating button elements for upload ,solve and stopsolve

  upbut = createFileInput(handleFile);
  upbut.position(10, 100);

  solvebut = createButton('Start Solve')
  solvebut.position(10, 130);
  solvebut.mousePressed(solve);

  // Wacky way to make a 2D array is JS
  data = new Array(columns);
  for (let i = 0; i < columns; i++) {
    data[i] = new Array(rows);
  }
  //not Looping the draw for better efficiency
  noLoop();
}

function draw() {


  //drawing the grid background and lines
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (!check()) fill(255, 0, 0)
      else fill(0, 255, 0)
      stroke(0);
      rect(i * size / 9, j * size / 9, size / 9 - 1, size / 9 - 1);
    }
  }
  //drawing the numbers
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      fill(0);
      stroke(0);
      textAlign(RIGHT, BOTTOM);
      textSize(40);
      if (data[j][i] == 0) text('', i * size / 9, j * size / 9, size / 9 - 1, size / 9 - 1);
      else text(data[j][i], i * size / 9, j * size / 9, size / 9 - 1, size / 9 - 1);
    }
  }
}

function solvesud() {
  let highest=0;
  for (let vert = 0; vert < columns; vert++) {
    for (let horz = 0; horz < rows; horz++) {
      if (data[vert][horz] == 0) {
        ro=used(data,vert,horz);
        if(ro.length > highest) highest = ro.length;
        if (ro.length == 8) {
          for (let i = 1; i < 10; i++) {
            if (ro.indexOf(i.toString()) < 0) {
              data[vert][horz] = i;
            }
          }
        }
      }
    }
  }
  if (highest<8) hard=true;
}

function backtrack(a){
  draw();
  for (let vert = 0; vert < columns; vert++) {
    for (let horz = 0; horz < rows; horz++) {
        if(a[vert][horz]==0){
          let tries=getList(used(a,vert,horz));
          let long=Object.keys(tries).length;
          for(let i=0;i<long;i++){
            a[vert][horz]=tries[i];
            if(checkIllegalState(a,vert,horz)==true) backtrack(a);
            else a[vert][horz]=0;
          }
          if(check==true)return true;
          a[vert][horz]=0;
          return -1;
        }
    }
  }
}

function solve() {
  console.log("solving");
  while (check() != true&&hard ==false) {
    solvesud();
    redraw();
  }
  if(hard==true){
    backtrack(data);
  }
}



function handleFile(file) {
  let rv = 0;
  let count = 0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      data[i][j] = file.data.charAt(rv);
      if (count == 8) { rv += 3; count = 0; }
      else { rv += 2; count += 1; }
    }
  }
  redraw();
}

function check() {
  //checking if the solution is valid

  if (!checkcomp()) return false;

  for (let i = 1; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (!checkrect(i, j)) return false;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!checkcol(i)) return false;
  }
  for (let i = 0; i < 9; i++) {
    if (!checkrow(i)) return false;
  }
  redraw();
  return true;
}
function checkcomp() {
  for (let vert = 0; vert < columns; vert++) {
    for (let horz = 0; horz < rows; horz++) {
      if (data[vert][horz] == 0 || data[vert][horz] == null) return false;
    }
  }
  return true;
}
function checkrect(x, y) {
  //checking a small 3x3 grid for correctness
  let string = '';
  for (let i = (x - 1) * 3; i < x * 3; i++) {
    for (let j = (y - 1) * 3; j < y * 3; j++) {
      string += data[i][j];
    }
  }
  for (let i = 1; i < 10; i++) {
    let out = split(string, String(i));

    if (out.length > 2) {
      return false;
    }
  }
  return true;
}

function checkcol(col) {
  //checking the columns 
  let string = '';
  for (let i = 0; i < 9; i++) {
    string += data[i][col];
  }
  for (let i = 1; i < 10; i++) {
    let out = split(string, String(i));
    if (out.length > 2) {
      return false;
    }
  }
  return true;
}

function checkrow(row) {
  //checking the rows
  let string = '';
  for (let i = 0; i < 9; i++) {
    string += data[row][i];
  }
  for (let i = 1; i < 10; i++) {
    let out = split(string, String(i));
    if (out.length > 2) {
      return false;
    }
  }
  return true;
}

function checkIllegalState(a,xpos,ypos){
  let value = a[xpos][ypos];
  for (let i = 0; i < 9; i++) {
    if(i==xpos){}
    else{
     if(a[i][ypos]==value) return false;
    }
    if(i==ypos){}
    else{
     if(a[xpos][i]==value) return false;
    }  }
  for (let vertbx = floor(xpos / 3) * 3; vertbx < floor(xpos / 3) * 3 + 3; vertbx++) {
    for (let horzbx = floor(ypos / 3) * 3; horzbx < floor(ypos / 3) * 3 + 3; horzbx++) {
      if(vertbx==xpos&&horzbx==ypos){}
      else{
        if(a[vertbx][horzbx]==value) return false;
      }
    }
  }
  return true;
}

function used(a,vert,horz){
  let exc = {};
  for (let i = 0; i < 9; i++) {
    if (a[vert][i] > 0) exc[a[vert][i]] = true;
    if (a[i][horz] > 0) exc[a[i][horz]] = true;
  }
  for (let vertbx = floor(vert / 3) * 3; vertbx < floor(vert / 3) * 3 + 3; vertbx++) {
    for (let horzbx = floor(horz / 3) * 3; horzbx < floor(horz / 3) * 3 + 3; horzbx++) {
      if (a[vertbx][horzbx] > 0) exc[a[vertbx][horzbx]] = true;

    }
  }
  return Object.keys(exc);
}

function getList(a){
  let ret={};
  let pos=0;
  for (let i = 1; i < 10; i++) {
    if (a.indexOf(i.toString()) < 0) {
      ret[pos] = i;
      pos++;
    }
  }
  return ret;
}