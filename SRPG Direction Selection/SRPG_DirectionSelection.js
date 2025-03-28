//=============================================================================
//SRPG_DirectionSelection.js
//=============================================================================
/*:
 * @plugindesc Adds the ability for players to choose a direction of an actor after an action
 * @author Boomy 
 * 
 * @param After Battle Direction Selection
 * @desc Enable/Disable the ability for a unit to manually choose their direction after an action
 * @default true
 * 
 * @param After Battle Character Image
 * @desc If set to -1, do not change player icon after battle. Used in conjunction with after battle direction selection. Exclude .png suffix
 * @default -1
 * 
 * @param After Battle Lunatic Code 
 * @desc Run code during the direction selection phase; will only run during actor phase 
 * @default 
 * 
 * @param SRPG Image
 * @desc Name of character image of SRPG Set (Cursor image). Exclude .png suffix
 * @default srpg_set
 *
 * @param Enable Switch
 * @desc Switch that is used to enable direction selection. If set to none, then this script is always active
 * @type switch
 *
 * @param Enable Touch Input Switch
 * @desc Switch that is used to enable direction selection via touch input. If set to none, touch input is always active
 * @type switch
 *
 * @help
 * This plugin is plug and play. Works best with a character image that indicates which direction a unit will be facing
 * Best used with the SRPG_DirectionMod.js plugin which gives bonuses depending on unit direction
 *
 * Place BEFORE Shoukang's MoveAfterAction for compatability with that script. Otherwise place near the top of your srpg plugins after srpg_core.js
 *
 * Lunatic code is run only during actor phase and only if direction selection is enabled. 
 * Its main role is to display a message to the player to select a direction
 * No example is included as it would require an external plugin to look good (such as YEP Message Core Extension 2)
 *
 * Change Log
 * 8/11/20 - First Release
*  5/8/21 - Update to enable compatability with Shoukang's MoveAfterAction
 */
