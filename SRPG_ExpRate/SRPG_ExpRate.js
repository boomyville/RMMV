//=============================================================================
// SRPG_ExpRate.js
//=============================================================================
/*:
  * @plugindesc A plugin that modifies how exp is gained through battles 
 * @author Boomy 
 * 
 * @param Regular EXP Formula 
 * @desc Lunatic code formula that calculates how much exp the user gets from a regular hit on a foe  
 * Can use parameters such as actor and enemy 
 * @default  enemy.exp() * 0.1
 * 
 * @param Kill EXP Formula 
 * @desc Lunatic code formula that calculates how much exp the user gets from a kill 
 * Can use parameters such as actor and enemy 
 * @default enemy.exp() * 0.4
 *  
 * @param Skill EXP Formula 
 * @desc Lunatic code formula that calculates how much exp the user gets from a skill not targetting a foe 
 * Can use parameters such as actor
 * @default (actor.nextLevelExp() - actor.currentLevelExp()) * 0.1
 */
//===============================================================
// Parameter Variables
//===============================================================
(function () {
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);
    //credit to Traverse of RPG Maker Central Forums for the above scriplet via SoulPour777 RPG Maker MV scripting tutorial video
    //====================================================================================================================
    // Overwritten function: expTotal
    //====================================================================================================================
    // Change how Exp is calculated
    // #Boomy
    //====================================================================================================================
    var _SRPG_Game_Troop_expTotal = Game_Troop.prototype.expTotal;
    Game_Troop.prototype.expTotal = function () {
        if ($gameSystem.isSRPGMode() == true) {
            var actor = $gameParty.battleMembers()[0];
            if (this.SrpgBattleEnemys() && this.SrpgBattleEnemys().length > 0) {
                if (this.isAllDead()) {
                    var exp = this.deadMembers().reduce(function (r, enemy) {
                        return r + eval(parameters['Kill EXP Formula']);
                    }, 0);
                    return Math.floor(exp);
                } else {
                    var exp = 0;
                    for (var i = 0; i < this.members().length; i++) {
                        var enemy = this.members()[i];
                        exp += eval(parameters['Regular EXP Formula']);
                    }
                    return Math.floor(exp);
                }
            } else {
                var exp = eval(parameters['Skill EXP Formula']);
                return Math.floor(exp);
            }
        } else {
            return _SRPG_Game_Troop_expTotal.call(this);
        }
    };
/*
})();*/
