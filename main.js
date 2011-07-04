var ANIMATION_INTERVAL = 100;

var FISH_MAX_VELOCITY = 6;
var FISH_SPEED_INCREMENT = 4;

var AQUARIUM_TOTAL_FISH = 4;
var AQUARIUM_LEFT_EDGE = 0;
var AQUARIUM_RIGHT_EDGE = 640;
var AQUARIUM_TOP_EDGE = 0;
var AQUARIUM_BOTTOM_EDGE = 480;

var fish = {};

function randomIntInRange(min, max) {
      return Math.round(min + (Math.random() * (max - min)));
}

function Fish() {
    this.x = 0;
    this.y = 0;
    this.velocityX = 0;
    this.velocityY = 0;
}

Fish.prototype.move = function() {
    if (randomIntInRange(0, 10) <= 1) {
        this.velocityX += randomIntInRange(-FISH_SPEED_INCREMENT, FISH_SPEED_INCREMENT);
        this.velocityX = Math.min(this.velocityX, FISH_MAX_VELOCITY);
        this.velocityX = Math.max(this.velocityX, -FISH_MAX_VELOCITY);

        this.velocityY += randomIntInRange(-FISH_SPEED_INCREMENT, FISH_SPEED_INCREMENT);
        this.velocityY = Math.min(this.velocityY, FISH_MAX_VELOCITY);
        this.velocityY = Math.max(this.velocityY, -FISH_MAX_VELOCITY);
    }		

    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x < AQUARIUM_LEFT_EDGE) {
        this.x = AQUARIUM_LEFT_EDGE;
        this.velocityX = -this.velocityX;
    }
    else if (this.x > AQUARIUM_RIGHT_EDGE) {
        this.x = AQUARIUM_RIGHT_EDGE;
        this.velocityX = -this.velocityX;
    }

    if (this.y < AQUARIUM_TOP_EDGE) {
        this.y = AQUARIUM_TOP_EDGE;
        this.velocityY = -this.velocityY;
    }
    else if (this.y > AQUARIUM_BOTTOM_EDGE) {
        this.y = AQUARIUM_BOTTOM_EDGE ;
        this.velocityY = -this.velocityY;
    }
}

function createFish() {
    var aquarium = $('#aquarium');
    AQUARIUM_LEFT_EDGE = aquarium.offset().left;
    AQUARIUM_TOP_EDGE = aquarium.offset().top;

    for(var i = 0; i < AQUARIUM_TOTAL_FISH; i++) {
        var newFish = new Fish();
        newFish.x = AQUARIUM_RIGHT_EDGE / 2;
        newFish.y = AQUARIUM_BOTTOM_EDGE / 2; 

        var fishID = "fish" + i;
        fish[fishID] = newFish;

        var fishElement = $('<li>',  {class: 'fish',  id: fishID});
        aquarium.append(fishElement);    
    }
}

function animate() {
    $('.fish').each(function() {
        var fishID = $(this).attr('id');
        var f = fish[fishID];
        f.move();
        $(this).offset({ left: f.x, top: f.y });
    });
}

function setupAquarium() {
    createFish();
}

$(function() {
    setupAquarium();
    setInterval(animate, ANIMATION_INTERVAL);
});
