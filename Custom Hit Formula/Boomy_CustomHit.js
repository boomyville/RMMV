//=============================================================================
// Boomy_CustomHit.js
//=============================================================================

/*:
 * @plugindesc Set a skill or item's hit/eva rate to a notetag formula
 * @author Boomy 
 *  
 * ==============================================================================
 * @help 
 * ==============================================================================
 *
 * ==============================================================================
 * This script runs an eval and rewrites the function used by Yanfly Hit Formula
 * Usage is: <customHit: X> or <customEva: X> 
 * 
 * An example would be <customHit: user.hit - target.agi> 
 * This would mean the skill would have a lower success rate if the target is quicker
 * 
 * Another example would be <customHit: if($gameSystem.isSRPGMode()) { 1 / (Math.abs(user.event().posX() - target.event().posX()) + Math.abs(user.event().posY() - target.event().posY())) } else { Yanfly.Param.HAHitFormula }>
 * This example requires srpgCore + Dr. Q 
 * Hit rate is 1 if the target is within 1 square of the user, otherwise accuracy drops in a linear fashion
 * For example if the target is 4 squares away, then the success is 1/4 or 25%
 *
 * ------------------------------------------------------------------------------
 */
 
//===============================================================
// Parameter Variables
//===============================================================

(function() {

Game_Action.prototype.itemHit = function(target) {
    var item = this.item();
    var skill = this.item();
	var a = this.subject();
    var user = this.subject();
    var subject = this.subject();
    var b = target;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var skillHitRate = this.item().successRate * 0.01;
    var userHitRate = this.userHitRate(target);
    var targetEvadeRate = this.targetEvadeRate(target);
	if(this.item().meta.customHit !== undefined) {
		var code = skill.meta.customHit;
	} else {
    var code = Yanfly.Param.HAHitFormula;
	}
	try {
      return eval(code);
    } catch (e) {
      Yanfly.Util.displayError(e, code, 'CUSTOM HIT FORMULA ERROR');
      return false;
    }
};

Game_Action.prototype.itemEva = function(target) {
    var item = this.item();
    var skill = this.item();
    var a = this.subject();
    var user = this.subject();
    var subject = this.subject();
    var b = target;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var skillHitRate = this.item().successRate * 0.01;
    var userHitRate = this.userHitRate(target);
    var targetEvadeRate = this.targetEvadeRate(target);
	if(this.item().meta.customEva !== undefined) {
		var code = skill.meta.customEva;
	} else {
		var code = Yanfly.Param.HAEvaFormula;
	}
    try {
      return eval(code);
    } catch (e) {
      Yanfly.Util.displayError(e, code, 'CUSTOM EVA FORMULA ERROR');
      return false;
    }
};
	

})();
