var max_x,max_y,num,blocknum;
var gameBlocks = [];
var gameBlockIsOpen = [];
var gameBlockIsMark = [];
var gamestart = false;
var gameOver = false;
var restBomb =0;
var timer = 0;
var timerControler;

$(document).ready(function(){ 
	$(window).keydown(function(event){
		console.log(event.keyCode);
		//press f2
		if(event.keyCode == 113){
			start();
		}
	});
});
function startTimer(){
	timerControler = setInterval(myTimer,1000);
}
function myTimer(){
	++timer;
	document.getElementById("timer").innerHTML = "Time:"+timer;
}
function clearTimer(){
	clearInterval(timerControler);
}


function help(){
	var strText = 
	"Press F2 or Start button to start a new Game."
	+"\n\n"+
	"Open up all the non-bomb blocks as soon as possible."
	+"\n\n"+
	"LeftClick to uncover an empty square."
	+"\n"+
	"(Be careful, if you uncover a bomb, and the game ends.)"
	+"\n\n"+
	"MiddleClick on the number can open its block within the 3X3 matrix."
	+"\n"+
	"(Will not open blocks marked as bombs)."
	+"\n\n"+
	"RightClick to mark or unmark a square as a bomb. "
	+"\n\n"+
	"White Square is an empty square."
	+"\n\n"+
	"Red Square is a square you mark as a bomb."
	+"\n\n"+
	"Yellow Square is a bomb.(You won't see it until you lose.)"
	+"\n\n"+
	"Blue Square is a square you marked as a bomb but it is not."
	window.alert(strText);
}

function start(){
	gameOver = false;
    console.log("starts.");
	var n = document.getElementById("row").value;
	var m = document.getElementById("col").value;
	num = document.getElementById("num").value;
	
	if(n<5 || n>30 || m<5 || m>30){
		document.getElementById("warning").innerHTML = "長寬請介於5~30間";
		return;
	}else if(num<m*n*0.1){
		document.getElementById("warning").innerHTML = "請多設定一些地雷";		
	}else if(num>m*n*0.6){
		document.getElementById("warning").innerHTML = "請少設定一些地雷";		
	}
	else{
		document.getElementById("warning").innerHTML = "";
		removeTableData("gamezone");
		console.log("row:"+n+"  col:"+m+"  num:"+num);
		gameCreate(n,m);
	}
}
function gameCreate(x,y){
	if(gameOver)
		return;
    console.log("gameCreate.");
	gamestart = false;
	max_x = x;
	max_y = y;
	blocknum = x*y;
	restBomb = num;
	document.getElementById("restBombs").innerHTML = "Rest Bomb:"+restBomb;
	timer = 0;
	document.getElementById("timer").innerHTML = "Time:"+0;
	var tablegame = document.getElementById("gamezone");
	for(var i = 0; i < x; i++){
		var tr = tablegame.insertRow(-1);
		tr.className+="GameZone";
		for(var j =0; j < y; j++){
			var td = tr.insertCell(-1);
			td.className+="GameZone";
			td.id+="td"+((i*y)+j);
		}
	}
	gameReset();
	$("td.GameZone").mouseup(function(event){
		var id = $(this).attr("id");
		id = id.slice(2);
		id = parseInt(id);
		switch (event.which) {
			case 1:
				console.log( id+ ' Left Mouse button pressed.');
				openBlock(id);
				break;
			case 2:
				console.log( id+ ' Middle Mouse button pressed.');
				openNearBlocks(id);
				break;
			case 3:
				console.log( id+ ' Right Mouse button pressed.');
				markBlock(id);
				break;
			default:
				alert('You have a strange Mouse!');
		}		
	});
	$("td.GameZone").on({
		mouseenter: function(){
			$(this).css("background-color", "#DDDDDD");
		},
		mouseleave: function(){
			$(this).css("background-color", "white");
		}
	});
}
function gameReset(){
	if(gameOver)
		return;
    console.log("gameReset.");
	gameBlocks = [];
	gameBlockIsOpen = [];
	gameBlockIsMark = [];
	for(var i=0;i<blocknum;i++){
		gameBlocks[i]=0;
		gameBlockIsOpen[i]=false;
		gameBlockIsMark[i]=false;
	}
}
function markBlock(id){
	if(gameOver)
		return;
	if(gameBlockIsOpen[id])
		return;
	if(gameBlockIsMark[id]){
		restBomb++;
		document.getElementById("restBombs").innerHTML = "Rest Bomb:"+restBomb;
		$("td#td"+id).css("background-color", "white");
		$("td#td"+id).on({
			mouseenter: function(){
				$(this).css("background-color", "#DDDDDD");
			},
			mouseleave: function(){
				$(this).css("background-color", "white");
			}
		});
	}else{
		restBomb--;
		document.getElementById("restBombs").innerHTML = "Rest Bomb:"+restBomb;
		$("td#td"+id).css("background-color", "red");
		$("td#td"+id).on({
			mouseenter: function(){
				$(this).css("background-color", "red");
			},
			mouseleave: function(){
				$(this).css("background-color", "red");
			}
		});
	}
		
	gameBlockIsMark[id] = !gameBlockIsMark[id];
}
function openBlock(id){
	if(gameOver)
		return;
	if(gameBlockIsOpen[id])
		return;
	if(gameBlockIsMark[id])
		return;
    console.log("open block "+id);
	
	gameBlockIsOpen[id] = true;
	// initial random bombs data;
	if(gamestart == false){
		setBombs(id);
		gamestart = true;
		countNearBombs();
		startTimer();
	}
	// open a bombblock;
	if(gameBlocks[id]==-1){
		$("td#td"+id).css("background-color", "#FFDD00");
		$("td#td"+id).on({
			mouseenter: function(){
				$(this).css("background-color", "#FFDD00");
			},
			mouseleave: function(){
				$(this).css("background-color", "#FFDD00");
			}
		});
		gameIsOver(false);
		return;
	}
	
	$("td#td"+id).css("background-color", "#DDDDDD");
	$("td#td"+id).on({
		mouseenter: function(){
			$(this).css("background-color", "#DDDDDD");
		},
		mouseleave: function(){
			$(this).css("background-color", "#DDDDDD");
		}
	});
	
	// there are no bomb near;
	if(gameBlocks[id]==0){
		openNearBlocks(id);
	}else{
		document.getElementById("td"+id).innerHTML = gameBlocks[id];
	}
	checkWin();
}
function gameIsOver(isWin){
	gameOver = true;
	clearTimer();
	if(isWin){
		window.alert("You Win in "+timer+" seconds!");
		//document.getElementById("gameOver").innerHTML = "You Win!";
	}else{
		for(var i=0;i<blocknum;i++){
			if(gameBlocks[i]<0){
				if(!gameBlockIsMark[i]){
					$("td#td"+i).css("background-color", "#FFDD00");
					$("td#td"+i).on({
						mouseenter: function(){
							$(this).css("background-color", "#FFDD00");
						},
						mouseleave: function(){
							$(this).css("background-color", "#FFDD00");
						}
					});
				}
			}else if(gameBlockIsMark[i]){
				$("td#td"+i).css("background-color", "#00DDFF");
				$("td#td"+i).on({
					mouseenter: function(){
						$(this).css("background-color", "#00DDFF");
					},
					mouseleave: function(){
						$(this).css("background-color", "#00DDFF");
					}
				});
			}
		}
		window.alert("BOOM!");
		//document.getElementById("gameOver").innerHTML = "BOOM!";
	}
}
function checkWin()
{	if(gameOver)
		return;
	for(var i=0;i<blocknum;i++){
		if(gameBlocks[i] >= 0)
			if(!gameBlockIsOpen[i])
				return;
	}
	gameOver = true;
	gameIsOver(true);
}
function openNearBlocks(id){
	if(gameOver)
		return;
	if(!gameBlockIsOpen[id])
		return;
	var i = Math.floor(id/max_y);
	var j = id%max_y;
	if(i!=0){
		if(j!=0)			openBlock(idCal(i-1,j-1));
		if(j!=max_y-1)		openBlock(idCal(i-1,j+1));
		openBlock(idCal(i-1,j));
	}
	if(i!=max_x-1){
		if(j!=0)			openBlock(idCal(i+1,j-1));
		if(j!=max_y-1)		openBlock(idCal(i+1,j+1));
		openBlock(idCal(i+1,j));
	}
	if(j!=0)				openBlock(idCal(i,j-1));
	if(j!=max_y-1)			openBlock(idCal(i,j+1));	
}

