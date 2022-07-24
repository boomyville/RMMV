# Show Battle Range

This plugin gives the user the $gameSystem.rangeTableTeam(team) function to show squares/tiles that a team can move to. 

It does not show attack range (as attack range is highly variable based on which skills a unit uses)

It uses the built in methods that srpg_core.js provides

Call via script call using $gameSystem.rangeTableTeam("actor") or $gameSystem.rangeTableTeam("enemy")

Best to make sure no tiles are already highlighted by using the $gameTemp.clearMoveTable() function

I've incorporated it using a common event button in the below example

![Example](https://github.com/boomyville/RMMV/blob/master/SRPG%20Show%20Battle%20Range/SIIOMrpy2y.gif?raw=true)
