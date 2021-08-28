//=============================================================================
// SRPG_ExpMod.js
//=============================================================================
/*:
  * @plugindesc A plugin that modifies how exp is gained through battles. Compatible with new version of SRPG_AoEAnimation.js
 * @author Boomy 
 * 
 * @param Average AoE Target EXP
 * @type boolean
 * @desc Split EXP equal to number of targets. Note that SRPG_AoEAnimation.js already splits exp when mulltiple actors are targeted.
 * @default false
 * 
 * @param EXP multiplier
 * @desc Lunatic code formula. Can use parameters such as user and targetsAverageLevel, targetsMaxLevel, targetsMinLevel 
 * @default 1
 *  
  * @help
  * Alters the BattleManager.makeRewards function to make some modifications to 
  * how much EXP is gained in SRPG battle.
  *
  * Kill an enemy: Gain full enemy EXP x modifiers 
  * Damage an enemy: Gain enemy EXP x modifiers x srpg_core.js plugin parameter
  * Take damage from enemy: Gain enemy EXP x modifiers x srpg_core.js plugin parameter
  * Use skill on non-enemy: Gain a percentage of actor exp 
*
*  Note that if you are using SRPG_AoEAnimation.js, exp is distributed amongst all units active in battle.  
  * 
 */
//===============================================================
// Parameter Variables
//===============================================================
(function () {
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);
    BattleManager.makeRewards = function () {
        this._rewards = {};
        this._rewards.gold = $gameTroop.goldTotal();
        var defaultExp = $gameTroop.expTotal();
        if ($gameSystem.isSRPGMode()) {
            //User is an actor 
            if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[0] == "actor") {
                //If target is enemy
                if ($gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[0] == "enemy") {
                    //Reduce exp gain if average parameter is Set
                    if (eval(parameters['Average AoE Target EXP'])) {
                        defaultExp = defaultExp / ($gameTemp._areaTargets.length + 1);
                    }
                    //Apply multiplier to EXP if EXP multiplier is set 
                    if (parameters['EXP multiplier'] !== 1) {
                        //Work out targetsAverageLevel, targetsMaxLevel and targetsMinLevel
                        var levelArray = [Number($gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].level !== undefined ? $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].level : $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].enemy().meta.srpgLevel)];
                        for (var i = 0; i < $gameTemp._areaTargets.length; i++) {
                            console.log($gameSystem.EventToUnit($gameTemp._areaTargets[i].event.eventId())[1].enemy().meta.srpgLevel);
                            var level = Number($gameSystem.EventToUnit($gameTemp._areaTargets[i].event.eventId())[1].level !== undefined ? $gameSystem.EventToUnit($gameTemp._areaTargets[i].event.eventId())[1].level : $gameSystem.EventToUnit($gameTemp._areaTargets[i].event.eventId())[1].enemy().meta.srpgLevel);
                            levelArray.push(level);
                        }
                        var average = levelArray = > levelArray.reduce((p, c) = > p + c, 0) / levelArray.length;
                        var targetsAverageLevel = average(levelArray);
                        var targetsMaxLevel = Math.max(...levelArray);
                        var targetsMinLevel = Math.min(...levelArray);
                        var user = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
                        defaultExp *= eval(parameters['EXP multiplier']);
                    }
                }
            }
            //User is an enemy 
            if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[0] == "enemy") {
                //Using AoEAnimation.js, exp is averaged when multiple actors are targetted
                //Apply multiplier to EXP if EXP multiplier is set 
                if (parameters['EXP multiplier'] !== 1) {
                    //Work out targetsAverageLevel, targetsMaxLevel and targetsMinLevel
                    var levelArray = [Number($gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].level !== undefined ? $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].level : $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].enemy().meta.srpgLevel)];
                    for (var i = 0; i < $gameTemp._areaTargets.length; i++) {
                        var level = Number($gameSystem.EventToUnit($gameTemp._areaTargets[i].event.eventId())[1].level !== undefined ? $gameSystem.EventToUnit($gameTemp._areaTargets[i].event.eventId())[1].level : $gameSystem.EventToUnit($gameTemp._areaTargets[i].event.eventId())[1].enemy().meta.srpgLevel);
                        levelArray.push(level);
                    }
                    var average = levelArray = > levelArray.reduce((p, c) = > p + c, 0) / levelArray.length;
                    var targetsAverageLevel = average(levelArray);
                    var targetsMaxLevel = Math.max(...levelArray);
                    var targetsMinLevel = Math.min(...levelArray);
                    var user = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
                    if (user.level == undefined) {
                        user.level = user.enemy().meta.srpgLevel;
                    }
                    defaultExp *= 1 / eval(parameters['EXP multiplier']);
                }
            }
            this._rewards.exp = defaultExp;
        } else {
            this._rewards.exp = $gameTroop.expTotal();
        }
        this._rewards.items = $gameTroop.makeDropItems();
    };
})();
