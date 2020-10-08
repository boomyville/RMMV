//=============================================================================
//SRPG_EventResetAfterAction.js
//=============================================================================
/*:
 * @plugindesc Reverts character/unit move speed and stepping/walking animations to default values after an SRPG action
 * @author Boomy 

 * @help
 * This plugin is plug and play and play
 * Requires a Dr_Q plugin such as SRPG_RangeControl.js to give all battlers the event() call such that we can control events based on their battlers 
 * Works best with SRPG_PositionEffects.js
 *
 */
 
 // Function Overwrite: Replaces SRPG_core.js method of processing at the start of a units action and inserts a line to store move speed and step animation
    Game_Battler.prototype.srpgMakeNewActions = function() {
        this.clearActions();
        //if (this.canMove()) {
            var actionTimes = this.makeActionTimes();
            this._actions = [];
            for (var i = 0; i < actionTimes; i++) {
                this._actions.push(new Game_Action(this));
            }
        //}
		//Edit: Store unit's walking speed and if the unit animates or not when moving/standing
		this._defaultMoveSpeed = this.event()._moveSpeed;
		this._defaultStepAnime = this.event()._stepAnime;
		this._defaultWalkAnime = this.event()._walkAnime;
        this.setActionState('waiting');
    };

// Function Overwrite: Replaces SRPG_core.js method of processing at the end of a units action and inserts a line to reset move speed to be the same as player speed
    var _SRPG_Game_Battler_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        if ($gameSystem.isSRPGMode() == true) {
            this.updateSrpgStateTurns(1);
            this.removeStatesAuto(1);
            this.clearResult();
			//Edit reset character speed 
			if(this._defaultMoveSpeed !== undefined) { 
				this.event().setMoveSpeed(this._defaultMoveSpeed);
			} else {
				this.event().setMoveSpeed($gamePlayer.realMoveSpeed());
			}
			//Edit: reset default walk animation status
			if(this._defaultWalkAnime !== undefined) { 
				this.event().setWalkAnime(this._defaultWalkAnime);
			} else {
				this.event().setWalkAnime(true);
			}
			//Edit: reset default step animation status
			if(this._defaultStepAnime !== undefined) { 
				this.event().setStepAnime(this._defaultStepAnime);
			} else {
				this.event().setStepAnime(true);
			}
        } else {
            return _SRPG_Game_Battler_onAllActionsEnd.call(this);
        }
    };
