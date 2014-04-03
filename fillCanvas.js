

var screenDraw = 0;
var flipThreshold = 0.5;
var screenDelay=1;
var gridSize = 4;
var gridSize2 = gridSize*gridSize;
var serviceFlag = true; // set when operating parameters change
var Pause = false; // Pause Play button state
var ColorSpace = 2;
var ColorScale = 255;
var maxTest = 3*255*255;

function rand1(){
	return Math.floor(Math.random()*ColorSpace)*ColorScale;
}

function randGS(gridSizeX){
	var a = Math.floor(Math.random()*gridSizeX);
	return a;
}

function gridCell(rc,gc,bc){this.r=rc,this.g=gc,this.b=bc};

var dataGrid = new Array(gridSize2);

function OnChange()
{
	var dropdownSize = document.getElementById("select1");
    var dropdownColor = document.getElementById("select2");
    //var dropdownDelay = document.getElementById("select3");

    gridSize = parseInt(dropdownSize.options[dropdownSize.selectedIndex].value);
    gridSize2 = gridSize*gridSize;   
    dataGrid = new Array(gridSize2);
    
    ColorSpace = parseInt(dropdownColor.options[dropdownColor.selectedIndex].value);
    ColorScale = Math.floor(255/(ColorSpace-1));
    
    //screenDelay = parseInt(dropdownDelay.options[dropdownDelay.selectedIndex].value);
    cycleDelay();
    
    for(i=0;i<gridSize2;i++){dataGrid[i]=new gridCell(rand1(),rand1(),rand1());} 
    
    flipThreshold =0.5; 
    screenDraw = 0;
    serviceFlag = true;
    
    return true;
}

function drawCanvas1(){
	var c=document.getElementById("drawHere");
	var ctx=c.getContext("2d");
	var myScreen = 800;
	var myScreen2 = myScreen*myScreen*4;
	var myScreen4 = myScreen*4;
	var scaler =myScreen/gridSize; 
	ctx.beginPath();
	var squareSide = myScreen/gridSize;
	for(var i = 0; i< gridSize2;i++){
		var squareRow = Math.floor(i/gridSize);
		var squareCol = Math.floor(i%gridSize);

		var y = squareRow*squareSide;
		var x = squareCol*squareSide;
		
		var t='rgba('+dataGrid[i].r+','+ dataGrid[i].g+','+dataGrid[i].b+',255)';
		ctx.fillStyle = t;
		ctx.fillRect(x,y,squareSide,squareSide);
    }
	ctx.stroke();
};

function calculateIndexST(i, j){ return (j+i*gridSize);}

function swapTestEdge(STi, STj, incStep){
	
	var indexST = calculateIndexST(STi, STj);
	var zero = indexST;
	var one = indexST+incStep;
	var two = indexST+2*incStep;
	var tff = 255;
	
	var STLr = dataGrid[zero].r-dataGrid[one].r;
	var STLg = dataGrid[zero].g-dataGrid[one].g;
	var STLb = dataGrid[zero].b-dataGrid[one].b;
    var STLeft = STLr*STLr +STLg*STLg+STLb*STLb;

	var STRr = dataGrid[two].r-dataGrid[zero].r;
	var STRg = dataGrid[two].g-dataGrid[zero].g;
	var STRb = dataGrid[two].b-dataGrid[zero].b;
    var STRight = STRr*STRr * STRg*STRg * STRb*STRb;
    var Bbool =  STRight<STLeft; 
    Bbool = (Math.random()<flipThreshold)||Bbool;// && (Math.random()<0.1);

    return Bbool;
};
	