(function () {
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);
    var _directionSelection = parameters['After Battle Direction Selection'] || true;
    var _directionSelectionLunaticCode = parameters['After Battle Lunatic Code'];
    var _directionSelectionCharacterName = parameters['After Battle Character Image'];
    var _enableSwitch = parameters['Enable Switch'];
	var _enableTouchSwitch = parameters['Enable Touch Input Switch'];
    var _srpgSet = parameters['SRPG Image'];
    // Map Refresh (Modified Function) #Boomy 
    var _SRPG_SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _SRPG_SceneMap_update.call(this);
        //Process Direction Selection after wait command #Boomy
        if ($gameSystem.isSubBattlePhase() === 'wait_direction_selection') {
            this.srpgWaitDirectionSelection();
            return;
        }
        //Process Post-battle Direction Selection #Boomy
        if ($gameSystem.isSubBattlePhase() === 'pre_direction_selection') {
            this.srpgPostBattleLunaticCode();
            this.preBattleSetDirection();
            return;
        }
        //Process Post-battle Direction Selection #Boomy
        if ($gameSystem.isSubBattlePhase() === 'direction_selection') {
            this.srpgBattlerDeadAfterBattle();
            //Set battle direction #Boomy
            if ($gameTemp._areaTargets !== undefined) { //Set a check if there are multiple actions to occur due to an AoE effect
                if ($gameTemp.areaTargets().length == 0) {
                    this.srpgPostBattleDirectionSelection();
                } else {
                    this.srpgAfterAction();
                }
                return;
            }
        }
        //Process Post-battle 
        if ($gameSystem.isSubBattlePhase() == 'pre_post_battle') {
			this.srpgBattlerDeadAfterBattle(); //This function checks if either attacker or defender has been knocked out and if so set appropriate variables 
			this.preBattleSetDirection();
            $gameSystem.setSubBattlePhase('after_battle');
            return;
        }
		
    };
    //This function runs lunatic code prior to direction_selection phase but after a battle 
    Scene_Map.prototype.srpgPostBattleLunaticCode = function () {
		if($gameTemp.activeEvent()) {
        if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isActor()) {
            eval(_directionSelectionLunaticCode);
            if (_directionSelection && !($gameSwitches.value(_enableSwitch) == false && _enableSwitch !== "0")) {
                $gamePlayer._x = $gameTemp.activeEvent().posX();
                $gamePlayer._y = $gameTemp.activeEvent().posY();
                if (_directionSelectionCharacterName !== -1) {
                    $gamePlayer._characterName = _directionSelectionCharacterName;
                }
                $gameSystem.setSubBattlePhase('direction_selection');
            } else {
                $gameSystem.setSubBattlePhase('after_battle');
            }
        } else {
            $gameSystem.setSubBattlePhase('after_battle');
        }
		}else {
            $gameSystem.setSubBattlePhase('after_battle');
        }
    }
    //This function checks for user input and applies direction after a wait command #Boomy
    Scene_Map.prototype.srpgWaitDirectionSelection = function () {
        if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isEnemy()) {
            //Direction Selection for enemy
			this.preBattleSetDirection()
            this.srpgAfterAction();
        } else if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isActor() && $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isDead()) {
            $gameSystem.setSubBattlePhase('after_battle');
        } else if (eval(_directionSelection) == false) {
            //Skip direction selection
            this.srpgAfterAction();
        } else if ($gameSwitches.value(_enableSwitch) == false && _enableSwitch !== "0") {
			this.srpgAfterAction();
		} else {
            //Set direction of gamePlayer to be the same as active unit if direction indicator is set 
            if (_directionSelectionCharacterName !== -1) {
                $gamePlayer._direction = $gameTemp.activeEvent()._direction;
            }
            //Set direction of unit based on position of mouse 
            if (TouchInput.isMouseMoving() && (_enableTouchSwitch == "0" || $gameSwitches.value(_enableTouchSwitch))) {
                if ((Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX) < 24 && Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseOverY) < 24) == false) {
                    if (Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX) >= Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseOverY)) {
                        if ($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX > 0) {
                            $gameTemp.activeEvent()._direction = 4;
                        } else {
                            $gameTemp.activeEvent()._direction = 6;
                        }
                    } else {
                        if ($gameTemp.activeEvent().screenY() - TouchInput._mouseOverY > 0) {
                            $gameTemp.activeEvent()._direction = 8;
                        } else {
                            $gameTemp.activeEvent()._direction = 2;
                        }
                    }
                }
            }
            //Set direction of unit based on arrow keys 
            else if (Input.dir4 == 2) {
                $gameTemp.activeEvent()._direction = 2;
            } else if (Input.dir4 == 4) {
                $gameTemp.activeEvent()._direction = 4;
            } else if (Input.dir4 == 6) {
                $gameTemp.activeEvent()._direction = 6;
            } else if (Input.dir4 == 8) {
                $gameTemp.activeEvent()._direction = 8;
            }
            //Confirm direction upon ok 
            if (Input.isTriggered('ok')) {
                if (_directionSelectionCharacterName !== -1) {
                    $gamePlayer._characterName = _srpgSet;
                }
                this.srpgAfterAction();
            }
            //Confirm direction when user released touch/mouse 
            if ($gameTemp.activeEvent()) {
                if ($gameTemp.activeEvent() !== null) {
                    if ((TouchInput.isTriggered() && (_enableTouchSwitch == "0" || $gameSwitches.value(_enableTouchSwitch))) && ((Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX) < 24 && Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseOverY) < 24) == false)) {
                        if (Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX) >= Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseOverY)) {
                            if ($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX > 0) {
                                $gameTemp.activeEvent()._direction = 4;
                            } else {
                                $gameTemp.activeEvent()._direction = 6;
                            }
                        } else {
                            if ($gameTemp.activeEvent().screenY() - TouchInput._mouseOverY > 0) {
                                $gameTemp.activeEvent()._direction = 8;
                            } else {
                                $gameTemp.activeEvent()._direction = 2;
                            }
                        }
                        if (_directionSelectionCharacterName !== -1) {
                            $gamePlayer._characterName = _srpgSet;
                        }
                        this.srpgAfterAction();
                    }
                }
            }
        }
    };
    //This function checks for user input and applies direction after battle #Boomy
    //This function is pretty much a carbon copy of srpgWaitDirectionSelection function with minor tweaks
    Scene_Map.prototype.srpgPostBattleDirectionSelection = function () {
        if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isEnemy()) {
            //Direction Selection for enemy
			this.preBattleSetDirection();
            $gameSystem.setSubBattlePhase('after_battle');
        } else if (eval(_directionSelection) == false) {
            //Skip direction selection
            $gameSystem.setSubBattlePhase('after_battle');
        } else if (!$gameTemp.activeEvent()) {
            if (_directionSelectionCharacterName !== -1) {
                $gamePlayer._characterName = _srpgSet;
            }
            $gameSystem.setSubBattlePhase('after_battle');
        } else if ($gameSwitches.value(_enableSwitch) == false && _enableSwitch !== "0") {
            if (_directionSelectionCharacterName !== -1) {
                $gamePlayer._characterName = _srpgSet;
            }
            $gameSystem.setSubBattlePhase('after_battle');
        } else if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isActor() && $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isDead()) {
            if (_directionSelectionCharacterName !== -1) {
                $gamePlayer._characterName = _srpgSet;
            }
            $gameSystem.setSubBattlePhase('after_battle');
        } else {
            $gameTemp.clearMoveTable(); //Remove the movemenet tiles that show where a unit can move/attack (this normally occurs in after_battle)
            //Set direction of gamePlayer to be the same as active unit if direction indicator is set 
            if (_directionSelectionCharacterName !== -1) {
                $gamePlayer._direction = $gameTemp.activeEvent()._direction;
            }
            //Set direction of unit based on position of mouse 
            if (TouchInput.isMouseMoving() && (_enableTouchSwitch == "0" || $gameSwitches.value(_enableTouchSwitch))) {
                if ((Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX) < 24 && Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseOverY) < 24) == false) {
                    if (Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX) >= Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseOverY)) {
                        if ($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX > 0) {
                            $gameTemp.activeEvent()._direction = 4;
                        } else {
                            $gameTemp.activeEvent()._direction = 6;
                        }
                    } else {
                        if ($gameTemp.activeEvent().screenY() - TouchInput._mouseOverY > 0) {
                            $gameTemp.activeEvent()._direction = 8;
                        } else {
                            $gameTemp.activeEvent()._direction = 2;
                        }
                    }
                }
            } else if (Input.dir4 == 2) {
                $gameTemp.activeEvent()._direction = 2;
            } else if (Input.dir4 == 4) {
                $gameTemp.activeEvent()._direction = 4;
            } else if (Input.dir4 == 6) {
                $gameTemp.activeEvent()._direction = 6;
            } else if (Input.dir4 == 8) {
                $gameTemp.activeEvent()._direction = 8;
            }
            //Confirm direction upon ok 
            if (Input.isTriggered('ok')) {
                if (_directionSelectionCharacterName !== -1) {
                    $gamePlayer._characterName = _srpgSet;
                }
                this.srpgAfterAction();
            }
            //Confirm direction when user released touch/mouse 
            if ((TouchInput.isTriggered() && (_enableTouchSwitch == "0" || $gameSwitches.value(_enableTouchSwitch))) && ((Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX) < 24 && Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseOverY) < 24) == false)) {
                if (Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX) >= Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseOverY)) {
                    if ($gameTemp.activeEvent().screenX() - TouchInput._mouseOverX > 0) {
                        $gameTemp.activeEvent()._direction = 4;
                    } else {
                        $gameTemp.activeEvent()._direction = 6;
                    }
                } else {
                    if ($gameTemp.activeEvent().screenY() - TouchInput._mouseOverY > 0) {
                        $gameTemp.activeEvent()._direction = 8;
                    } else {
                        $gameTemp.activeEvent()._direction = 2;
                    }
                }
                if (_directionSelectionCharacterName !== -1) {
                    $gamePlayer._characterName = _srpgSet;
                }
                this.srpgAfterAction();
            }
        }
    };
    //Modified function to add the ability to change direction after standby command #Boomy
    Scene_Map.prototype.commandWait = function () {
        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        //Shoukang MoveAfterAction compatability
		//If actor can still move, ignore direction selection
        if (typeof actor.canMoveAfterAction !== "undefined") {
            if (actor.canMoveAfterAction() && actor.SrpgRemainingMove() > 0 && !actor.isSrpgAfterActionMove() && !$gameTemp.isTurnEndFlag()) {
                this.srpgAfterAction();
            } else if ($gameSwitches.value(_enableSwitch) == false && _enableSwitch !== "0") {
                this.srpgAfterAction();
            } else { //Set mode to direction selection
                actor.onAllActionsEnd();
                if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isActor()) { //Direction Selection Lunatic Code 
                    eval(_directionSelectionLunaticCode);
                }
                //Change player icon to show direction unit is facing 
                if (_directionSelection) {
                    $gamePlayer._x = $gameTemp.activeEvent().posX();
                    $gamePlayer._y = $gameTemp.activeEvent().posY();
                    if (_directionSelectionCharacterName !== -1) {
                        $gamePlayer._characterName = _directionSelectionCharacterName;
                    }
                }
                $gameSystem.clearSrpgActorCommandWindowNeedRefresh(); //Remove command window
                $gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh(); //Remove quick status window 
                $gameSystem.setSubBattlePhase('wait_direction_selection'); //Boomy edit to allow units to change direction if a unit goes into standby #Boomy
                //this.srpgAfterAction(); 
            }
        } else { //Set mode to direction selection
            actor.onAllActionsEnd();
            if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isActor()) { //Direction Selection Lunatic Code 
                eval(_directionSelectionLunaticCode);
            }
            //Change player icon to show direction unit is facing 
            if (_directionSelection) {
                $gamePlayer._x = $gameTemp.activeEvent().posX();
                $gamePlayer._y = $gameTemp.activeEvent().posY();
                if (_directionSelectionCharacterName !== -1) {
                    $gamePlayer._characterName = _directionSelectionCharacterName;
                }
            }
            $gameSystem.clearSrpgActorCommandWindowNeedRefresh(); //Remove command window
            $gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh(); //Remove quick status window 
            $gameSystem.setSubBattlePhase('wait_direction_selection'); //Boomy edit to allow units to change direction if a unit goes into standby #Boomy
            //this.srpgAfterAction(); 
        }
    };
    //Change how preBatttleSetDirection is applied in battle (more a bug fix and compatability with directionMod)
    var _SRPG_preBattleSetDirection = Scene_Map.prototype.preBattleSetDirection;
    Scene_Map.prototype.preBattleSetDirection = function () {
        if ($gameSystem._isSubBattlePhase == "invoke_action") {
            return;
        } else {
            _SRPG_preBattleSetDirection.call(this);
        }
    }
    //戦闘終了の処理（共通）
    var _SRPG_BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        _SRPG_BattleManager_endBattle.call(this, result);
        if (this._srpgBattleResultWindow) {
            this._srpgBattleResultWindow.close();
        }
        this.replayBgmAndBgs();
		if($gameSystem.isSRPGMode()) {
        //MoveAfterAction compatability
        if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1] !== undefined) {
			if($gameSystem._isBattlePhase == "actor_phase") {
            if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].srpgTurnEnd() && !$gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isSrpgAfterActionMove() && $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].SrpgRemainingMove() && !$gameTemp.isTurnEndFlag()) {
				$gameSystem.setSubBattlePhase('pre_post_battle');
            } else {
				$gameSystem.setSubBattlePhase('pre_direction_selection');
            }
			} else {
				$gameSystem.setSubBattlePhase('pre_post_battle');
			}
        }
		}
    };
    //戦闘終了処理のアップデート
    var __SRPG_BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
    BattleManager.updateBattleEnd = function () {
        if ($gameSystem.isSRPGMode() == true) {
            if ($gameSystem.isSubBattlePhase() === 'pre_post_battle' || $gameSystem.isSubBattlePhase() === 'after_battle' || $gameSystem.isSubBattlePhase() === 'pre_direction_selection') {
                SceneManager.pop();
                this._phase = null;
            } else if (this._srpgBattleResultWindow.isChangeExp() == false && (Input.isPressed('ok') || ((_enableTouchSwitch == "0" || $gameSwitches.value(_enableTouchSwitch)) && TouchInput.isPressed()))) {
                this.endBattle(3);
            }
        } else {
            __SRPG_BattleManager_updateBattleEnd.call(this);
        }
    };
    // no moving during a skill!
    var _Game_Player_MB_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        if ($gameSystem.isSRPGMode() && ($gameSystem.isSubBattlePhase() === 'invoke_action' || $gameSystem.isSubBattlePhase() === 'direction_selection' || $gameSystem.isSubBattlePhase() === 'wait_direction_selection')) { //Edit to add direction selection #Boomy
            return false;
        }
        return _Game_Player_MB_canMove.call(this);
    };
    // no pausing, either!
    var _updateCallMenu_MB = Scene_Map.prototype.updateCallMenu;
    Scene_Map.prototype.updateCallMenu = function () {
        if ($gameSystem.isSRPGMode() && ($gameSystem.isSubBattlePhase() === 'invoke_action' || $gameSystem.isSubBattlePhase() === 'direction_selection' || $gameSystem.isSubBattlePhase() === 'wait_direction_selection')) {
            this.menuCalling = false;
            return;
        }
        _updateCallMenu_MB.call(this);
    };
	
	//Make User face target when selecting 
	var _setTargetEvent = Game_Temp.prototype.setTargetEvent;
	Game_Temp.prototype.setTargetEvent = function(event) {
		_setTargetEvent.call(this, event);
		if($gameSystem.isSubBattlePhase() == 'actor_target' && $gameTemp.activeEvent() != $gameTemp.targetEvent() ) {
		$gameTemp.activeEvent().setDirection($gameTemp.activeEvent().dirTo($gameTemp.targetEvent().posX(), $gameTemp.targetEvent().posY()));
		}
	};
	
    //-----------------------------------------------------------------------------
    /**
     * The static class that handles input data from the mouse and touchscreen.
     *
     * @class TouchInput
     */
    TouchInput.isMouseMoving = function () {
        if ($gameTemp._mouseOverX) {
            if ($gameTemp._mouseOverY) {
                if (!($gameTemp._mouseOverX == TouchInput._mouseOverX && $gameTemp._mouseOverY == TouchInput._mouseOverY)) {
                    $gameTemp._mouseOverX = TouchInput._mouseOverX;
                    $gameTemp._mouseOverY = TouchInput._mouseOverY;
                    return true;
                } else {
                    return false;
                }
            }
        }
        $gameTemp._mouseOverX = TouchInput._mouseOverX;
        $gameTemp._mouseOverY = TouchInput._mouseOverY;
    };
})();
