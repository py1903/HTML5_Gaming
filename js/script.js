var game = new Phaser.Game(1900, 865, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'img/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'img/tiles-1.png');
    game.load.image('bite', 'img/autre.png');
    game.load.spritesheet('dude', 'img/dude.png', 32, 48);
    game.load.spritesheet('dude2', 'img/dude2.png', 32, 48);
    game.load.spritesheet('droid', 'img/droid.png', 32, 32);
    game.load.image('background', 'img/fond.png');
    game.load.image('star', 'img/star2.png');

}

var map;
var tileset;
var layer;
var player;
var player2;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var score = 0;
var score2 = 0;
var scoreText;
var playerText;
var playerText2;
var jump2 = 2;


function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    bg = game.add.tileSprite(0, 0, 2000, 850, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 17, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 2000;

    scoreText = game.add.text(16, 50, 'Score: 0', { fontSize: '32px', fill: '#000' });

    scoreText2 = game.add.text(1740, 50, 'Score: 0', { fontSize: '32px', fill: '#000' });

    playerText = game.add.text(16, 16, 'Joueur 1', {fontSize: '32px', fill: '#000'});

    playerText2 = game.add.text(1740, 16, 'Joueur 2', {fontSize: '32px', fill: '#000'});




    // JOUEUR 1 !

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);



    // JOUEUR 2 !

    player2 = game.add.sprite(1850, 32, 'dude2');
    game.physics.enable(player2, Phaser.Physics.ARCADE);

    player2.body.bounce.y = 0;
    player2.body.collideWorldBounds = true;
    player2.body.setSize(20, 32, 5, 16);

    player2.animations.add('left', [1, 1, 2, 3], 10, true);
    player2.animations.add('turn', [4], 20, true);
    player2.animations.add('right', [5, 6, 7, 8], 10, true);

    jumpButton2 = game.input.keyboard.addKey(Phaser.Keyboard.Z);



    // GESTION DES ETOILES

    stars = game.add.group();


    stars.enableBody = true;

    for (var i = 0; i < 10; i++)

    {
        var star = stars.create(this.game.world.randomX, this.game.world.randomY, 'star');

        star.body.gravity.y = -1800;
    }
    starsCount = stars.children.length;

}

function update() {

    game.physics.arcade.collide(player2, layer);

    game.physics.arcade.collide(stars, layer);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    game.physics.arcade.overlap(player2, stars, collectStar2, null, this);



    // JOUEUR 1!


    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.Q)==true)
    {
        player.body.velocity.x = -200;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D)==true)
    {
        player.body.velocity.x = 200;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton2.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -800;
        jumpTimer = game.time.now + 1;
    }


        // JOUEUR 2 !

    player2.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player2.body.velocity.x = -200;

        if (facing != 'left')
        {
            player2.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player2.body.velocity.x = 200;

        if (facing != 'right')
        {
            player2.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player2.animations.stop();

            if (facing == 'left')
            {
                player2.frame = 0;
            }
            else
            {
                player2.frame = 5;
            }

            facing = 'idle';
        }
    }
    

    if (jumpButton.isDown && player2.body.onFloor() && game.time.now > jumpTimer)
    {
        player2.body.velocity.y = -800;
        jumpTimer = game.time.now + 1;
    }

}

function collectStar (player, star) {

    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;

    starsCount--;
    if (starsCount == 0){
        win();
    }

}

function collectStar2 (player2, star) {

    star.kill();
    score2 += 10;
    scoreText2.text = 'Score: ' + score2;
    starsCount--;

    if (starsCount == 0){
        win();
    }

}

function win (star){

    if (score > score2){
        alert("Joueur 1 à gagné !");
    }
    else{
        alert(" Joueur 2 à gagné !");
    }
}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}