function swapTest2D(STi, STj, incStep, incLateral){
	var tff = 255;
	var rSum=0;
	var gSum=0;
	var bSum=0;
	function times(x){rSum *= x; gSum*= x; bSum*=x;}
	
	function addRGB(ST){
		rSum += dataGrid[ST].r;
		gSum += dataGrid[ST].g;
		bSum += dataGrid[ST].b;
	}

	var indexST = calculateIndexST(STi, STj); // top left corner of 3x4 box
	times(0); // clear data
	addRGB(indexST+2*incStep);
	addRGB(indexST+3*incStep);
	addRGB(indexST+3*incStep+incLateral);
	addRGB(indexST+3*incStep+2*incLateral);
	addRGB(indexST+2*incStep+2*incLateral);
	times(-0.2); // scale by 1/5
	// get sum data
	var SRr = rSum;
	var SRg = gSum;
	var SRb = bSum;
	// find difference right cell with right surroundings
	addRGB(indexST+2*incStep+incLateral);
	var DiffRr = rSum;
	var DiffRg = gSum;
	var DiffRb = bSum;
	var noDiffR = DiffRr*DiffRr *DiffRg*DiffRg * DiffRb*DiffRb;
	
	times(0); // clear data
	addRGB(indexST);
	addRGB(indexST+incStep);
	addRGB(indexST+incLateral);
	addRGB(indexST+2*incLateral);
	addRGB(indexST+incStep+2*incLateral);
	times(-0.2); // scale by 1/5
	// get sum data
	var SLr = rSum;
	var SLg = gSum;
	var SLb = bSum;
	addRGB(indexST+incStep+incLateral);
	var DiffLr = rSum;
	var DiffLg = gSum;
	var DiffLb = bSum;
	var noDiffL = DiffLr*DiffLr * DiffLg*DiffLg * DiffLb*DiffLb;
	//var NoChangeDiff = noDiffL+noDiffR;
	var NoChangeDiff = Math.min(noDiffL,noDiffR);
	
	rSum = SRr;
	gSum = SRg;
	bSum = SRb;
	addRGB(indexST+incStep+incLateral);
	DiffRr = rSum;
	DiffRg = gSum;
	DiffRb = bSum;
	var swapDiffR = DiffRr*DiffRr * DiffRg*DiffRg * DiffRb*DiffRb;
	
	rSum = SLr;
	gSum = SLg;
	bSum = SLb;
	addRGB(indexST+2*incStep+incLateral);
	DiffLr = rSum;
	DiffLg = gSum;
	DiffLb = bSum;
	var swapDiffL = DiffRr*DiffRr * DiffRg*DiffRg * DiffRb*DiffRb;
//	var SwapDiff = swapDiffR+swapDiffL;
	var SwapDiff = Math.min(swapDiffR, swapDiffL);
	
	var Bbool =  SwapDiff<NoChangeDiff;
    Bbool = (Math.random()<flipThreshold)||Bbool;// && (Math.random()<0.1);
    return Bbool;

}	

function test(nl,nr,sl,sr){
	var maxS = Math.max(sl,sr);
	var minS = Math.min(sl,sr);
	var maxN = Math.max(nl,nr);
	var maxA = Math.max(nl,nr,sl,sr);
	if(minS>maxN){return true;}
	if(maxN>maxS){return false;}
	if(sr===maxA && sr===nr && nl>=sl){return false;}
	if(sl===maxA && sl===nl && nr>=sr){return false;}
	if(sr===maxA && sr===nr && nl<sl){return true;}
	if(sl===maxA && sl===nl && nr<sr){return true;}
	if(maxS>maxN){return true;} 
	
	return false;
}

function diffSQ(ST1,ST2){
		var rd = dataGrid[ST1].r-dataGrid[ST2].r;
		var gd = dataGrid[ST1].g-dataGrid[ST2].g;
		var bd = dataGrid[ST1].b-dataGrid[ST2].b;
		return maxTest - (rd*rd+gd*gd+bd*bd);
	}

