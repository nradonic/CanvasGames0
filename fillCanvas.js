function rand1(){return Math.floor(Math.random()*256);}

function drawCanvas1(){
	var c=document.getElementById("drawHere");
	var ctx=c.getContext("2d");
	gridSize = 100;
	gridSize2 = gridSize*gridSize*4;
	
	var canvasData = ctx.getImageData(0,0,gridSize, gridSize);
	for(var i = 0; i< gridSize2;i=i+4){
		canvasData.data[i]=rand1();
		canvasData.data[i+1]=rand1();
		canvasData.data[i+2]=rand1();
		canvasData.data[i+3]=255;
	}
	ctx.putImageData(canvasData,0,0);
};

function smooth(){
	var c=document.getElementById("drawHere");
	var ctx=c.getContext("2d");
	canvasData = ctx.getImageData(0,0,gridSize, gridSize);

	function calculateIndexST(i, j){ return (j+i*gridSize)*4;}
	
	function swapTest(STi, STj, incStep){
		var indexST = calculateIndexST(STi, STj);
 		var STLr = (canvasData.data[indexST]-canvasData.data[indexST+incStep]);
 		var STLg = (canvasData.data[indexST+1]-canvasData.data[indexST+incStep+1]);
 		var STLb = (canvasData.data[indexST+2]-canvasData.data[indexST+incStep+2]);
 		var STRr = (canvasData.data[indexST+2*incStep]-canvasData.data[indexST+incStep*3]);
 		var STRg = (canvasData.data[indexST+2*incStep+1]-canvasData.data[indexST+incStep*3+1]);
 		var STRb = (canvasData.data[indexST+2*incStep+2]-canvasData.data[indexST+incStep*3+2]);
        var STLeft = STLr*STLr+STLg*STLg+STLb*STLb + STRr*STRr +STRg*STRg+STRb*STRb;
 
  		STLr = (canvasData.data[indexST]-canvasData.data[indexST+2*incStep]);
 		STLg = (canvasData.data[indexST+1]-canvasData.data[indexST+2*incStep+1]);
 		STLb = (canvasData.data[indexST+2]-canvasData.data[indexST+2*incStep+2]);
 		STRr = (canvasData.data[indexST+3*incStep]-canvasData.data[indexST+incStep]);
 		STRg = (canvasData.data[indexST+3*incStep+1]-canvasData.data[indexST+incStep+1]);
 		STRb = (canvasData.data[indexST+3*incStep+2]-canvasData.data[indexST+incStep+2]);
        var STRight = STLr*STLr+STLg*STLg+STLb*STLb + STRr*STRr +STRg*STRg+STRb*STRb;
		return STRight>STLeft;
	};
	
	function swapTestEdge(STi, STj, incStep){
		var indexST = calculateIndexST(STi, STj);
 		var STRr = (canvasData.data[indexST+2*incStep]-canvasData.data[indexST+incStep]);
 		var STRg = (canvasData.data[indexST+2*incStep+1]-canvasData.data[indexST+incStep+1]);
 		var STRb = (canvasData.data[indexST+2*incStep+2]-canvasData.data[indexST+incStep+2]);
        var STLeft = STRr*STRr +STRg*STRg+STRb*STRb;
 
  		STRr = (canvasData.data[indexST+2*incStep]-canvasData.data[indexST]);
 		STRg = (canvasData.data[indexST+2*incStep+1]-canvasData.data[indexST+1]);
 		STRb = (canvasData.data[indexST+2*incStep+2]-canvasData.data[indexST+2]);
        var STRight = STRr*STRr +STRg*STRg+STRb*STRb;
		return STRight>STLeft;
	};

	function swapCellsInterior(STi, STj, incStep){
		var indexST = calculateIndexST(STi, STj);
		var r = canvasData.data[indexST+incStep];
		var g = canvasData.data[indexST+incStep+1];
		var b = canvasData.data[indexST+incStep+2];
		var a = canvasData.data[indexST+incStep+3];
		canvasData.data[indexST+incStep]=canvasData.data[indexST+2*incStep];
		canvasData.data[indexST+incStep+1]=canvasData.data[indexST+2*incStep+1];
		canvasData.data[indexST+incStep+2]=canvasData.data[indexST+2*incStep+2];
		canvasData.data[indexST+incStep+3]=canvasData.data[indexST+2*incStep+3];
		canvasData.data[indexST+2*incStep]=r;
		canvasData.data[indexST+2*incStep+1]=g;
		canvasData.data[indexST+2*incStep+2]=b;
		canvasData.data[indexST+2*incStep+3]=a;
	};

	function swapEdgeBlock(STi, STj, incStep){
		var indexST = calculateIndexST(STi, STj);
		var r = canvasData.data[indexST+incStep];
		var g = canvasData.data[indexST+incStep+1];
		var b = canvasData.data[indexST+incStep+2];
		var a = canvasData.data[indexST+incStep+3];
		canvasData.data[indexST+incStep]=canvasData.data[indexST];
		canvasData.data[indexST+incStep+1]=canvasData.data[indexST+1];
		canvasData.data[indexST+incStep+2]=canvasData.data[indexST+2];
		canvasData.data[indexST+incStep+3]=canvasData.data[indexST+3];
		canvasData.data[indexST]=r;
		canvasData.data[indexST+1]=g;
		canvasData.data[indexST+2]=b;
		canvasData.data[indexST+3]=a;
	};

	// internal box i=row, j=columns
	for(var i=0; i<gridSize-4;i++){
		for(var j=0; j< gridSize-4;j++){
			if(swapTest(i,j,4)){swapCellsInterior(i,j,4);}
			if(swapTest(i,j,gridSize*4)){swapCellsInterior(i,j,gridSize*4);}
		}
	}
	// left side
	for ( var i = 0; i< gridSize-1; i++){
		//left edge increment=4
		if(swapTestEdge(i,0,4)){swapEdgeBlock(i, 0, 4);}
		//right edge increment=-4
		if(swapTestEdge(i,gridSize-1,-4)){swapEdgeBlock(i, gridSize-1, -4);}
		//top edge increment=gridSize
		if(swapTestEdge(0,i,gridSize*4)){swapEdgeBlock(0, i, gridSize*4);}
		//bottom edge increment=-gridSize
		if(swapTestEdge(gridSize-1, i,-gridSize)){swapEdgeBlock(gridSize-1, i, -gridSize);}
	}		
	ctx.putImageData(canvasData,0,0);
//	};

}

drawCanvas1();
var myVar=setInterval(function(){smooth()},1000);
//smooth();