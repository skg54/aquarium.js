var ANIMATION_INTERVAL = 100;

// FISH PROPERTIES
var FISH_WIDTH = 16;
var FISH_HEIGHT = 20;
var FISH_MAX_VELOCITY = 6;
var FISH_SPEED_INCREMENT = 3;

// AQUARIUM PROPERTIES
var AQUARIUM_TOTAL_FISH = 12;
var AQUARIUM_LEFT_EDGE = 0;
var AQUARIUM_RIGHT_EDGE = 0;
var AQUARIUM_TOP_EDGE = 0;
var AQUARIUM_BOTTOM_EDGE = 0;

// GLOBAL VARS
var fishes;
var moveFishes;
var mouseX = 0;
var mouseY = 0;

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

function randomFishMovement(fishes) {
    $.each(fishes, function(index, fish) {
        if (randomIntInRange(0, 10) <= 1) {
            fish.velocityX = adjustVelocity(fish.velocityX);
            fish.velocityY = adjustVelocity(fish.velocityY);
        }		

        fish.x += fish.velocityX;
        fish.y += fish.velocityY;
    });
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

function updateFishOnScreen(element, fish) {
    element.offset({left: fish.x, top: fish.y});

    var hasChangedDirections = (fish.velocityX >= 0 && element.hasClass('left')) || 
                               (fish.velocityX < 0 && element.hasClass('right'));
    if (hasChangedDirections) {
        element.toggleClass('left');
        element.toggleClass('right');
    }
}

function animateFish() {
    moveFishes(fishes);

    $.each(fishes, function(index, fish) {
        keepFishInsideAquarium(fish);
        var element = $('#fish' + index);
        updateFishOnScreen(element, fish);
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

function createFish(totalFish) {
    var fishes = [];

    for (var i = 0; i < totalFish; i++) {
        var newFish = new Fish(FISH_WIDTH, FISH_HEIGHT);
        fishes.push(newFish)
    }
    
    return fishes;
}

function addFishToAquarium(aquarium, fishes) {
    $.each(fishes, function(index) {
        var fishElement = $('<li>', {class: 'fish right', id: 'fish' + index});
        aquarium.append(fishElement);    
    });
}

function disperseFishes(fishes) {
    $.each(fishes, function(index, fish) {
        fish.x = randomIntInRange(AQUARIUM_LEFT_EDGE, AQUARIUM_RIGHT_EDGE);
        fish.y = randomIntInRange(AQUARIUM_TOP_EDGE, AQUARIUM_BOTTOM_EDGE);
    });
}

function loadAquarium() {
    var aquariumElement = $(document.body);
    var AQUARIUM_WIDTH = aquariumElement.width();
    var AQUARIUM_HEIGHT = aquariumElement.height();
    setupAquarium(aquariumElement, AQUARIUM_WIDTH, AQUARIUM_HEIGHT);

    fishes = createFish(AQUARIUM_TOTAL_FISH);
    disperseFishes(fishes);
    addFishToAquarium(aquariumElement, fishes);
    moveFishes = boidMoveFishes;//randomFishMovement;

    $(document).mousemove(function(e){
       mouseX = e.pageX;
       mouseY = e.pageY;
    });

    setInterval(animateFish, ANIMATION_INTERVAL);
}


// Boid Algorithm
function distance(fish, otherFish) {
    var distX = fish.x - otherFish.x;
	var distY = fish.y - otherFish.y;
	return Math.sqrt(distX * distX + distY * distY);
}
	
function moveAway(currentFish, fishes, minDistance) {
	var distanceX = 0;
	var distanceY = 0;
	var numClose = 0;

	for (var i = 0; i < fishes.length; i++) {
		var fish = fishes[i];
		
        var sameFish = (currentFish.x == fish.x && currentFish.y == fish.y);

		if (sameFish) { 
            continue;
        }

		if (distance(currentFish, fish) < minDistance) {
			numClose++;
			var xdiff = (currentFish.x - fish.x);
			var ydiff = (currentFish.y - fish.y);

			if (xdiff >= 0) {
                xdiff = Math.sqrt(minDistance) - xdiff;
            }
            else if (xdiff < 0) {
                xdiff = -Math.sqrt(minDistance) - xdiff;
            }

			if (ydiff >= 0) {
                ydiff = Math.sqrt(minDistance) - ydiff;
            }
            else if (ydiff < 0) {
                ydiff = -Math.sqrt(minDistance) - ydiff;
            }

			distanceX += xdiff;
			distanceY += ydiff;
		}
	}
	
	if (numClose == 0) {
        return;
    }

	currentFish.velocityX -= (distanceX / 5);
	currentFish.velocityY -= (distanceY / 5);
}
	
function avoidMouse(currentFish, mouseX, mouseY, minDistance) {
	var distanceX = 0;
	var distanceY = 0;
    var fish = {x: mouseX, y: mouseY};
		
    if (distance(currentFish, fish) < minDistance) {
        var xdiff = (currentFish.x - fish.x);
        var ydiff = (currentFish.y - fish.y);

        if (xdiff >= 0) {
            xdiff = Math.sqrt(minDistance) - xdiff;
        }
        else if (xdiff < 0) {
            xdiff = -Math.sqrt(minDistance) - xdiff;
        }

        if (ydiff >= 0) {
            ydiff = Math.sqrt(minDistance) - ydiff;
        }
        else if (ydiff < 0) {
            ydiff = -Math.sqrt(minDistance) - ydiff;
        }

        distanceX += xdiff;
        distanceY += ydiff;
    }
	
	currentFish.velocityX -= (distanceX / 5);
	currentFish.velocityY -= (distanceY / 5);
}

function moveCloser(currentFish, fishes, min_distance) {
	var avgX = 0;
	var avgY = 0;

	for (var i = 0; i < fishes.length; i++) {
		var fish = fishes[i];

        var sameFish = (currentFish.x == fish.x && currentFish.y == fish.y);

		if (sameFish || distance(currentFish, fish) > min_distance) { 
            continue;
        }

		avgX += (currentFish.x - fish.x);
		avgY += (currentFish.y - fish.y);
	}

	avgX /= fishes.length;
	avgY /= fishes.length;

	min_distance = Math.sqrt((avgX * avgX) + (avgY * avgY)) * -1.0

	if (min_distance == 0) {
        return;
    }

	currentFish.velocityX = Math.min(currentFish.velocityX + (avgX / min_distance) * 0.15, FISH_MAX_VELOCITY);
	currentFish.velocityY = Math.min(currentFish.velocityY + (avgY / min_distance) * 0.15, FISH_MAX_VELOCITY);
}
	
function moveWith(currentFish, fishes, min_distance) {
	var avgX = 0;
	var avgY = 0;

	for (var i = 0; i < fishes.length; i++) {
		var fish = fishes[i];
        var sameFish = (currentFish.x == fish.x && currentFish.y == fish.y);

		if (sameFish || distance(currentFish, fish) > min_distance) { 
            continue;
        }
		
		avgX += fish.velocityX;
		avgY += fish.velocityY;
	}

	avgX /= fishes.length;
	avgY /= fishes.length;

	min_distance = Math.sqrt((avgX * avgX) + (avgY * avgY)) * 1.0
	
    if (min_distance == 0) {
        return; 
    }

	currentFish.velocityX = Math.min(currentFish.velocityX + (avgX / min_distance) * 0.05, FISH_MAX_VELOCITY)
	currentFish.velocityY = Math.min(currentFish.velocityY + (avgY / min_distance) * 0.05, FISH_MAX_VELOCITY)
}

function boidMoveFishes(fishes) {
    $.each(fishes, function(index, currentFish) {
        moveWith(currentFish, fishes, 300);
        moveCloser(currentFish, fishes, 300);					

        avoidMouse(currentFish, mouseX, mouseY, 60);
        moveAway(currentFish, fishes, 15);	
    });

    $.each(fishes, function(index, currentFish) {
        currentFish.x += currentFish.velocityX;
        currentFish.y += currentFish.velocityY;
    });
};		