function swapTest2DA(STi, STj, incStep, incLateral){
	
	var indexST = calculateIndexST(STi, STj); // top left corner of 3x4 box
	var indexR = indexST+2*incStep+incLateral;
	var indexL = indexST+incStep+incLateral;
	
	var NoChangeR = diffSQ(indexR,indexST+incStep)+diffSQ(indexR,indexST+2*incStep)*2+ diffSQ(indexR, indexST+3*incStep)+ diffSQ(indexR, indexST+3*incStep+incLateral)*2+ diffSQ(indexR, indexST+3*incStep+incLateral*2)+ diffSQ(indexR, indexST+2*incStep+incLateral*2)*2+diffSQ(indexR,indexST+incStep+2*incLateral);

	var NoChangeL = diffSQ(indexL,indexST+2*incStep)+diffSQ(indexL,indexST)+ diffSQ(indexL, indexST+incStep)*2+ diffSQ(indexL, indexST+incLateral)*2+ diffSQ(indexL, indexST+incLateral*2)+ diffSQ(indexL, indexST+incStep+incLateral*2)*2+diffSQ(indexL,indexST+2*incStep+2*incLateral);

	var SwapR = diffSQ(indexL,indexST+incStep)+diffSQ(indexL,indexST+2*incStep)*2 +diffSQ(indexL, indexST+3*incStep)+ diffSQ(indexL, indexST+3*incStep+incLateral)*2+ diffSQ(indexL, indexST+3*incStep+incLateral*2)+ diffSQ(indexL, indexST+2*incStep+incLateral*2)*2+diffSQ(indexL,indexST+incStep+2*incLateral);

	var SwapL = diffSQ(indexR,indexST+2*incStep)+ diffSQ(indexR,indexST)+ diffSQ(indexR, indexST+incStep)*2+diffSQ(indexR, indexST+incLateral)*2+  diffSQ(indexR, indexST+incLateral*2)+ diffSQ(indexR, indexST+incStep+incLateral*2)*2+diffSQ(indexR,indexST+2*incStep+2*incLateral);

	var Bbool = test(NoChangeL, NoChangeR, SwapL, SwapR);
    Bbool = (Math.random()<flipThreshold)||Bbool;// && (Math.random()<0.1);
    return Bbool;
}	

function fitColor(i1,j1,i2,j2){
	var ST1 = i1*gridSize+j1;
	var ST2 = i2*gridSize+j2;
	var edge = gridSize-1;
	
	var total = 0;
	var cnt = 0;
	if(j2!== 0){total = diffSQ(ST1, ST2-1); cnt++;}
	if(i2!==0 && j2!==0){total += diffSQ(ST1,ST2-gridSize-1); cnt++;}//2;
	if(i2!==0){total += diffSQ(ST1,ST2-gridSize); cnt++;}
	if(i2!==0 && j2!==edge){total += diffSQ(ST1,ST2-gridSize+1); cnt++;}///2;
	if(j2!==edge){total += diffSQ(ST1,ST2+1); cnt++;}
	if(i2!==edge && j2!==0){total += diffSQ(ST1,ST2+gridSize-1); cnt++;}//2;
	if(i2!==edge){total += diffSQ(ST1,ST2+gridSize); cnt++;}
	if(i2!==edge && j2!==edge){total += diffSQ(ST1,ST2+gridSize+1); cnt++;}//2;
	return total/cnt;
}

function trade(i1,j1,i2,j2){
	var one = i1*gridSize+j1;
	var two = i2*gridSize+j2;
	
	var r = dataGrid[one].r;
	var g = dataGrid[one].g;
	var b = dataGrid[one].b;
	
	dataGrid[one].r=dataGrid[two].r;
	dataGrid[one].g=dataGrid[two].g;
	dataGrid[one].b=dataGrid[two].b;
	
	dataGrid[two].r=r;
	dataGrid[two].g=g;
	dataGrid[two].b=b;
}	
	
