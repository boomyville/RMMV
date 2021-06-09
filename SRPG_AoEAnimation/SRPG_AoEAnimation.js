//=============================================================================
//SRPG_AoEAnimation.js
//=============================================================================
/*:
 * @plugindesc Allows AoE skills to show once when targetting multiple targets. Requires SRPG_AoE.js and Yanfly BattleCore 
 * @author Boomy 
 * 
 * @param Actor Position X
 * @desc Formula for where actors are place on the battlefield
 * @default  Graphics.width - 216 - index * 64
 * 
 * @param Actor Position Y
 * @desc Formula for where actors are place on the battlefield
 * @default   Graphics.height / 2 + 48 * index
 * 
 * @param Enemy Position X
 * @desc Formula for where actors are place on the battlefield
 * @default  216 + index * 64
 * 
 * @param Enemy Position Y
 * @desc Formula for where actors are place on the battlefield
 * @default  Graphics.height / 2 + 48 * index
 * 
 * @help
 * This plugin is a work in progress!
 * Credits to: Dopan, Dr. Q, Traverse, SoulPour777
 *
 * When an AoE spell is cast and more than 1 target is selected ($gameTemp.areaTargets), each target is added to a queue and then the game will execute each battle individually 1 on 1
 * This script will collect all targets and add them into one battle for a 1 vs many scenario
 * This script works with allies, enemies and allies + self
 * Counter attack only applies to the primary target (which is the target that is displayed in srpgPredictionWindow). 
 * The primary target cannot really be changed by the user unless they move the AoE area to not include the primary target
 * Works best with animations set to SCREEN though animations that target individuals still work (they just happened sequentially on the same battle field)
 * This script also removes the target's battle hud if there's more than 1 target to avoid confusion
 *
 */
