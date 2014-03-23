function rand1(ColorSpace){
	return Math.floor(Math.floor(Math.random()*ColorSpace)*255/(ColorSpace-1));
}

var flipThreshold = 0.5;
var gridSize = 3;
var gridSize2 = gridSize*gridSize;
function gridCell(rc,gc,bc){this.r=rc,this.g=gc,this.b=bc};

var dataGrid = new Array(gridSize2);

function OnChange()
{
	var dropdownSize = document.getElementById("select1")
    var myindex  = dropdownSize.selectedIndex;
    var SelValue = dropdownSize.options[myindex].value;
    gridSize = parseInt(SelValue);
    gridSize2 = gridSize*gridSize;   
    dataGrid = new Array(gridSize2);
    
    var dropdownColor = document.getElementById("select2")
    var mycolors  = dropdownColor.selectedIndex;
    var SelColorValue = dropdownColor.options[mycolors].value;
    var ColorSpace = parseInt(SelColorValue);
    
    for(i=0;i<gridSize2;i++){dataGrid[i]=new gridCell(rand1(ColorSpace),rand1(ColorSpace),rand1(ColorSpace));} 
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
	ctx.beginPath();
	var squareSide = myScreen/gridSize;
	for(var i = 0; i< gridSize2;i++){
		var squareRow = Math.floor(i/gridSize);
		var squareCol = Math.floor(i%gridSize);

		var x = squareRow*squareSide;
		var y = squareCol*squareSide;
		
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
	
	var STLr = tff - Math.abs(dataGrid[zero].r-dataGrid[one].r);
	var STLg = tff - Math.abs(dataGrid[zero].g-dataGrid[one].g);
	var STLb = tff - Math.abs(dataGrid[zero].b-dataGrid[one].b);
    var STLeft = STLr*STLr +STLg*STLg+STLb*STLb;

	var STRr = tff - Math.abs(dataGrid[two].r-dataGrid[zero].r);
	var STRg = tff - Math.abs(dataGrid[two].g-dataGrid[zero].g);
	var STRb = tff - Math.abs(dataGrid[two].b-dataGrid[zero].b);
    var STRight = STRr*STRr +STRg*STRg +STRb*STRb;
    var Bbool =  STRight>STLeft; 
    Bbool = (Math.random()>flipThreshold)||Bbool;
    return Bbool;
};
	
function swatTest2D(STi, STj, incStep, incLateral){
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
	var DiffRr = tff - Math.abs(rSum);
	var DiffRg = tff - Math.abs(gSum);
	var DiffRb = tff - Math.abs(bSum);
		
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
	var DiffLr = tff - Math.abs(rSum);
	var DiffLg = tff - Math.abs(gSum);
	var DiffLb = tff - Math.abs(bSum);
	var NoChange = DiffRr*DiffRr+DiffRg*DiffRg+DiffRb*DiffRb+DiffLr*DiffLr+DiffLg*DiffLg+DiffLb*DiffLb;
	
	rSum = SRr;
	gSum = SRg;
	bSum = SRb;
	addRGB(indexST+incStep+incLateral);
	DiffRr = tff - Math.abs(rSum);
	DiffRg = tff - Math.abs(gSum);
	DiffRb = tff - Math.abs(bSum);

	rSum = SLr;
	gSum = SLg;
	bSum = SLb;
	addRGB(indexST+2*incStep+incLateral);
	DiffLr = tff - Math.abs(rSum);
	DiffLg = tff - Math.abs(gSum);
	DiffLb = tff - Math.abs(bSum);
	var Swap = DiffRr*DiffRr+DiffRg*DiffRg+DiffRb*DiffRb+DiffLr*DiffLr+DiffLg*DiffLg+DiffLb*DiffLb;
	
	var Bbool =  Swap>NoChange;
    Bbool = (Math.random()<flipThreshold)||Bbool && Math.random()<0.1;
    return Bbool;

}	
	
function swapTest(STi, STj, incStep){
	var indexST = calculateIndexST(STi, STj);
	var zero = indexST;
	var one = indexST+incStep;
	var two = indexST+2*incStep;
	var three = indexST+3*incStep;
	var tff = 255;
		
	var STLr = tff - Math.abs(dataGrid[zero].r-dataGrid[one].r);
	var STLg = tff - Math.abs(dataGrid[zero].g-dataGrid[one].g);
	var STLb = tff - Math.abs(dataGrid[zero].b-dataGrid[one].b);
	
	var STRr = tff - Math.abs(dataGrid[two].r-dataGrid[three].r);
	var STRg = tff - Math.abs(dataGrid[two].g-dataGrid[three].g);
	var STRb = tff - Math.abs(dataGrid[two].b-dataGrid[three].b);
		
    var STLeft = STLr*STLr +STLg*STLg +STLb*STLb +STRr*STRr +STRg*STRg +STRb*STRb;

	STLr = dataGrid[three].r-dataGrid[one].r;
	STLg = dataGrid[three].g-dataGrid[one].g;
	STLb = dataGrid[three].b-dataGrid[one].b;
	
	STRr = dataGrid[two].r-dataGrid[zero].r;
	STRg = dataGrid[two].g-dataGrid[zero].g;
	STRb = dataGrid[two].b-dataGrid[zero].b;

	var STRight = STLr*STLr +STLg*STLg +STLb*STLb +STRr*STRr +STRg*STRg +STRb*STRb;
	var Bbool =  STRight>STLeft;
    Bbool = (Math.random()<flipThreshold)||Bbool && Math.random()<0.1;
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
	for(var i=0; i<gridSize-2;i++){
		for(var j=0; j< gridSize-3;j++){
			//if(swapTest(i,j,1)){swapCells(i,j,1);}
			if(swatTest2D(i,j,1,gridSize)){swapCells(i+1,j,1);}
		}
	}
}

function interiorVertical(){
	for(var i=0; i<gridSize-3;i++){
		for(var j=0; j< gridSize-2;j++){
			if(swapTest(i,j,gridSize,1)){swapCells(i,j,gridSize);}
		}
	}
}

function edgewalk(){	// left side
	for ( var i = 0; i< gridSize; i++){
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
	document.getElementById("Threshold").innerHTML=flipThreshold.toFixed(5);
	interiorHorizontal();
	interiorVertical();
	edgewalk();
}

function cycle(myVarr){
	smooth();
	drawCanvas1(); 
}

OnChange(document.getElementById("select1"));
drawCanvas1();
var myVar=setInterval(function(){cycle(myVar)},1000);

//smooth();