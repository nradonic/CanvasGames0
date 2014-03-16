function rand1(){return Math.floor(Math.random()*256);}

function drawCanvas1(){
	var c=document.getElementById("drawHere");
	var ctx=c.getContext("2d");
	gridSize = 200;
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

	function swapTestHor(indexST){
 		var STLr = (canvasData.data[indexST]-canvasData.data[indexST+4]);
 		var STLb = (canvasData.data[indexST+1]-canvasData.data[indexST+5]);
 		var STLg = (canvasData.data[indexST+2]-canvasData.data[indexST+6]);
 		var STRr = (canvasData.data[indexST+8]-canvasData.data[indexST+12]);
 		var STRg = (canvasData.data[indexST+9]-canvasData.data[indexST+13]);
 		var STRb = (canvasData.data[indexST+10]-canvasData.data[indexST+14]);
        var STLeft = STLr*STLr+STLg*STLg+STLb*STLb;
 
  		STLr = (canvasData.data[indexST]-canvasData.data[indexST+8]);
 		STLb = (canvasData.data[indexST+1]-canvasData.data[indexST+9]);
 		STLg = (canvasData.data[indexST+2]-canvasData.data[indexST+10]);
 		STRr = (canvasData.data[indexST+12]-canvasData.data[indexST+4]);
 		STRg = (canvasData.data[indexST+13]-canvasData.data[indexST+5]);
 		STRb = (canvasData.data[indexST+14]-canvasData.data[indexST+6]);
        var STRight = STLr*STLr+STLg*STLg+STLb*STLb;
		return STRight>STLeft;
	};

	function swapTestVert(indexST){
 		var STLr = (canvasData.data[indexST]-canvasData.data[indexST+4*gridSize]);
 		var STLb = (canvasData.data[indexST+1]-canvasData.data[indexST+4*gridSize+1]);
 		var STLg = (canvasData.data[indexST+2]-canvasData.data[indexST+4*gridSize+2]);
 		var STRr = (canvasData.data[indexST+8*gridSize]-canvasData.data[indexST+12*gridSize]);
 		var STRg = (canvasData.data[indexST+8*gridSize+1]-canvasData.data[indexST+12*gridSize+1]);
 		var STRb = (canvasData.data[indexST+8*gridSize+2]-canvasData.data[indexST+12*gridSize+2]);
        var STLeft = STLr*STLr+STLg*STLg+STLb*STLb;
 
  		STLr = (canvasData.data[indexST]-canvasData.data[indexST+8*gridSize]);
 		STLb = (canvasData.data[indexST+1]-canvasData.data[indexST+8*gridSize+1]);
 		STLg = (canvasData.data[indexST+2]-canvasData.data[indexST+8*gridSize+2]);
 		STRr = (canvasData.data[indexST+12*gridSize]-canvasData.data[indexST+4*gridSize]);
 		STRg = (canvasData.data[indexST+12*gridSize+1]-canvasData.data[indexST+4*gridSize+1]);
 		STRb = (canvasData.data[indexST+12*gridSize+2]-canvasData.data[indexST+4*gridSize+2]);
        var STRight = STLr*STLr+STLg*STLg+STLb*STLb;
		return STRight>STLeft;
	};

	function swapHorizontal(indexH){
		var r = canvasData.data[index0+4];
		var g = canvasData.data[index0+5];
		var b = canvasData.data[index0+6];
		var a = canvasData.data[index0+7];
		canvasData.data[index0+4]=canvasData.data[index0+8];
		canvasData.data[index0+5]=canvasData.data[index0+9];
		canvasData.data[index0+6]=canvasData.data[index0+10];
		canvasData.data[index0+7]=canvasData.data[index0+11];
		canvasData.data[index0+8]=r;
		canvasData.data[index0+9]=g;
		canvasData.data[index0+10]=b;
		canvasData.data[index0+11]=a;
	};

	function swapVertical(indexH){
		var r = canvasData.data[index0+4*gridSize];
		var g = canvasData.data[index0+4*gridSize+1];
		var b = canvasData.data[index0+4*gridSize+2];
		var a = canvasData.data[index0+4*gridSize+3];
		canvasData.data[index0+4*gridSize]=canvasData.data[index0+8*gridSize];
		canvasData.data[index0+4*gridSize+1]=canvasData.data[index0+8*gridSize+1];
		canvasData.data[index0+4*gridSize+2]=canvasData.data[index0+8*gridSize+2];
		canvasData.data[index0+4*gridSize+3]=canvasData.data[index0+8*gridSize+3];
		canvasData.data[index0+8*gridSize]=r;
		canvasData.data[index0+8*gridSize+1]=g;
		canvasData.data[index0+8*gridSize+2]=b;
		canvasData.data[index0+8*gridSize+3]=a;
	};

//	for(var k=0; k<200; k++){
		for(var i=0; i<gridSize-3;i++){
			for(var j=0; j< gridSize-3;j++){
				var index0 = (j+i*gridSize)*4;
				if(swapTestHor(index0)){swapHorizontal(index0);}
				if(swapTestVert(index0)){swapVertical(index0);}
			}
		}
		ctx.putImageData(canvasData,0,0);
//	};

}

drawCanvas1();
var myVar=setInterval(function(){smooth()},1000);
//smooth();