let tileSize=36;
let rows=18;
let columns=18;


let board;
let boardWidth=tileSize*columns;
let boardHeight=tileSize*rows;
let context;


//ship
let shipWidth=tileSize*2;
let shipHeight=tileSize;
let shipX=tileSize*columns/2 -tileSize;
let shipY=tileSize*rows -tileSize*2;

let ship={
    x:shipX,
    y:shipY,
    width:shipWidth,
    height:shipHeight
}


let shipImg;
let shipVelocityX=tileSize;



//alien
let alienArray=[];
let alienWidth=tileSize*2;
let alienHeight=tileSize;
let alienX=tileSize;
let alienY=tileSize;
// let alienImg;
let alienImages = [];

let alienRows=2;
let alienColums=3;
let alienCount=0;
let alienVelocity=1;//alien moving speed


//bullets
let bulletArray=[];
    let bulletVelocity=-10;//bullet moving speed
  

//score
let score=0;
let gameOver=false;




window.onload=function(){
    board=document.getElementById("board");
    board.width=boardWidth;
    board.height=boardHeight;

    context=board.getContext("2d");//used for drawing in board

    //load Image
    shipImg=new Image();
    shipImg.src="/assets/ship.png";
    shipImg.onload= function(){
        context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);
    }
    
    // alienImg=new Image();
    // alienImg.src="/assets/alien.png";
 // Array to store the alien images

alienImages[0] = new Image();
alienImages[0].src = "/assets/alien-cyan.png";  
alienImages[1] = new Image();
alienImages[1].src = "/assets/alien-magenta.png";  
alienImages[2] = new Image();
alienImages[2].src = "/assets/alien-yellow.png";  

    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown",moveShip);
    document.addEventListener("keyup",shoot);


}

function update(){
    requestAnimationFrame(update);

if(gameOver){
    return; 
}

    //clear the stack
    context.clearRect(0,0,board.width,board.height);
    //ship
    context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);
    //alien
    for(let i=0;i<alienArray.length;i++){
        let alien=alienArray[i];
        if(alien.alive){
            alien.x+=alienVelocity;
           


            //if alien touches the board
            if(alien.x + alien.width>=board.width || alien.x<=0){
                alienVelocity*=-1;
                alien.x+=alienVelocity*2;

                //move all aliens up by one row
                for(let j=0;j<alienArray.length;j++){
                    alienArray[j].y+=alien.height;
                }
            }
            context.drawImage(alien.img,alien.x,alien.y,alien.width,alien.height);

            if(alien.y>=ship.y){
                gameOver=true;
            }
        }
    }

    //bullets
    for(let i=0;i<bulletArray.length;i++){
        let bullet=bulletArray[i];
        bullet.y+=bulletVelocity;
        context.fillStyle="white";
        context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);

        //bullet collision for alien
        for(let j=0;j<alienArray.length;j++){
            let alien=alienArray[j];
            if(!bullet.used && alien.alive && detectCollision(bullet,alien)){
                bullet.used=true;
                alien.alive=false;
                alienCount--;
                score+=100;


            }

        }
    }
    //clear bullets
    while(bulletArray.length>0 && (bulletArray[0].used || bulletArray[0].y<0)){
        bulletArray.shift();//remove the first element of the array

        

    }
    //next level

    if(alienCount==0){
        //increase the number of aliens
        alienColums=Math.min(alienColums+1,columns/2 -2);
        alienRows=Math.min(alienRows+1,rows-4);
        alienVelocity+=0.2;
        alienArray=[];
        bulletArray=[];


        createAliens();

        
    }

    //score
    context.fillStyle="white";
    context.font="18px courier";
    context.fillText(score,5,20);

}


function moveShip(e){
    if(gameOver){
        return;
    }
   if(e.code=="ArrowLeft" && ship.x-shipVelocityX>=0){
    ship.x-=shipVelocityX;//moving left
   }
   if(e.code=="ArrowRight" && ship.x+shipVelocityX+ship.width<=board.width) {
    ship.x+=shipVelocityX;//moving right

   }
}

function createAliens(){
    for(let c=0;c<alienColums;c++){
        for(let r=0;r<alienRows;r++){
            let randomAlienImg = alienImages[Math.floor(Math.random() * 3)];
            let alien={
                img: randomAlienImg,
                x:alienX+c*alienWidth,
                y:alienY+r*alienHeight,
                width:alienWidth,
                height:alienHeight,

                alive:true
            }

            alienArray.push(alien);

        }
    }
    alienCount=alienArray.length;


}


function shoot(e){
    if(gameOver){
        return;
    }
    if(e.code=="Space"){
        //shoot
        let bullet={
            x:ship.x+shipWidth*17/36,
            y:ship.y,
            width: tileSize/8,
            height:tileSize/2,
            used:false

        }
        bulletArray.push(bullet);

    }
}



function detectCollision(a,b){
    return a.x< b.x + b.width &&  //a's top left corner doesnt reach b's topleft corner
           a.x + a.width > b.x && //a's top right corner passes b's topleft corner
           a.y< b.y +b.height &&  //a's top left corner doesnt reach b's bottom left corner
           a.y + a.height >b.y;  //a's bottom left corner passes b's top left corner

            
}