(function () {
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);
    //Set actor positions
    var _SRPG_YEP_Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function (index) {
        if (Imported.YEP_BattleEngineCore !== undefined) {
            if ($gameSystem.isSRPGMode() == true) {
                this.setHome(eval(parameters['Actor Position X']), eval(parameters['Actor Position Y']));
                this.moveToStartPosition();
            } else {
                _SRPG_YEP_Sprite_Actor_setActorHome.call(this, index);
            }
        } else {
            _SRPG_YEP_Sprite_Actor_setActorHome.call(this, index);
        }
    };
    //Set enemy positions
    var _SRPG_Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function (troopId) {
        if ($gameSystem.isSRPGMode() == true) {
            this.clear();
            this._troopId = troopId;
            this._enemies = [];
            for (var i = 0; i < this.SrpgBattleEnemys().length; i++) {
                var enemy = this.SrpgBattleEnemys()[i];
                var index = i;
                enemy._screenX = eval(parameters['Enemy Position X']);
                enemy._screenY = eval(parameters['Actor Position Y']);
                this._enemies.push(enemy);
            }
            this.makeUniqueNames();
        } else {
            _SRPG_Game_Troop_setup.call(this, troopId);
        }
    };
    Scene_Map.prototype.srpgBattleStart = function (actionArray, targetArray) {
        //Determine if we targetting foes, the user or allies
        var targetTeam;
        //Remove all party members (enemy and actor) from the game (temporarily)
        $gameParty.clearSrpgBattleActors();
        $gameTroop.clearSrpgBattleEnemys();
        //Check if user is targetArray or in AreaTargets();
        var userIsTarget = false;
        var userIsAdded = false;
        if ($gameTemp._areaTargets !== undefined) { //Multiple units selected, check if any are the active unit 
            if ($gameTemp._areaTargets.length == 0) {} else {
                for (var j = 0; j < $gameTemp._areaTargets.length; j++) {
                    if ($gameSystem.EventToUnit($gameTemp._areaTargets[j].event._eventId)[1] == actionArray[1]) { //Actor found, add them to the battle 
                        $gameTemp._areaTargets.splice(j, 1);
                        if (actionArray[0] === 'actor') {
                            $gameParty.pushSrpgBattleActors(actionArray[1]);
                        } else if (actionArray[0] === 'enemy') {
                            $gameTroop.pushSrpgBattleEnemys(actionArray[1]);
                        }
                        userIsTarget = true;
                        break;
                    }
                }
            }
        }
        if (actionArray[1] == targetArray[1]) { //User is the target
            if (actionArray[0] === 'actor') {
                $gameParty.pushSrpgBattleActors(actionArray[1]);
            } else if (actionArray[0] === 'enemy') {
                $gameTroop.pushSrpgBattleEnemys(actionArray[1]);
            }
            userIsAdded = true;
            userIsTarget = true;
        }
        //Add user 
        if (!userIsTarget) {
            if (actionArray[0] === 'actor') {
                $gameParty.pushSrpgBattleActors(actionArray[1]);
            } else if (actionArray[0] === 'enemy') {
                $gameTroop.pushSrpgBattleEnemys(actionArray[1]);
            }
        }
        //Add target to the battle 
        if (actionArray[0] === 'actor') {
            if (targetArray[0] === 'actor') {
                targetTeam = "allies";
                //$gameTemp.addAreaTarget({item: targetArray[1].action(0), event: targetArray[1].event()});
                if (!userIsAdded) {
                    $gameParty.pushSrpgBattleActors(targetArray[1]);
                }
                //Set the action of the 'active unit' to be the ally
                actionArray[1].action(0).setTarget(1);
            } else if (targetArray[0] === 'enemy') {
                targetTeam = "foes";
                //$gameTemp.addAreaTarget({item: targetArray[1].action(0), event: targetArray[1].event()});
                if (!userIsAdded) {
                    $gameTroop.pushSrpgBattleEnemys(targetArray[1]);
                }
                actionArray[1].action(0).setTarget(0);
            }
            //If the 'active unit' is an enemy, add them to the battle as the 'active unit'
        } else if (actionArray[0] === 'enemy') {
            actionArray[1].action(0).setSrpgEnemySubject(0);
            if (targetArray[0] === 'actor') {
                targetTeam = "foes";
                //$gameTemp.addAreaTarget({item: targetArray[1].action(0), event: targetArray[1].event()});
                if (!userIsAdded) {
                    $gameParty.pushSrpgBattleActors(targetArray[1]);
                }
                actionArray[1].action(0).setTarget(0);
            } else if (targetArray[0] === 'enemy') {
                targetTeam = "allies";
                //$gameTemp.addAreaTarget({item: targetArray[1].action(0), event: targetArray[1].event()});
                if (!userIsAdded) {
                    $gameTroop.pushSrpgBattleEnemys(targetArray[1]);
                }
                actionArray[1].action(0).setTarget(1);
            }
        }
        //Go through $gameTemp.areaTargets() and add them to battle as well
        if ($gameTemp._areaTargets !== undefined) {
            for (var i = 0; i < $gameTemp.areaTargets().length; i++) {
                if (actionArray[0] == 'actor' && targetTeam == "allies") {
                    $gameParty.pushSrpgBattleActors($gameSystem.EventToUnit($gameTemp.areaTargets()[i].event._eventId)[1]);
                } else if (actionArray[0] == 'actor' && targetTeam == "foes") {
                    $gameTroop.pushSrpgBattleEnemys($gameSystem.EventToUnit($gameTemp.areaTargets()[i].event._eventId)[1]);
                } else if (actionArray[0] == 'enemy' && targetTeam == "foes") {
                    $gameParty.pushSrpgBattleActors($gameSystem.EventToUnit($gameTemp.areaTargets()[i].event._eventId)[1]);
                } else if (actionArray[0] == 'enemy' && targetTeam == "allies") {
                    $gameTroop.pushSrpgBattleEnemys($gameSystem.EventToUnit($gameTemp.areaTargets()[i].event._eventId)[1]);
                }
            }
        }
        //Remove area targets so we don't end up attacking units individually after an AoE skill
        actionArray[1].setActionTiming(0); //_srpgActionTiming = 0 means this unit is attacker, if its 1 then the unit is the defender (that can counter attack)
        //Setup the troop data (by default it will use Troop map 1 as the battle)
        BattleManager.setup(1, false, true);
        //if ($dataTroops[_srpgTroopID]) {
        //   BattleManager.setup(_srpgTroopID, false, true);
        //} else {
        //}
        //If target and 'active unit' are not the same, set counter-attack targets (if both units are on opposing teams)
        if (actionArray[1] != targetArray[1]) {
            targetArray[1].srpgMakeNewActions();
            if (actionArray[0] === 'actor' && targetArray[0] === 'enemy' && targetArray[1].canMove()) {
                targetArray[1].action(0).setSrpgEnemySubject(0);
                targetArray[1].action(0).setAttack();
                targetArray[1].action(0).setTarget(0);
            }
            if (actionArray[0] === 'enemy' && targetArray[0] === 'actor' && targetArray[1].canMove()) {
                targetArray[1].action(0).setAttack();
                targetArray[1].action(0).setTarget(0);
            }
            targetArray[1].setActionTiming(1);
        }
        if (actionArray[0] != targetArray[0] && actionArray[1].currentAction().item().meta.srpgUncounterable) {
            targetArray[1].clearActions();
        }
        //Adds check for srpgUncounterable for passive states #Boomy edit
        var currentUser = actionArray[1];
        for (var i = 0; i < actionArray[1].states().length; i++) {
            if (eval(actionArray[1].states()[i].meta.srpgUncounterable)) {
                targetArray[1].clearActions();
                break;
            }
        }
        //this.preBattleSetDirection();
        //行動回数追加スキルなら行動回数を追加する
        var addActionNum = Number(actionArray[1].action(0).item().meta.addActionTimes);
        if (addActionNum && addActionNum > 0) {
            actionArray[1].SRPGActionTimesAdd(addActionNum);
        }
        this._callSrpgBattle = true;
        this.eventBeforeBattle();
    };
    //Kill units that were affected by AreaTargets
    var _Scene_Map_srpgBattlerDeadAfterBattle = Scene_Map.prototype.srpgBattlerDeadAfterBattle;
    Scene_Map.prototype.srpgBattlerDeadAfterBattle = function () {
        _Scene_Map_srpgBattlerDeadAfterBattle.call(this);
        if ($gameTemp._areaTargets !== undefined) {
            for (var i = 0; i < $gameTemp.areaTargets().length; i++) {
                if ($gameSystem.EventToUnit($gameTemp.areaTargets()[i].event._eventId)[1].isDead()) {
                    if (!$gameTemp.areaTargets()[i].event.isErased()) {
                        if ($gameSystem.EventToUnit($gameTemp.areaTargets()[i].event._eventId)[1].isActor()) {
                            var oldValue = $gameVariables.value(PluginManager.parameters('SRPG_core').existActorVarID);
                            $gameVariables.setValue(PluginManager.parameters('SRPG_core').existActorVarID, oldValue - 1);
                        } else if ($gameSystem.EventToUnit($gameTemp.areaTargets()[i].event._eventId)[1].isEnemy()) {
                            var oldValue = $gameVariables.value(PluginManager.parameters('SRPG_core').existEnemyVarID);
                            $gameVariables.setValue(PluginManager.parameters('SRPG_core').existEnemyVarID, oldValue - 1);
                        }
                        $gameTemp.areaTargets()[i].event.erase();
                    }
                }
            }
        }
        $gameTemp.clearAreaTargets();
    };
    // SRPG戦闘用のウィンドウを作る
    Scene_Battle.prototype.createSprgBattleStatusWindow = function () {
        this._srpgBattleStatusWindowLeft = new Window_SrpgBattleStatus(0);
        this._srpgBattleStatusWindowRight = new Window_SrpgBattleStatus(1);
        this._srpgBattleStatusWindowLeft.openness = 0;
        this._srpgBattleStatusWindowRight.openness = 0;
        //Boomy edit for AoE display 
        if ($gameParty.battleMembers().length == 1 && $gameTroop.members().length == 0) {
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        }
        if ($gameParty.battleMembers().length == 0 && $gameTroop.members().length == 1) {
            this._srpgBattleStatusWindowRight.setBattler($gameTroop.members()[0]);
        }
        if ($gameParty.battleMembers().length == 1 && $gameTroop.members().length == 1) {
            this._srpgBattleStatusWindowLeft.setBattler($gameTroop.members()[0]);
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        }
        if ($gameParty.battleMembers().length == 2 && $gameTroop.members().length == 0) {
            this._srpgBattleStatusWindowLeft.setBattler($gameParty.battleMembers()[1]);
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        }
        if ($gameParty.battleMembers().length == 0 && $gameTroop.members().length == 2) {
            this._srpgBattleStatusWindowRight.setBattler($gameTroop.members()[0]);
            this._srpgBattleStatusWindowLeft.setBattler($gameTroop.members()[1]);
        }
        if ($gameParty.battleMembers().length > 2) {
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        }
        if ($gameTroop.members().length > 2) {
            this._srpgBattleStatusWindowRight.setBattler($gameTroop.members()[0]);
        }
        this.addWindow(this._srpgBattleStatusWindowLeft);
        this.addWindow(this._srpgBattleStatusWindowRight);
        BattleManager.setSrpgBattleStatusWindow(this._srpgBattleStatusWindowLeft, this._srpgBattleStatusWindowRight);
    };
})()
