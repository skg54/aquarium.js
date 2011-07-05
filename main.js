var ANIMATION_INTERVAL = 100;

var FISH_WIDTH = 16;
var FISH_HEIGHT = 20;
var FISH_MAX_VELOCITY = 8;
var FISH_SPEED_INCREMENT = 4;

var AQUARIUM_WIDTH = 800;
var AQUARIUM_HEIGHT = 600;
var AQUARIUM_TOTAL_FISH = 8;
var AQUARIUM_LEFT_EDGE = 0;
var AQUARIUM_RIGHT_EDGE = 0;
var AQUARIUM_TOP_EDGE = 0;
var AQUARIUM_BOTTOM_EDGE = 0;

var fishes;
var moveFish;

function Fish(width, height) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.velocityX = 0;
    this.velocityY = 0;
}

function randomIntInRange(min, max) {
      return Math.round(min + (Math.random() * (max - min)));
}

function adjustVelocity(velocity) {
    var increment = randomIntInRange(-FISH_SPEED_INCREMENT, FISH_SPEED_INCREMENT);
    var newVelocity = velocity + increment;
    newVelocity = Math.min(newVelocity, FISH_MAX_VELOCITY);
    newVelocity = Math.max(newVelocity, -FISH_MAX_VELOCITY);
    return newVelocity;
}

function randomFishMovement(fish) {
    if (randomIntInRange(0, 10) <= 1) {
        fish.velocityX = adjustVelocity(fish.velocityX);
        fish.velocityY = adjustVelocity(fish.velocityY);
    }		

    fish.x += fish.velocityX;
    fish.y += fish.velocityY;
    keepFishInsideAquarium(fish);
}

function keepFishInsideAquarium(fish) {
    if (fish.x < AQUARIUM_LEFT_EDGE) {
        fish.x = AQUARIUM_LEFT_EDGE;
        fish.velocityX = -fish.velocityX;
    }
    else if ((fish.x + fish.width) > AQUARIUM_RIGHT_EDGE) {
        fish.x = AQUARIUM_RIGHT_EDGE - fish.width;
        fish.velocityX = -fish.velocityX;
    }

    if (fish.y < AQUARIUM_TOP_EDGE) {
        fish.y = AQUARIUM_TOP_EDGE;
        fish.velocityY = -fish.velocityY;
    }
    else if ((fish.y + fish.height) > AQUARIUM_BOTTOM_EDGE) {
        fish.y = AQUARIUM_BOTTOM_EDGE - fish.height;
        fish.velocityY = -fish.velocityY;
    }
}

function updateFish(element, fish) {
    element.offset({left: fish.x, top: fish.y});

    // Adjust fish image
    if (fish.velocityX >= 0) {
        element.removeClass('left');
        element.addClass('right');
    }
    else {
        element.removeClass('right');
        element.addClass('left');
    }
}

function animateFish() {
    $.each(fishes, function(index, fish) {
        var element = $('#' + index);
        moveFish(fish);
        updateFish(element, fish);
    });
}

function setupAquarium(element, AQUARIUM_WIDTH, AQUARIUM_HEIGHT) {
    element.width(AQUARIUM_WIDTH);
    element.height(AQUARIUM_HEIGHT);

    var elementX = element.offset().left;
    var elementY = element.offset().top;

    AQUARIUM_LEFT_EDGE = elementX;
    AQUARIUM_RIGHT_EDGE = AQUARIUM_WIDTH + elementX;

    AQUARIUM_TOP_EDGE = elementY;
    AQUARIUM_BOTTOM_EDGE = AQUARIUM_HEIGHT + elementY;
}

function createFish(totalFish, x, y) {
    var fishes = [];

    for (var i = 0; i < totalFish; i++) {
        var newFish = new Fish(FISH_WIDTH, FISH_HEIGHT);
        newFish.x = (AQUARIUM_RIGHT_EDGE / 2);
        newFish.y = (AQUARIUM_BOTTOM_EDGE / 2); 
        fishes.push(newFish)
    }
    
    return fishes;
}

function addFishToAquarium(aquarium, fishes) {
    $.each(fishes, function(index) {
        var fishElement = $('<li>', {class: 'fish right',  id: index});
        aquarium.append(fishElement);    
    });
}

$(function() {
    var aquariumElement = $('#aquarium');
    setupAquarium(aquariumElement, AQUARIUM_WIDTH, AQUARIUM_HEIGHT);

    fishes = createFish(AQUARIUM_TOTAL_FISH);
    addFishToAquarium(aquariumElement, fishes);
    moveFish = randomFishMovement;

    setInterval(animateFish, ANIMATION_INTERVAL);
});