function setBombs(id){
    console.log("setBombs without block #"+id);
	var i = num;
	while(i > 0){
		var tmp = Math.floor((Math.random() * blocknum) + 1);
		//console.log("random num is "+tmp);
		if(tmp!=id && gameBlocks[tmp]== 0){
			i--;
			gameBlocks[tmp] = -1;
			console.log(tmp + " is a bomb;")
		}
	}
}
function countNearBombs(){
    console.log("countNearBombs.");
	for(var i =0;i<max_x;i++){
		for(var j=0;j<max_y;j++){
			if(!isBomb(i,j)){
				if(i!=0){
					if(j!=0)
						if(isBomb(i-1,j-1))	incBlock(i,j);
					if(j!=max_y-1)
						if(isBomb(i-1,j+1))	incBlock(i,j);
					if(isBomb(i-1,j))	incBlock(i,j);
				}
				if(i!=max_x-1){
					if(j!=0)
						if(isBomb(i+1,j-1))	incBlock(i,j);
					if(j!=max_y-1)
						if(isBomb(i+1,j+1))	incBlock(i,j);
					if(isBomb(i+1,j))	incBlock(i,j);
				}
				if(j!=0)
					if(isBomb(i,j-1))	incBlock(i,j);
				if(j!=max_y-1)
					if(isBomb(i,j+1))	incBlock(i,j);
			}
		}
	}
}
function idCal(x,y){
	return x*max_y + y;
}
function isBomb(x,y){
	if(gameBlocks[idCal(x,y)]<0)
		return true;
	return false;
}
function incBlock(x,y){
	++gameBlocks[idCal(x,y)];
}

function removeTableData(name){
    console.log("removeTableData.");
	var num = document.getElementById(name).rows.length;
	while(num--){
		document.getElementById(name).deleteRow(-1);
	}
}