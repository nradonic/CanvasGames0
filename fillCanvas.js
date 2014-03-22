function rand1(){
	return Math.floor(Math.random()*4)*85;
}

var flipThreshold = 0.5;
var gridSize = 3;
var gridSize2 = gridSize*gridSize;
function gridCell(rc,gc,bc){this.r=rc,this.g=gc,this.b=bc};

var dataGrid = new Array(gridSize2);



function OnChange(dropdown)
{
    var myindex  = dropdown.selectedIndex;
    var SelValue = dropdown.options[myindex].value;
    gridSize = parseInt(SelValue);
    gridSize2 = gridSize*gridSize;   
    dataGrid = new Array(gridSize2);
    for(i=0;i<gridSize2;i++){dataGrid[i]=new gridCell(rand1(),0,0);} 
    flipThreshold =0.5; 
    return true;
}
function drawCanvas1(){
	var c=document.getElementById("drawHere");
	var ctx=c.getContext("2d");
	var myScreen = 800;
	var myScreen2 = myScreen*myScreen*4;
	var myScreen4 = myScreen*4;
	var scaler =myScreen/gridSize; 
	var canvasData = ctx.getImageData(0,0,myScreen, myScreen);
	
	for(var i = 0; i< myScreen2;i+=4){
		var iS = Math.floor(Math.floor(i/myScreen4 + 0.00001)*gridSize/myScreen+0.00001);
		var jS = Math.floor(((i+0.00001)%myScreen4)*gridSize/myScreen4+0.00001)+iS;
	
		canvasData.data[i]=dataGrid[jS].r;
		canvasData.data[i+1]=dataGrid[jS].g;
		canvasData.data[i+2]=dataGrid[jS].b;
		canvasData.data[i+3]=255;
    }
	ctx.putImageData(canvasData,0,0);
};

function calculateIndexST(i, j){ return (j+i*gridSize);}

function swapTestEdge(STi, STj, incStep){
	var indexST = calculateIndexST(STi, STj);
	var zero = indexST;
	var one = indexST+incStep;
	var two = indexST+2*incStep;
	
	var STLr = dataGrid[zero].r-dataGrid[one].r;
	var STLg = dataGrid[zero].g-dataGrid[one].g;
	var STLb = dataGrid[zero].b-dataGrid[one].b;
    var STLeft = STLr*STLr +STLg*STLg+STLb*STLb;

	var STRr = dataGrid[two].r-dataGrid[zero].r;
	var STRg = dataGrid[two].g-dataGrid[zero].g;
	var STRb = dataGrid[two].b-dataGrid[zero].b;
    var STRight = STRr*STRr +STRg*STRg +STRb*STRb;
    var Bbool =  STRight>STLeft; 
    //Bbool = (Math.random()>flipThreshold)||Bbool;
    return Bbool;
};
	
function swapTest(STi, STj, incStep){
	var indexST = calculateIndexST(STi, STj);
	var zero = indexST;
	var one = indexST+incStep;
	var two = indexST+2*incStep;
	var three = indexST+3*incStep;
	
	var STLr = dataGrid[zero].r-dataGrid[one].r;
	var STLg = dataGrid[zero].g-dataGrid[one].g;
	var STLb = dataGrid[zero].b-dataGrid[one].b;
	
	var STRr = dataGrid[two].r-dataGrid[three].r;
	var STRg = dataGrid[two].g-dataGrid[three].g;
	var STRb = dataGrid[two].b-dataGrid[three].b;
		
    var STLeft = STLr*STLr +STLg*STLg +STLb*STLb +STRr*STRr +STRg*STRg +STRb*STRb;

	STLr = dataGrid[three].r-dataGrid[one].r;
	STLg = dataGrid[three].g-dataGrid[one].g;
	STLb = dataGrid[three].b-dataGrid[one].b;
	
	STRr = dataGrid[two].r-dataGrid[zero].r;
	STRg = dataGrid[two].g-dataGrid[zero].g;
	STRb = dataGrid[two].b-dataGrid[zero].b;

	var STRight = STLr*STLr +STLg*STLg +STLb*STLb +STRr*STRr +STRg*STRg +STRb*STRb;
	var Bbool =  STRight>STLeft;
    //Bbool = (Math.random()<flipThreshold)||Bbool;
    return Bbool;
};		

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
	drawCanvas1();
};

function interiorHorizontal(){	// internal box i=row, j=columns
	for(var i=0; i<gridSize-1;i++){
		for(var j=0; j< gridSize-3;j++){
			if(swapTest(i,j,1)){swapCells(i,j,1);}
		}
	}
}

function interiorVertical(){
	for(var i=0; i<gridSize-3;i++){
		for(var j=0; j< gridSize-1;j++){
			if(swapTest(i,j,gridSize)){swapCells(i,j,gridSize);}
		}
	}
}

function edgewalk(){	// left side
	for ( var i = 0; i< gridSize-1; i++){
		//left edge increment=1
		if(swapTestEdge(i,2,-1)){swapCells(i, 2, -1);}
		//right edge increment=-4
		if(swapTestEdge(i,gridSize-3,1)){swapCells(i, gridSize-3, 1);}
		//top edge increment=gridSize
		if(swapTestEdge(2,i,-gridSize)){swapCells(2, i, -gridSize);}
		//bottom edge increment=-gridSize
		if(swapTestEdge(gridSize-3, i,gridSize)){swapCells(gridSize-3, i, gridSize);}
	}		
}

function smooth(){
	flipThreshold = flipThreshold*0.95;
	document.getElementById("Threshold").innerHTML=flipThreshold;
	interiorHorizontal();
	interiorVertical();
	edgewalk();
}

function cycle(myVarr){
	if(flipThreshold>0.0001){ smooth();}else{clearInterval(myVarr);} ;
	drawCanvas1(); 
}

OnChange(document.getElementById("select1"));
drawCanvas1();
var myVar=setInterval(function(){cycle(myVar)},1000);

//smooth();