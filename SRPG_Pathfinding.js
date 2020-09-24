//=============================================================================
//SRPG_Pathfinding.js
//=============================================================================

/*:
 * @plugindesc Adjusts pathfinding algorithm for determining where units should move when no valid target. Requires SRPG_AIControl.js
 * @author Boomy 
 * 
 * @param Move Formula
 * @desc Default formula for choosing where to move
 * @default nearestOpponent
 * 
 * @param Max Distance
 * @desc Maximum range in steps which a movement will occur if no target in range
 * @default 100
 * 
 * @help
 * This plugin is a work in progress!
 * Credits to: Dopan, Dr. Q, Greg Trowbridge, Traverse, SoulPour777
 * Current restrictions include:
 * - Treats tiles with limited passability as impassable (this can cause the path finding algorithm to fail when it comes to narrow cliffs)
 * - Only works when enemies are in the default mode; does not work with Regions at this stage 
 * 
 * Things it does do:
 * - Allow enemies (or confused allies) to target allies with proper A* pathfinding and navigate around walls or obstacles
 * - Move around events that have been tagged as objects (as defined in SRPG_core.js)
 
 */

(function() {

    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);

    var _moveFormula = parameters['Move Formula'] || 'nearestOpponent';
    var _maxDistance = parameters['Max Distance'] || 100;

    //credit to Traverse of RPG Maker Central Forums for the above scriplet via SoulPour777 RPG Maker MV scripting tutorial video

//Find the shortest path based on starting coordinates, target coordinates and the grid 
Game_CharacterBase.prototype.findShortestPath = function(startCoordinates, grid) {

	var distanceFromTop = startCoordinates[0];
	var distanceFromLeft = startCoordinates[1];

	// Each "location" will store its coordinates
	// and the shortest path required to arrive there
	var location = {
		distanceFromTop: distanceFromTop,
		distanceFromLeft: distanceFromLeft,
		path: [],
		status: 'Start'
	};

	// Initialize the queue with the start location already inside
	var queue = [location];

	// Loop through the grid searching for the goal
	while (queue.length > 0) {
		// Take the first location off the queue
		var currentLocation = queue.shift();

		var directions = ["Left", "Down", "Right", "Up"];
		for (dir in directions) {
			var newLocation = this.exploreInDirection(currentLocation, directions[dir], grid);
			if (newLocation.status === 'Goal') {
				return newLocation.path;
			} else if (newLocation.status === 'Valid') {
				queue.push(newLocation);
			}

		}
	}

	return false;

};

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
Game_CharacterBase.prototype.locationStatus = function(location, grid) {
	var gridSize = grid.length;
	var dft = location.distanceFromTop;
	var dfl = location.distanceFromLeft;

	if (location.distanceFromLeft < 0 ||
		location.distanceFromLeft >= gridSize ||
		location.distanceFromTop < 0 ||
		location.distanceFromTop >= gridSize) {

		// location is not on the grid--return false
		return 'Invalid';
	} else if (grid[dft][dfl] === 'Goal') {
		return 'Goal';
	} else if (grid[dft][dfl] !== 'Empty') {
		// location is either an obstacle or has been visited
		return 'Blocked';
	} else {
		return 'Valid';
	}
};

// Explores the grid from the given location in the given direction
Game_CharacterBase.prototype.exploreInDirection = function(currentLocation, direction, grid) {
	var newPath = currentLocation.path.slice();
	newPath.push(direction);

	var dft = currentLocation.distanceFromTop;
	var dfl = currentLocation.distanceFromLeft;

	if (direction === 'Left') {
		dft -= 1;
	} else if (direction === 'Down') {
		dfl += 1;
	} else if (direction === 'Right') {
		dft += 1;
	} else if (direction === 'Up') {
		dfl -= 1;
	}

	var newLocation = {
		distanceFromTop: dft,
		distanceFromLeft: dfl,
		path: newPath,
		status: 'Unknown'
	};
	newLocation.status = this.locationStatus(newLocation, grid);

	// If this new location is valid, mark it as 'Visited'
	if (newLocation.status === 'Valid') {
		grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
	}

	return newLocation;
};

// Determine the strategic value of a position on the map
// This function is an overwrite of Dr. Q's SRPG_AIControl.js script
// Changes include _maxDist (changes from map width + map height to become a plugin parameter)
// distTo(x, y) function has been replaced with pathTo(x, y)
// distTo gives us the tile distance "as the crow flies"
// pathTo gives us the tile distance based on movement around obstacles
// This change occurs as distTo is still used for skill ranges (which ignore obstacles)

Game_CharacterBase.prototype.positionScore = function(x, y, user, action) {
	var event = this;
	var _confusion = user.confusionLevel();

	var _maxDist = _maxDistance;
	var nearestFriend = -_maxDist;
	var nearestOpponent = -_maxDist;
	var nearestUnitEvent = -_maxDist;
	var nearestFlag = {};
	var mostFriends = 0;
	var mostOpponents = 0;
	var mostFlags = {};

	// find nearby units
	var occupied = $gameMap.events().some(function(otherEvent) {
		if (otherEvent !== event && !otherEvent.isErased()) {
			// ignore occupied spaces
			if (otherEvent.pos(x, y) && ['enemy', 'actor', 'playerEvent'].contains(otherEvent.isType())) {
				return true;
			}

			// ignored units
			var unitAry = $gameSystem.EventToUnit(otherEvent.eventId());
			if (unitAry && unitAry[1] && unitAry[1].priorityTag('aiIgnore')) return false;

			// track distance to nearest units
			var dist = -otherEvent.pathTo(x, y);
			if (otherEvent.isType() == event.isType()) {
				if (_confusion < 3) {
					nearestFriend = Math.max(dist, nearestFriend);
					mostFriends += dist;
				}
				if (_confusion > 1) {
					nearestOpponent = Math.max(dist, nearestOpponent);
					mostOpponents += dist;
				}
			} else if (['enemy', 'actor'].contains(otherEvent.isType())) {
				if (_confusion < 3) {
					nearestOpponent = Math.max(dist, nearestOpponent);
					mostOpponents += dist;
				}
				if (_confusion > 1) {
					nearestFriend = Math.max(dist, nearestFriend);
					mostFriends += dist;
				}
			} else if (otherEvent.isType() === 'unitEvent') {
				nearestUnitEvent = Math.max(dist, nearestUnitEvent);
			}

			// track distance to arbitrary "flag" events
			var type = otherEvent.aiFlag();
			if (type) {
				if (nearestFlag[type] === undefined) nearestFlag[type] = -_maxDist;
				nearestFlag[type] = Math.max(dist, nearestFlag[type]);
				mostFlags[type] += dist;
			}
		}
		return false;
	});
	if (occupied) return Number.NEGATIVE_INFINITY;

	// general info
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var a = user;
	var distance = $gameTemp.MoveTable(x, y)[1].length - 1;
	var damageFloor = $gameMap.isDamageFloor(x, y) ? 1 : 0;
	var region = $gameMap.regionId(x, y) || 0;
	var terrain = $gameMap.terrainTag(x, y) || 0;
	var tag = terrain;

	// self-target skill move formula
	if (this == $gameTemp.targetEvent() && action.item() && action.item().meta.aiMove) {
		return eval(action.item().meta.aiMove);
	}

	// standard AI modes (TODO: This still needs some work?)
	if (user.battleMode() === 'stand') {
		return 0; // no movement
	} else if (user.battleMode() === 'regionUp' || user.battleMode() === 'absRegionUp') {
		return region; // higher region
	} else if (user.battleMode() === 'regionDown' || user.battleMode() === 'absRegionDown') {
		return -region; // lower region
	} else if (user.battleMode() === 'aimingEvent' || user.battleMode() === 'aimingActor') {
		// priority target
		if ($gameTemp.isSrpgPriorityTarget() && !$gameTemp.isSrpgPriorityTarget().isErased()) {
			var priorityUnit = $gameSystem.EventToUnit($gameTemp.isSrpgPriorityTarget().eventId());
			if (!priorityUnit || !priorityUnit[1].priorityTag('aiIgnore')) {
				return -$gameTemp.isSrpgPriorityTarget().pathTo(x, y);
			}
		}
	}

	// formulas coming from actor / class / enemy
	if (user.isActor() && user.currentClass().meta.aiMove) {
		return eval(user.currentClass().meta.aiMove);
	} else if (user.isActor() && user.actor().meta.aiMove) {
		return eval(user.actor().meta.aiMove);
	} else if (user.isEnemy() && user.enemy().meta.aiMove) {
		return eval(user.enemy().meta.aiMove);
	}

	// default formula
	return eval(_moveFormula);
};

//New function that creates a grid of the map; fills the grid with obstacles, target location and origin
//The grid is used to find the shortest path from A to B, returns false if no path found
Game_Character.prototype.pathTo = function(x, y) {
	//Create associative array that represents the map 
	var width = $dataMap.width;
	var height = $dataMap.height;
	var grid = [];
	for (var i = 0; i < width; i++) {
		grid[i] = [];
		for (var j = 0; j < height; j++) {
			grid[i][j] = 'Empty';
		}
	}

	//Set location of origin and target
	grid[x][y] = "Starrt";
	grid[this.x][this.y] = "Goal";

	//Add obstacles
	for (var i = 0; i < $gameMap.width(); i++) {
		for (var j = 0; j < $gameMap.height(); j++) {
			if ($gameMap.checkLayeredTilesFlags(i, j, 0x0002) || $gameMap.checkLayeredTilesFlags(i, j, 0x0004) || $gameMap.checkLayeredTilesFlags(i, j, 0x0006) || $gameMap.checkLayeredTilesFlags(i, j, 0x0008)) {
				grid[i][j] = "Obstacle";
			}
			if ($gameMap.eventsXyNt(i, j)[0] !== undefined) {
				if ($gameMap.eventsXyNt(i, j)[0]._srpgEventType == "object") {
				grid[i][j] = "Obstacle";
				}
			}
		}
	}

	return this.findShortestPath([x, y], grid).length;
};


})();
