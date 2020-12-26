  var trex, trexImg, trexCollided;
  var sun, sunImg;
  var dieSound, checkPointSound, jumpSound;
  var gameOver, gameOverImg;
  var restart, restartImg;
  var edges;
  var ground, groundImg;
  var cloud, cloudImg, cloudGroup;
  var obstacle, obstacleGroup;
  var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
  var score;
  var PLAY = 1;//caps for constant
  var END = 0;//caps for constant
  var gameState = PLAY;

  function preload(){
    //loading animations
    trexImg=loadAnimation("trex1.png","trex3.png","trex4.png");
    sunImg = loadImage("sun.png"); 
    dieSound = loadSound("die[1].mp3");
    checkPointSound = loadSound("checkPoint[1].mp3")
    jumpSound = loadSound("jump[1].mp3");
    groundImg = loadAnimation ("ground2.png");
    cloudImg = loadImage("cloud.png");
    obstacle1 = loadImage("obstacle1[1].png");
    obstacle2 = loadImage("obstacle2[1].png");
    obstacle3 = loadImage("obstacle3[1].png");
    obstacle4 = loadImage("obstacle4[1].png");
    obstacle5 = loadImage("obstacle5[1].png");
    obstacle6 = loadImage("obstacle6[1].png");
    trexCollided = loadImage("trex_collided[1].png");
    restartImg = loadImage("restart[1].png");
    gameOverImg = loadImage("gameOver[1].png");
    
  }

  function setup(){
    createCanvas(600,200);
    
    //additional sun
    sun = createSprite(80,40,20,20);
    sun.addImage(sunImg)
    sun.scale = 0.1;
    
    //creating trex sprite
    trex = createSprite(50,160,20,20);
    trex.addAnimation("dinosaur", trexImg); 
    trex.scale = 0.5;
    trex.addAnimation("trexCollision", trexCollided);
    //creates boundaries
    edges = createEdgeSprites();
    
    //initialising score
    score = 0;
    
    //creates the ground sprite
    ground = createSprite(200,180,400,20);
    ground.addAnimation("floor", groundImg);

    //creates the restart button
    restart = createSprite(300,100);
    restart.addAnimation("RESTART", restartImg);
    restart.scale = 0.5;
    
    //creates the game over image   
    gameOver = createSprite(300,60);
    gameOver.addAnimation("GAMEOVER", gameOverImg);
    gameOver.scale = 0.5;
    gameOver.visible = false;
    
    //creates invisible ground
    invisibleGround = createSprite(200,197,400,15);
    invisibleGround.visible = false;
    
    //creates an object of the class Group
    obstacleGroup = new Group();
    cloudGroup = new Group();
    
    //every sprite has a collision radius i.e. a skin or layer around it. Can be a circle or rect. setColider("shape", x-offset, y-offet, width/radius, height)
    //trex.debug = true;
    trex.setCollider("circle", 0, 0, 40);
  }

  function draw (){
    
    background("lightblue");
    
    textSize(20);
    text("score : " + score,470,30);      

    //to make it stay on the ground
    trex.velocityY = trex.velocityY + 0.5;
    
    //keeps the trex on the ground
    trex.collide(invisibleGround);    
    

    console.log("gameState:" + gameState);
    
  if (gameState===PLAY){
    //to make the trex jump
      if (keyDown("space") && trex.y > 145){
      trex.velocityY = -8;
      jumpSound.play();
      console.log(trex.y);
      }
    trex.changeAnimation("dinosaur", trexImg);     
    restart.visible = false;
    gameOver.visible = false;
    if(score>0 && score%200===0){
      checkPointSound.play();
    }
    
    //makes it an infinite screen
    ground.velocityX = -(4 + 3 * score/100);
    
    //loops the ground repeatedly
      if (ground.x < 0 ){
     ground.x = ground.width/2;
    }      
    if (trex.isTouching(obstacleGroup)){
      gameState=END;
      dieSound.play();
    } 
    score = score + Math.round(getFrameRate()/60);
    spawnObstacles();
    spawnClouds();
 }
    
    else if(gameState===END){
      ground.velocityX = 0;
      obstacleGroup.setVelocityXEach(0);
      cloudGroup.setVelocityXEach(0);
      score = score;
      //resolving dissapearing objects by giving a negative lifetime
      if (mousePressedOver(restart)){
        console.log("Mouse Pressed")
        reset();
      }
      obstacleGroup.setLifetimeEach(-1);
      cloudGroup.setLifetimeEach(-1);
      gameOver.visible = true;
      restart.visible = true;
  trex.changeAnimation("trexCollision",trexCollided);
    }
    
    drawSprites();
  }

  //spawns clouds at random positions
  function spawnClouds(){
  if (frameCount % 60 === 0){
    cloud = createSprite(600,Math.round(random(20,80)),20,20);
    cloud.velocityX = -5;
    cloud.addImage(cloudImg);
    cloud.scale = 0.6;
    cloud.lifetime = 200;//[memory leak resolved] lifetime = distance/velocity 
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    console.log(trex.depth);
    console.log(cloud.depth);
    cloudGroup.add(cloud);
  }
  
}

  function spawnObstacles(){
  if (frameCount % 70 === 0){
    
    obstacle = createSprite (600,170,10,10);
    obstacle.velocityX = -(4+2*score/100);
    obstacle.scale = 0.46;
    obstacle.lifetime = 200;
    //generating random obstacles
    var ranNum = Math.round(random(1,6));
    switch(ranNum){
      case 1 : obstacle.addImage(obstacle1);
               break;
      case 2 : obstacle.addImage(obstacle2);
               break;      
      case 3 : obstacle.addImage(obstacle3);
               break;
      case 4 : obstacle.addImage(obstacle4);
               break; 
      case 5 : obstacle.addImage(obstacle5);
               break;               
      case 6 : obstacle.addImage(obstacle6);
               break;    
      default : break;   
    }
    obstacleGroup.add(obstacle);  
  }
  }
  
function reset(){
  gameOver.visible = false;
  restart.visible = false;
  console.log("reset");
  gameState = PLAY;
  score = 0;
  cloudGroup.destroyEach();
  obstacleGroup.destroyEach();

}
    

