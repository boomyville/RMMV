## GALV MV Actor Equip Items Compatability

This script makes Galv's excellent Actor Equip Items work with SRPG core
It fixes some of the following issues:
- Items not being consumed
- Galv's script uses BattleManager to grab actor data (which actor is selected); in SRPG actor data is actually based off $gameTemp.activeEvent()
