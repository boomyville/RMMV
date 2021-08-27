# Exp Rate Modifcation

Simple plugin that allows the developer to state how EXP is calculated in an SRPG Battle
By default, SRPG_Core.js gives the developer two plugin parameters: Battle EXP rate and Actor EXP Rate
This plugin gives us more control over how EXP is calculated; instead of a flat multiplier being used, a lunatic (javascript eval) code is processed

For example if you want levels to affect the EXP gained in battle against foes we could use:
enemy.enemy().meta.srpgLevel / actor.level * enemy.exp() 
If the actor level is 3 and the enemy level is 4 and the enemy exp rate is 10 (set in the database), then exp gained will be 13.3333
If you used Yanfly enemy level plugin, then replace enemy.enemy().meta.srpgLevel with enemy.level 
