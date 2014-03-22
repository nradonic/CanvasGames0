function rand1(){return Math.floor(Math.random()*2)*255;}
var flipThreshold = 0.5;
var gridSize = 10;
var gridSize2 = gridSize*gridSize;
function gridCell(){this.r=rand1(),this.g=0,this.b=0};

var dataGrid = new Array(gridSize2);
for(i=0;i<gridSize2;i++){dataGrid[i]=new gridCell();} 

function drawCanvas1(){
	var c=document.getElementById("drawHere");
	var ctx=c.getContext("2d");
	var myScreen = 800;
	var myScreen2 = myScreen*myScreen*4;
	var myScreen4 = myScreen*4;
	var scaler =myScreen/gridSize; 
	var canvasData = ctx.getImageData(0,0,myScreen, myScreen);
	
	for(var i = 0; i< myScreen2;i+=4){
		var iS = Math.floor(Math.floor(i/myScreen4)*gridSize/myScreen);
		var jS = Math.floor((i%myScreen4)*gridSize/myScreen4)+iS;
	
		canvasData.data[i]=dataGrid[jS].r;
		canvasData.data[i+1]=dataGrid[jS].g;
		canvasData.data[i+2]=dataGrid[jS].b;
		canvasData.data[i+3]=255;
    }
	ctx.putImageData(canvasData,0,0);
};



function smooth(){
	
	flipThreshold = flipThreshold*0.95;
	document.getElementById("Threshold").innerHTML=flipThreshold;
	
	function calculateIndexST(i, j){ return (j+i*gridSize);}
	
	function swapTest(STi, STj, incStep){
		var indexST = calculateIndexST(STi, STj);
 		var STLr = dataGrid[indexST].r-dataGrid[indexST+incStep].r;
 		var STLg = dataGrid[indexST].g-dataGrid[indexST+incStep].g;
 		var STLb = dataGrid[indexST].b-dataGrid[indexST+incStep].b;
 		
 		var STRr = dataGrid[indexST+2*incStep].r-dataGrid[indexST+incStep*3].r;
 		var STRg = dataGrid[indexST+2*incStep].g-dataGrid[indexST+incStep*3].g;
 		var STRb = dataGrid[indexST+2*incStep].b-dataGrid[indexST+incStep*3].b;
 		
        var STLeft = STLr*STLr+STLg*STLg+STLb*STLb + STRr*STRr +STRg*STRg+STRb*STRb;
 
		STLr = dataGrid[indexST+3*incStep].r-dataGrid[indexST+incStep].r;
 		STLg = dataGrid[indexST+3*incStep].g-dataGrid[indexST+incStep].g;
 		STLb = dataGrid[indexST+3*incStep].b-dataGrid[indexST+incStep].b;
 		
 		STRr = dataGrid[indexST+2*incStep].r-dataGrid[indexST].r;
 		STRg = dataGrid[indexST+2*incStep].g-dataGrid[indexST].g;
 		STRb = dataGrid[indexST+2*incStep].b-dataGrid[indexST].b;

  		var STRight = STLr*STLr+STLg*STLg+STLb*STLb + STRr*STRr +STRg*STRg+STRb*STRb;
  		
  		var Bbool =  STRight>STLeft;
	    Bbool = (Math.random()<flipThreshold)||Bbool;
	    return Bbool;
	};
	
	function swapTestEdge(STi, STj, incStep){
		var indexST = calculateIndexST(STi, STj);
 		var STLr = dataGrid[indexST].r-dataGrid[indexST+incStep].r;
 		var STLg = dataGrid[indexST].g-dataGrid[indexST+incStep].g;
 		var STLb = dataGrid[indexST].b-dataGrid[indexST+incStep].b;

        var STLeft = STRr*STRr +STRg*STRg+STRb*STRb;
 
  		var STRr = dataGrid[indexST+2*incStep].r-dataGrid[indexST].r;
 		var STRg = dataGrid[indexST+2*incStep].g-dataGrid[indexST].g;
 		var STRb = dataGrid[indexST+2*incStep].b-dataGrid[indexST].b;
        var STRight = STRr*STRr +STRg*STRg+STRb*STRb;
        var Bbool =  STRight>STLeft;
        Bbool = (Math.random()>flipThreshold)||Bbool;
	    return Bbool;
	};

	function swapCells(STi, STj, incStep){
		var indexST = calculateIndexST(STi, STj);
		var r = dataGrid[indexST+incStep].r;
		var g = dataGrid[indexST+incStep].g;
		var b = dataGrid[indexST+incStep].b;
		dataGrid[indexST+incStep].r=dataGrid[indexST+2*incStep].r;
		dataGrid[indexST+incStep].g=dataGrid[indexST+2*incStep].g;
		dataGrid[indexST+incStep].b=dataGrid[indexST+2*incStep].b;
		
		dataGrid[indexST+2*incStep].r=r;
		dataGrid[indexST+2*incStep].g=g;
		dataGrid[indexST+2*incStep].b=b;
	};

	
	// internal box i=row, j=columns
	for(var i=0; i<gridSize-1;i++){
		for(var j=0; j< gridSize-4;j++){
			if(swapTest(i,j,1)){swapCells(i,j,1);}
		}
	}
	for(var i=0; i<gridSize-4;i++){
		for(var j=0; j< gridSize-1;j++){
			if(swapTest(i,j,gridSize)){swapCells(i,j,gridSize);}
		}
	}
	// left side
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

function cycle(myVarr){if(flipThreshold>0.0001){ drawCanvas1(); smooth();}else{clearInterval(myVarr);}}
var myVar=setInterval(function(){cycle(myVar)},1000);
//smooth();