//=============================================================================
//SRPG_EventResetAfterAction.js
//=============================================================================
/*:
 * @plugindesc Reverts character/unit move speed and stepping/walking animations to default values after an SRPG action
 * @author Boomy (edited by dopan)

 * @help
 * This plugin is plug and play and play
 * Requires a Dr_Q plugin such as SRPG_RangeControl.js to give all battlers the event() call such that we can control events based on their battlers 
 * Works best with SRPG_PositionEffects.js
 *
 * dopan edit info: Fixed & SRPG_MoveSpeedStates Function included
 * NEW State Note = <MoveSpeed_State>
 * # this StateNote makes sure that the MoveSpeed will be reseted to the defaut of the EventPage when the state is gone.
 *
 * NEW ScriptCalls Info:
 * ( Usage for States on Active Event ID)
 * -$gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].event()._defaultMoveSpeed = X;
 * -$gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].event()._defaultStepAnime = X;
 * -$gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].event()._defaultWalkAnime = X;
 * ( Usage for States on Target Event ID)
 * -$gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].event()._defaultMoveSpeed = X;
 * -$gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].event()._defaultStepAnime = X;
 * -$gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].event()._defaultWalkAnime = X;
 *
 * These ScripCals will overwrite the default "MoveSpeed" & "StepAnime" & "WalkAnime" to the Number X
 * ( use this with the States that have the StateNote : <MoveSpeed_State> )
 * => these Scriptcalls can be added with SkillCommon Event or Custom Execution SkillNote
 * => these Scriptcalls will be reseted to the default of the EventPage after the State with StateNote <MoveSpeed_State> is gone.
 *
 * ScriptCalls for usage before Action without State usage:
 *
 * (this can also be done with SkillDMG Formula. Example: "a.event().setMoveSpeed(x);" or 
 * "a.event().setStepAnime(x);" or "a.event().WalkAnime(x);" )
 * - Following Scriptcalls are for usage on "dash Skils" for Example. Use this instead of using the SkillDMG Formula.
 * - these ScriptCalls without State Usage will be reseted after Action from the Plugins: "_defaultMoveSpeed" or
 *   "_defaultStepAnime" or "_defaultWalkAnime"
 *   (instead of when a State is gone)
 * 
 * ( Usage WITHOUT States on Active Event ID)
 * -$gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].event().setMoveSpeed(X);
 * -$gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].event().setStepAnime(X);
 * -$gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].event().setWalkAnime(X);
 * ( Usage WITHOUT States on Target Event ID)
 * -$gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].event().setMoveSpeed(X);
 * -$gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].event().setStepAnime(X);
 * -$gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1].event().setWalkAnime(X);
 *
 * - Use these ScriptCalls with Custom Execution SkillNote in order to happen before the Action
 * - This will be reseted to the default of the EventPage after Units Action.
 * - If the Units has a "SpeedState" with StateNote <MoveSpeed_State> ,it will be reseted to the "x" Number which was added with "State Usage ScriptCalls"
 * ( like explained above the "State Usage ScriptCalls" will be reseted to the default of the EventPage when the State is Gone )
 *
 * Dopan sideNote:
 *  If this Help Info is not Well enough Explained pls ask in RPG Forum for help.( in the SRPG thread ) 
 *
 */


 // test edit dopan // store States meta data
    Game_Battler.prototype.hasMoveSpeedStates = function() {
        return this.states().some(function(state) {
               return state.meta.MoveSpeed_State;
        });
    };

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
		
        //Edit store current data
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
            if (this._defaultMoveSpeed !== undefined) { 
                this.event().setMoveSpeed(this._defaultMoveSpeed);
            } else {
                this.event().setMoveSpeed(this.event().page().moveSpeed);
                //dopan Sidenote: this was default and should be deleted//this.event().setMoveSpeed($gamePlayer.realMoveSpeed());
            }
            //Edit: reset default walk animation status
            if (this._defaultWalkAnime !== undefined) { 
                this.event().setWalkAnime(this._defaultWalkAnime);
            } else {
                this.event().setWalkAnime(this.event().page().walkAnime);
                //dopan Sidenote: this was default and should be deleted//this.event().setWalkAnime(true);
            }
            //Edit: reset default step animation status
            if (this._defaultStepAnime !== undefined) { 
                this.event().setStepAnime(this._defaultStepAnime);
            } else {
                this.event().setStepAnime(this.event().page().stepAnime);
                //dopan Sidenote: this was default and should be deleted//this.event().setStepAnime(true);
			}
            // test edit dopan reset moveSpeed on State Usage
            if ((this.hasMoveSpeedStates == false) && (this._defaultMoveSpeed !== undefined)) {
                 this.event().setMoveSpeed(this.event().page().moveSpeed);
            }
            // test edit dopan reset stepAnime on State Usage
            if ((this.hasMoveSpeedStates == false) && (this._defaultStepAnime !== undefined)) {
                 this.event().setStepAnime(this.event().page().stepAnime);
            }
            // test edit dopan reset walkAnime on State Usage
            if ((this.hasMoveSpeedStates == false) && (this._defaultWalkAnime !== undefined)) {
                 this.event().setWalkAnime(this.event().page().walkAnime);
            }

        } else {
            return _SRPG_Game_Battler_onAllActionsEnd.call(this);
        }
    };
