# SRPG Pathfinding
Requires SRPG_AIControl.js by Doctor Q.

Plug and play. Enables enemies (and confused allies) to walk towards targets when they are not in range. The default action for the SRPG engine is to find the tile that is closest to the target and move there. This is fine for big open maps but once you put a wall between a target and a computer controlled enemy, then the AI does not think outside the box and the enemy will remain "fixated" on moving to the tile closest to the target and never actually advance towards the target. This script fixes that by forcing the AI to select the next destination based on path distance not on "as the crow flies" distance. This means the AI will find the shortest path to the enemy and then follow said path.

Issues at the moment that are unlikely to be resolved:
- Pathfinding assumes any tile with limited passability to be "impassable" which means pathfinding along narrow bridges or cliffs may result in "no path found" and result in units not moving as a result

Upcoming fixes:
- Add in pathfinding for regions (units currently will move to the higher/lower region if its within range and stand still if not; with some changes to how region pathfinding occurs, we can make units move towards higher/lower regions even if the next region is outside the unit's current movement range)
- Change pathfinding such that if no path is found, it defaults to the RMMV pathfinding (this would potentially solve pathfinding with limited passability)
