# SRPG Zone Customisation
This script changes the colour of tiles based on various conditions relating to the actor/enemy targets. 
For example, we can make it such that enemies weak to an attack have their tiles flash blue.
This script uses javascript eval so a lot can be done with it. You could make a secret enemy
and have a condition (enemy.name() == "Shoukang") and it can make the tile under the secret
enemy flash a different colour. 

## Requirements
SRPG AOE.js

## Limitations
Doesn't work properly with srpg_core.js specialRange (such as rook)
