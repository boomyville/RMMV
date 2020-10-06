# SRPG Pathfinding
Requires SRPG_AIControl.js and SRPG_RangeControl.js by Doctor Q.

This script changes the pathfinding of units controlled by the computer (mainly enemy AI) when no targets are in range. For example: At the start of battle, usually enemy and player units are separated by a distance greater than their srpgMove range. The default SRPG movement AI is simply to face the closest target and move in that direction
This works on open big maps but fails when there is even a bit of map complexity such as a maze or walls. This script fixes it by changing the "face the closest target and move in that direction" algorithm and replaces it with a "Find the shortest path to the target and move along this path". This allows computer AI to navigate around walls, trees and other obstacles such that they will always reach the target (provided the target is reachable) 

![](https://github.com/boomyville/RMMV/blob/master/SRPG%20Pathfinding/Pathfinding_example.gif)

## Instructions on use:
 * Requires Doctor_Q's SRPG_AICOntrol.js (decision making AI) and SRPG_Rangecontrol.js (targetting AI) scripts 
 * Place under all SRPG and Yanfly scripts 
 * Make sure to set events that are obstacles with the <type: object> event tag such that pathfinding is accurate
 
## Flow of pathfinding is as follows:
 * Target within range - Use available skills (movement AI in this script is not used)
 * Targets exist but not in range - Use movement AI 
 * If best path results in landing on an occupied space, recalculate best path
 * Targets exist but no path available - Use fallback movement AI or fallback pathfinding 
 * No targets exist - Use fallback movement AI if set; otherwise no movement
 
## Tag Usage (Actor/Enemy and Class):
 * <movementAI: "STRING STRING_X STRING_Y"> 
 * Split different strings with spaces. Make sure the tag is encapsulated with double/single quotation marks " "
 * "STAND" - Unit stands still (unless applicable target within range)
 * "AIMLESS" - Units moves to a random space within its move range. If no space is free then it will stand still
 * "NEARESTFOE" - Units move to nearest target on the opposing team.
 * "NEARESTFRIEND" - Units move to nearest target on the same team.
 * "FARTHESTFOE" - Units move to the farthest target on the opposing team. Not too useful as once the unit gets closer, the farthest foe will no longer be the farthest foe.
 * "FARTHESTFRIEND" - Units move to the farthest  target on the same team. Not too useful as once the unit gets closer, the farthest friend will no longer be the farthest friend.
 * "RANDOMFOE" - Units move towards a random target on the opposing team. This changes every turn and will result in eratic behaviour if opposing team's units are spread out.
 * "RANDOMFRIEND" - Units move  towards a random target on the same team. This changes every turn and will result in eratic behaviour if the same team's units are spread out 
 * "CURRENTREGION" - Units will move randomly but only within the current region that is is. This can be altered by attacks/effects that move units 
 * "REGION_X" - Units will move towards nearest tile of region X if they are not in region X, otherwise they will follow CURRENTREGION movement algorithm.
 * "ADJACENTREGION" - Units will to a region +/- 1 of the current one. If they cannot find an adjacent region within range, they will follow CURRENT REGION movement algorithm. 
 * "DIFFERENTREGION" - Units will move to any square randomly with a different region to current. If they cannot find any valid options, RANDOM movement algorithm will be followed. 
 * "POINT_X_Y" - Units will move towards map coordinates X, Y. If they are at X,Y then STAND movement algorithm will be followed  [NOT IMPLEMENTED YET]
 * "AREA_X_Y_Z" - Units will move towards map coordinates X, Y. If they are within Z tiles of X,Y then RANDOM movement algorithm will be followed [NOT IMPLEMENTED YET]

## How does Region Pathfinding work?

![](https://github.com/boomyville/RMMV/blob/master/SRPG%20Pathfinding/Pathfinding_regions.png)

* REGION_4 results in the unit moving towards any tile with region 4. Once in Region 4, it will move within the 2 x 2 space 
* CURRENTREGION results in the unit moving to any tile that is not tagged with a region (as current region is undefined or 0). It will continue to avoid region 1-4
* ADJACENTREGION results in the unit moving to tile with region 1 (as current unit is undefined or 0). Once in region 1, it will move to region 0 or 2 (random). If it could not move to an adjacent region, it will move randomly within its own region
* DIFFERENTREGION results in the unit moving to tile with region 1 or 4 (as current unit is undefined or 0). Next turn it will move to a different region if possible; if not then it will move randomly within its own region

## How does fallback movement work?

![](https://github.com/boomyville/RMMV/blob/master/SRPG%20Pathfinding/Pathfinding_fallback.png)

* Fallback Movement means if no target is reachable (aka units are behind a gate that is closed), then movement methodlogy will change (eg. Nearest foe to Random)
* Fallback Pathfinding means if no target is reachable, the game will find the shortest path to the tile closest to the target (eg. move towards foe still)
* If fallback movement is set, fallback pathfinding will not occur
* If movement is set to Aimless or Stand, then fallback will never occur (as these movement options technically never fail) 

## Issues at the moment that are unlikely to be resolved:
- Pathfinding assumes any tile with limited passability to be "impassable" which means pathfinding along narrow bridges or cliffs may result in "no path found" and result in units not moving as a result

