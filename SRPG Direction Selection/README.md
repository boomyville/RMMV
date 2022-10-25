# What does this script do?

This script adds the ability for the player to select the direction of an active unit after it makes an action or it uses the wait command. If a unit performs multiple actions per turn, they will be able to change direction after each action. This feature is present in many tactical RPGs such as Final Fantasy Tactics and Tactics Ogre series

![](https://github.com/boomyville/RMMV/blob/master/SRPG%20Direction%20Selection/DirectionSelection.gif?raw=true) 

# Why would I want this script?

This script adds extra strategic depth to your actions

Works well with SRPG_DirectionMod.js which modifies hit/crit rate based on whether a unit is performing a side or back attack.  For example, a player unit will face the target after an action; however if the target is killed the player unit now can face the opposite direction to avoid being back attacked

# Plugin parameters

Enable/Disable Plugin (Self-explanatory)

Enable/Disable Post-action direction selection (if set to false, only the Wait command can result in the prompt to select a direction)

After Battle Character Image (if set, it will change the default cursor to a character image set that indicates direction of unit). Otherwise the unit will just face the mouse with no other visual feedback to the player 

After Battle Lunatic code (if set, an eval operation will run code during direction selection; can be used to show a message of "Choose direction" for example)

SRPG image (required if After Battle Character Image is set. If this plugin is incorporated within srpg_core.js, this plugin parameter is not needed). Default is srpg_set
SrpgPredictionWindowMode (unfortunately, this standalone plugin plays around with Scene_Map.update and this function uses this plugin parameter so it has to be included. If this plugin is incorporated within srpg_core.js, this plugin parameter is not needed

# How does this plugin work?

When the map refreshes (which happens all the time if a SRPG battle is not happening or the menu is open), it will check what state the game is in .  There are several states which the "SRPG engine" can be in (such as if the status window of a unit is open).  For battles, the flow is set by $gameSystem.isSubBattlePhase and $gameSystem.isBattlePhase. isBattlePhase indicates if the player or computer enemy is control and whether control is manual or "automatic". isSubBattlePhase indicates what is happening to a unit. 

isSubBattlePhase normally cycles through: normal (nothing selected) --> move --> command --> target (select target) --> battle window --> after_battle --> normal

This script changes _SRPG_BattleManager_endBattle function to change the flow from battle --> pre_direction_selection --> direction_selection --> after_battle. During pre_direction_selection, a few checks are undertaken and the outcome will either lead to after battle or direction_selection phase

# How to use?
Install plugin. Fiddle with plugin parameters. Download the included $ArrowIndicator.png if you want to give the player visual feedback when choosing a selection and change the After Battle Character Image plugin parameter. Make sure you have SRPG_AoE.js and SRPG_PositionEffects.js as this plugin uses some functions from those plugins. Also does not really work with map battle.

