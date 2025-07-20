//board
let board;
let boardWidth = 380;
let boardHeight = 640;
let context;


//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX= boardWidth/8;
let birdY= boardHeight/2;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,

}


//pipes
let pipeArray =[];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


//physics
let velocityX = -2; // pipe moving left speed
let velocityY = 0; //bird jumping speed
let gravity = 0.2// to get the bird down 


let gameOver = false ;
let score = 0 ;

let birdImg = new Image();

window.onload = function (){
    // Get the canvas element
    board = document.querySelector("#board");
    context = board.getContext("2d");
    board.height = boardHeight;
    board.width = boardWidth;

    //draw bird;
    //context.fillStyle = "green";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //bird img
    
    birdImg.src ="flappybird.gif";
    birdImg.onload = () =>{
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    }

    topPipeImg= new Image();
    topPipeImg.src = "toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottompipe.png";

    requestAnimationFrame(Update);
    setInterval(placePipe, 2000);

    document.addEventListener("keydown", moveBird);
    document.addEventListener("keydown", resetGame);

}

function Update(){

    requestAnimationFrame(Update);

    if(gameOver){

        return;
    }

    context.clearRect(0,0, board.width, board.height);

    velocityY += gravity;
    bird.y += velocityY;
    if (bird.y < 0) {
        bird.y = 0;
        velocityY = 0;
    }

    // prevent bird from falling through the ground
    // if (bird.y + bird.height > boardHeight) {
    //     bird.y = boardHeight - bird.height;
    //     velocityY = 0;
    // }

    if(bird.y >boardHeight){
        gameOver = true;
        console.log("gameOver")
    }

    //image
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //pipe
    
    for(let i = 0; i <pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed= true;
        }


        if(detectCollision(bird, pipe)){
          gameOver = true;
          console.log("gameOver")
        }
    }

    //score
    context.fillStyle ="White";
    context.font = "45px  arial";
    context.fillText(score.toString(), 20, 45)
    

}

function placePipe(){

    if(gameOver){
        context.fillStyle = "red";
        context.font = "30px 'Press Start 2P', system-ui";
        context.textAlign = "center";
        context.margin ="1rem";
        context.fillText("GAME OVER", boardWidth/2, boardHeight / 2 );

        context.fillStyle= "yellow";
        context.font = "25px Arial";
        context.textAlign = "center";
        context.fillText("Your Score: "+ score, boardWidth/2, boardHeight/2 + 50);
        


        return;
    }

    let randomPipe = pipeY - pipeHeight/4 - Math.random()*pipeHeight/2; 
    let openingSpace = boardHeight/4;

    let toppipe = {
        img: topPipeImg,
        x : pipeX,
        y: randomPipe,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }

    pipeArray.push(toppipe);


    let bottomPipe ={
        img: bottomPipeImg,
        x: pipeX,
       y: randomPipe + pipeHeight + openingSpace,
       width: pipeWidth,
       height: pipeHeight ,
       passed:false

    }
    pipeArray.push(bottomPipe);
}


function moveBird(e){
    if (e.code ==="Space" || e.code ==="ArrowUp"){
        velocityY = -6;
    }
}


function detectCollision(a, b){
    return a.x < b.x + b.width && a.x+ a.width >b.x && a.y < b.y +b.height && a.y + a.height> b.y;
}


function resetGame(e) {

    

    if (e.code === "Enter" && gameOver ) {
        // Reset bird position and velocity
        bird.y = boardHeight / 2;
        velocityY = 0;

        // Clear pipes and reset score
        pipeArray = [];
        score = 0;

        // Reset game state
        gameOver = false;
    }
}

const btn = document.querySelector("button");

btn.addEventListener("click", ()=>{
    if(gameOver){
        bird.y = boardHeight/2;
        velocityY=0;
        pipeArray=[];
        score = 0;
        gameOver = false;
    }
})