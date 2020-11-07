//=============================================================================
//SRPG_Pathfinding.js
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
 * @param srpgPredictionWindowMode
 * @desc Change the display of the battle prediction window. (1: full / 2: only attack name / 3: not displayed)
 * @type select
 * @option Full
 * @value 1
 * @option Only attack name
 * @value 2
 * @option Not displayed
 * @value 3
 * @default 1
 *
 * @help
 * This plugin is plug and play. Works best with a character image that indicates which direction a unit will be facing
 * Best used with the SRPG_DirectionMod.js plugin which gives bonuses depending on unit direction
 *
 * Lunatic code is run only during actor phase and only if direction selection is enabled. 
 * Its main role is to display a message to the player to select a direction
 * No example is included as it would require an external plugin to look good (such as YEP Message Core Extension 2)
 *
 * Change Log
 * 8/11/20 - First Release
 */
(function() {

    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);

    var _directionSelection = parameters['After Battle Direction Selection'] || true; 
    var _directionSelectionLunaticCode = parameters['After Battle Lunatic Code'];
    var _directionSelectionCharacterName = parameters['After Battle Character Image']; 
	var _srpgPredictionWindowMode = Number(parameters['srpgPredictionWindowMode'] || 1);
	
	var _srpgSet = parameters['SRPG Image']; 

    // Map Refresh (Modified Function) #Boomy 
    var _SRPG_SceneMap_updater = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _SRPG_SceneMap_updater.call(this);
        if ($gameSystem.isSRPGMode() == false) {
            return;
        }
        if ($gameSystem.srpgWaitMoving() == true || $gameTemp.isAutoMoveDestinationValid() == true) {
            return;
        }
        //If map action has been completed 
        if ($gameTemp.isTurnEndFlag() == true) {
            this.menuActorTurnEnd();
            return;
        }
        //If actor has chosen the equipment command 
        if ($gameTemp.isSrpgActorEquipFlag() == true) {
            this.srpgAfterActorEquip();
            return;
        }
		console.log("A");
        //Open Status Window 
        var flag = $gameSystem.srpgStatusWindowNeedRefresh();
        if (flag[0]) {
            if (!this._mapSrpgStatusWindow.isOpen() && !this._mapSrpgStatusWindow.isOpening()) {
                this._mapSrpgStatusWindow.setBattler(flag[1]);
                this._mapSrpgStatusWindow.open();
            }
        } else {
            if (this._mapSrpgStatusWindow.isOpen() && !this._mapSrpgStatusWindow.isClosing()) {
                this._mapSrpgStatusWindow.clearBattler();
                this._mapSrpgStatusWindow.close();
            }
        }
        //Open Actor Command Window 
        var flag = $gameSystem.srpgActorCommandWindowNeedRefresh();
        if (flag[0]) {
            if (!this._mapSrpgActorCommandWindow.isOpen() && !this._mapSrpgActorCommandWindow.isOpening()) {
                this._mapSrpgActorCommandWindow.setup(flag[1][1]);
            }
        } else {
            if (this._mapSrpgActorCommandWindow.isOpen() && !this._mapSrpgActorCommandWindow.isClosing()) {
                this._mapSrpgActorCommandWindow.close();
                this._mapSrpgActorCommandWindow.deactivate();
            }
        }
        //Open Actor Status Window 
        var flag = $gameSystem.srpgActorCommandStatusWindowNeedRefresh();
        if (!flag) {
            flag = [false, null];
        }
        if (flag[0]) {
            if (!this._mapSrpgActorCommandStatusWindow.isOpen() && !this._mapSrpgActorCommandStatusWindow.isOpening()) {
                this._mapSrpgActorCommandStatusWindow.setBattler(flag[1][1]);
            }
        } else {
            if (this._mapSrpgActorCommandStatusWindow.isOpen() && !this._mapSrpgActorCommandStatusWindow.isClosing()) {
                this._mapSrpgActorCommandStatusWindow.clearBattler();
            }
        }
        //Open Battle Prediction Window 
        var flag = $gameSystem.srpgBattleWindowNeedRefresh();
        if (flag[0]) {
            if (_srpgPredictionWindowMode === 3) {
                this.commandBattleStart();
                return;
            }
            if (!this._mapSrpgTargetWindow.isOpen() && !this._mapSrpgTargetWindow.isOpening()) {
                this._mapSrpgTargetWindow.setBattler(flag[2]);
                this._mapSrpgTargetWindow.open();
            }
            if (!this._mapSrpgPredictionWindow.isOpen() && !this._mapSrpgPredictionWindow.isOpening()) {
                this._mapSrpgPredictionWindow.setBattler(flag[1], flag[2]);
                this._mapSrpgPredictionWindow.open();
            }
            if (!this._mapSrpgBattleWindow.isOpen() && !this._mapSrpgBattleWindow.isOpening()) {
                this._mapSrpgBattleWindow.setup(flag[1]);
            }
        } else {
            if (this._mapSrpgTargetWindow.isOpen() && !this._mapSrpgTargetWindow.isClosing()) {
                this._mapSrpgTargetWindow.clearBattler();
                this._mapSrpgTargetWindow.close();
            }
            if (this._mapSrpgPredictionWindow.isOpen() && !this._mapSrpgPredictionWindow.isClosing()) {
                this._mapSrpgPredictionWindow.clearBattler();
                this._mapSrpgPredictionWindow.close();
            }
            if (this._mapSrpgBattleWindow.isOpen() && !this._mapSrpgBattleWindow.isClosing()) {
                this._mapSrpgBattleWindow.clearActor();
                this._mapSrpgBattleWindow.close();
                this._mapSrpgBattleWindow.deactivate();
            }
        }
		console.log("B");
        if ($gameMap.isEventRunning() == true) {
            return;
        }
		console.log("C");
        //Process Direction Selection after wait command #Boomy
        if ($gameSystem.isSubBattlePhase() == 'wait_direction_selection') {
            this.srpgWaitDirectionSelection();
            return;
        }
        //Process Battle 
        if (this._callSrpgBattle == true && this._mapSrpgBattleWindow.isClosed()) {
            this._callSrpgBattle = false;
            SceneManager.push(Scene_Battle);
            return;
        }
        //Process Post-battle Direction Selection #Boomy
        if ($gameSystem.isSubBattlePhase() === 'pre_direction_selection') {
            this.srpgPostBattleLunaticCode();
            return;
        }
        //Process Post-battle Direction Selection #Boomy
        if ($gameSystem.isSubBattlePhase() === 'direction_selection') {
            //$gameSystem.setSubBattlePhase('after_battle');
            this.srpgBattlerDeadAfterBattle();
            this.srpgPostBattleDirectionSelection(); //This function checks if user has selected an input (direction key or mouse click) and applies direction to battler 
            return;
        }
        //Process Post-battle 
        if ($gameSystem.isSubBattlePhase() === 'after_battle') {
            //this.srpgBattlerDeadAfterBattle(); //This function checks if either attacker or defender has been knocked out and if so set appropriate variables 
            this.srpgAfterAction();
            return;
        }
        //Start Actor Phase 
        if ($gameSystem.isBattlePhase() === 'actor_phase' && $gameSystem.isSubBattlePhase() === 'initialize') {
            if (!this.isSrpgActorTurnEnd()) {
                $gameSystem.srpgStartAutoActorTurn(); //自動行動のアクターが行動する
            } else {
                $gameSystem.setSubBattlePhase('normal');
            }
        }
        //Process AutoBattle 
        if ($gameSystem.isBattlePhase() === 'auto_actor_phase') {
            if ($gameSystem.isSubBattlePhase() === 'auto_actor_command') {
                this.srpgInvokeAutoActorCommand();
                return;
            } else if ($gameSystem.isSubBattlePhase() === 'auto_actor_move') {
                this.srpgInvokeAutoActorMove();
                return;
            } else if ($gameSystem.isSubBattlePhase() === 'auto_actor_action') {
                this.srpgInvokeAutoUnitAction();
                return;
            }
        }
        //Start Enemy Phase 
        if ($gameSystem.isBattlePhase() === 'enemy_phase') {
            if ($gameSystem.isSubBattlePhase() === 'enemy_command') {
                this.srpgInvokeEnemyCommand();
                return;
            } else if ($gameSystem.isSubBattlePhase() === 'enemy_move') {
                this.srpgInvokeEnemyMove();
                return;
            } else if ($gameSystem.isSubBattlePhase() === 'enemy_action') {
                this.srpgInvokeAutoUnitAction();
                return;
            }
        }
    };

 //This function runs lunatic code prior to direction_selection phase but after a battle 
    Scene_Map.prototype.srpgPostBattleLunaticCode = function () {
        if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isActor()) {
            eval(_directionSelectionLunaticCode);
            if (_directionSelection) {
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
    }
    //This function checks for user input and applies direction after a wait command #Boomy
    Scene_Map.prototype.srpgWaitDirectionSelection = function () {
        
			console.log("direction selection");
			if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isEnemy()) {
            //Direction Selection for enemy
            this.srpgAfterAction();
        } else if (eval(_directionSelection) == false) {
            //Skip direction selection
            this.srpgAfterAction();
        } else {
            //Set direction of gamePlayer to be the same as active unit if direction indicator is set 
            if (_directionSelectionCharacterName !== -1) {
                $gamePlayer._direction = $gameTemp.activeEvent()._direction;
            }
            //Set direction of unit based on position of mouse 
            if (TouchInput.isMouseMoving()) {
                if ((Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseX) < 24 && Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseY) < 24) == false) {
                    if (Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseX) >= Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseY)) {
                        if ($gameTemp.activeEvent().screenX() - TouchInput._mouseX > 0) {
                            $gameTemp.activeEvent()._direction = 4;
                        } else {
                            $gameTemp.activeEvent()._direction = 6;
                        }
                    } else {
                        if ($gameTemp.activeEvent().screenY() - TouchInput._mouseY > 0) {
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
            if (TouchInput.isTriggered() && ((Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseX) < 24 && Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseY) < 24) == false)) {
                if (Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseX) >= Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseY)) {
                    if ($gameTemp.activeEvent().screenX() - TouchInput._mouseX > 0) {
                        $gameTemp.activeEvent()._direction = 4;
                    } else {
                        $gameTemp.activeEvent()._direction = 6;
                    }
                } else {
                    if ($gameTemp.activeEvent().screenY() - TouchInput._mouseY > 0) {
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
    //This function checks for user input and applies direction after battle #Boomy
    //This function is pretty much a carbon copy of srpgWaitDirectionSelection function with minor tweaks
    Scene_Map.prototype.srpgPostBattleDirectionSelection = function () {
        if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].isEnemy()) {
            //Direction Selection for enemy
            $gameSystem.setSubBattlePhase('after_battle');
        } else if (eval(_directionSelection) == false) {
            //Skip direction selection
            $gameSystem.setSubBattlePhase('after_battle');
        } else {
            $gameTemp.clearMoveTable(); //Remove the movemenet tiles that show where a unit can move/attack (this normally occurs in after_battle)
            //Set direction of gamePlayer to be the same as active unit if direction indicator is set 
            if (_directionSelectionCharacterName !== -1) {
                $gamePlayer._direction = $gameTemp.activeEvent()._direction;
            }
            //Set direction of unit based on position of mouse 
            if (TouchInput.isMouseMoving()) {
                if ((Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseX) < 24 && Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseY) < 24) == false) {
                    if (Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseX) >= Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseY)) {
                        if ($gameTemp.activeEvent().screenX() - TouchInput._mouseX > 0) {
                            $gameTemp.activeEvent()._direction = 4;
                        } else {
                            $gameTemp.activeEvent()._direction = 6;
                        }
                    } else {
                        if ($gameTemp.activeEvent().screenY() - TouchInput._mouseY > 0) {
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
            if (TouchInput.isTriggered() && ((Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseX) < 24 && Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseY) < 24) == false)) {
                if (Math.abs($gameTemp.activeEvent().screenX() - TouchInput._mouseX) >= Math.abs($gameTemp.activeEvent().screenY() - 24 - TouchInput._mouseY)) {
                    if ($gameTemp.activeEvent().screenX() - TouchInput._mouseX > 0) {
                        $gameTemp.activeEvent()._direction = 4;
                    } else {
                        $gameTemp.activeEvent()._direction = 6;
                    }
                } else {
                    if ($gameTemp.activeEvent().screenY() - TouchInput._mouseY > 0) {
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
    };

 //戦闘終了の処理（共通）
    var _SRPG_BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        _SRPG_BattleManager_endBattle.call(this, result);
        if (this._srpgBattleResultWindow) {
            this._srpgBattleResultWindow.close();
        }
        this.replayBgmAndBgs();
        $gameSystem.setSubBattlePhase('pre_direction_selection');
    };
    //戦闘終了処理のアップデート
    var _SRPG_BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
    BattleManager.updateBattleEnd = function () {
        if ($gameSystem.isSRPGMode() == true) {
            if ($gameSystem.isSubBattlePhase() === 'after_battle' || $gameSystem.isSubBattlePhase() === 'pre_direction_selection') {
                SceneManager.pop();
                this._phase = null;
            } else if (this._srpgBattleResultWindow.isChangeExp() == false && (Input.isPressed('ok') || TouchInput.isPressed())) {
                this.endBattle(3);
            }
        } else {
            _SRPG_BattleManager_updateBattleEnd.call(this);
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

    //-----------------------------------------------------------------------------
    /**
     * The static class that handles input data from the mouse and touchscreen.
     *
     * @class TouchInput
     */
    TouchInput.isMouseMoving = function () {
        if ($gameTemp._mouseX) {
            if ($gameTemp._mouseY) {
                if (!($gameTemp._mouseX == TouchInput._mouseX && $gameTemp._mouseY == TouchInput._mouseY)) {
                    $gameTemp._mouseX = TouchInput._mouseX;
                    $gameTemp._mouseY = TouchInput._mouseY;
                    return true;
                } else {
                    return false;
                }
            }
        }
        $gameTemp._mouseX = TouchInput._mouseX;
        $gameTemp._mouseY = TouchInput._mouseY;
    };

})();