function testSwapSpaces(i1,j1,i2,j2){
	var OneAtOne = fitColor(i1,j1,i1,j1);
	var TwoAtTwo = fitColor(i2,j2,i2,j2);
	var OneAtTwo = fitColor(i1,j1,i2,j2);
	var TwoAtOne = fitColor(i2,j2,i1,j1);
	if(Math.max(OneAtOne,TwoAtTwo)<Math.max(OneAtTwo,TwoAtOne)){trade(i1,j1,i2,j2);}
}	
	
function swapCells(STi, STj, incStep){
	var indexST = calculateIndexST(STi, STj);
	var zero = indexST;
	var one = indexST+incStep;
	var two = indexST+2*incStep;
	
	var r = dataGrid[one].r;
	var g = dataGrid[one].g;
	var b = dataGrid[one].b;
	
	dataGrid[one].r=dataGrid[two].r;
	dataGrid[one].g=dataGrid[two].g;
	dataGrid[one].b=dataGrid[two].b;
	
	dataGrid[two].r=r;
	dataGrid[two].g=g;
	dataGrid[two].b=b;
	//drawCanvas1();
};

function interiorHorizontal(){	// internal box i=row, j=columns
	for(var i=0; i<gridSize-2;i++){
		for(var j=0; j< gridSize-3;j++){
			//if(swapTest(i,j,1)){swapCells(i,j,1);}
			if(swapTest2DA(i,j,1,gridSize)){swapCells(i+1,j+1,1);}
		}
	}
}

function interiorVertical(){
	for(var i=0; i<gridSize-3;i++){
		for(var j=0; j< gridSize-2;j++){
			if(swapTest2DA(i,j,gridSize,1)){swapCells(i+1,j+1,gridSize);}
		}
	}
}

function middleSwap(){
for (i=0;i<gridSize;i++){
	var iIndex1 = randGS(gridSize);
	var jIndex1 = randGS(gridSize);
	var iIndex2 = randGS(gridSize);
	var jIndex2 = randGS(gridSize);
	if(iIndex1!==iIndex2 && jIndex1!==jIndex2){	testSwapSpaces(iIndex1,jIndex1,iIndex2,jIndex2);}
}}

function edgewalk(){	// left side
	for ( var i = 0; i< gridSize; i++){
		var x = Math.floor(Math.random()*gridSize);
		//left edge increment=1
		if(swapTestEdge(x,2,-1)){swapCells(x, 2, -1);}
		//right edge increment=-4
		if(swapTestEdge(x,gridSize-3,1)){swapCells(x, gridSize-3, 1);}
		//top edge increment=gridSize
		if(swapTestEdge(2,x,-gridSize)){swapCells(2, x, -gridSize);}
		//bottom edge increment=-gridSize
		if(swapTestEdge(gridSize-3, x,gridSize)){swapCells(gridSize-3, x, gridSize);}
	}		
}

function smooth(){
	screenDraw++;
	if(flipThreshold>0.000001){flipThreshold= flipThreshold*0.95;}
	document.getElementById("Threshold").innerHTML=flipThreshold.toFixed(5);
	document.getElementById("screenDraw").innerHTML=screenDraw.toFixed(0);
	middleSwap();
	//interiorHorizontal();
	//interiorVertical();
	//edgewalk();
}

function cycle(myVarr){
	smooth();
	drawCanvas1(); 
	if(serviceFlag){
		clearInterval(myVarr);
		start();
	}
}

var myVar;

function start(){
	myVar=setInterval(function(){cycle(myVar)},screenDelay);
}

function stop(){clearInterval(myVar);}

function cycleDelay(){
	var dropdownDelay = document.getElementById("select3");
	screenDelay = parseInt(dropdownDelay.options[dropdownDelay.selectedIndex].value);
	serviceFlag = true;
}

function PausePlay(){
	Pause = !Pause;
	if(Pause){stop(); document.getElementById("PausePlay").innerHTML="Play";}
	if(!Pause){start();	document.getElementById("PausePlay").innerHTML="Pause";}
}

OnChange();
drawCanvas1();
start();

//smooth();