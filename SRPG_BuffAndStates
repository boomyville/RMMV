//=============================================================================
// SRPG_BuffStatesCore.js
//=============================================================================
/*:
 * @plugindesc Allows use of Yanfly Buff and States Core with SRPG_core.js
 * @author Boomy 
 * 
 * @help 
 * Information:
 * Yanfly Buff and States Core is mostly compatitable with Srpg_core
 * However, SRPG_core re-writes how "battle turns" work which means state notetags that trigger when turns elapse do not work
 * This plugin adds two SRPG specific notetags that allow for states to run code when a unit team's turn ends  
 *
 * Example:
 * <Custom SRPG Phase Start Effect>
 * a.hp < a.mhp * 0.5 ? a.gainHp(Math.floor(a.mhp * 0.1)) : a.addBuff(2, 1)
 * </Custom SRPG Phase Start Effect>
 * If user's health is above 50% at start of the turn, gain 1 turn strength buff; otherwise heal 10% max HP
 *
 * Usage:
 * Place below srpg_core.js and Buff and States core
 * Add <Custom SRPG Phase Start> or <Custom SRPG Phase End> notetags with custom code in your state notebox
 * Phase Start = Runs when the unit's team regains control 
 * Phase End = Runs when the unit's team finishes their turn  
 *
 * Rewrites the following functions:
 * Yanfly Notetag processing (Specific for Buff and States Core)
 * Yanfly DatabaseManager.initStateEval function (Specific for Buff and States Core)
 *
 * Aliased functions: 
 * Srpg_core.js setBattlePhase 
 * Srpg_core.js srpgStartEnemyTurn / srpgStartActorTurn
 */
//===============================================================
// Parameter Variables
//===============================================================
(function () {
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);
    DataManager.processBSCNotetags1 = function (group) {
        for (var n = 1; n < group.length; n++) {
            var obj = group[n];
            var notedata = obj.note.split(/[\r\n]+/);
            obj.showTurns = Yanfly.Param.BSCShowTurns;
            obj.turnAlign = Yanfly.Param.BSCTurnAlign;
            obj.turnFontSize = Yanfly.Param.BSCFontSize;
            obj.turnBufferX = Yanfly.Param.BSCTurnBufferX;
            obj.turnBufferY = Yanfly.Param.BSCTurnBufferY;
            obj.turnColor = Yanfly.Param.BSCTurnColor;
            obj.reapplyRules = Yanfly.Param.BSCReapplyRules;
            this.initStateEval(obj);
            this.initStateCounter(obj);
            var evalMode = 'none';
            var evalType = 'none';
            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                if (line.match(/<(?:SHOW TURNS)>/i)) {
                    obj.showTurns = true;
                } else if (line.match(/<(?:HIDE TURNS)>/i)) {
                    obj.showTurns = false;
                } else if (line.match(/<(?:TURN ALIGNMENT|turn align):[ ](.*)>/i)) {
                    obj.turnAlign = String(RegExp.$1).toLowerCase();
                } else if (line.match(/<(?:TURN FONT SIZE):[ ](\d+)>/i)) {
                    obj.turnFontSize = parseInt(RegExp.$1);
                } else if (line.match(/<(?:TURN BUFFER X):[ ]([\+\-]\d+)>/i)) {
                    obj.turnBufferX = parseInt(RegExp.$1);
                } else if (line.match(/<(?:TURN BUFFER Y):[ ]([\+\-]\d+)>/i)) {
                    obj.turnBufferY = parseInt(RegExp.$1);
                } else if (line.match(/<(?:TURN COLOR):[ ](\d+)>/i)) {
                    obj.turnColor = parseInt(RegExp.$1);
                } else if (line.match(/<(?:REAPPLY IGNORE TURNS)>/i)) {
                    obj.reapplyRules = 0;
                } else if (line.match(/<(?:REAPPLY RESET TURNS)>/i)) {
                    obj.reapplyRules = 1;
                } else if (line.match(/<(?:REAPPLY ADD TURNS)>/i)) {
                    obj.reapplyRules = 2;
                } else if (line.match(/<CUSTOM[ ](.*)[ ]EFFECT>/i)) {
                    var name = String(RegExp.$1).toUpperCase();
                    evalMode = 'custom state effect';
                    if (['APPLY', 'ADD'].contains(name)) {
                        evalType = 'addState';
                    } else if (['REMOVE', 'ERASE'].contains(name)) {
                        evalType = 'removeState';
                    } else if (['LEAVE', 'DECAY'].contains(name)) {
                        evalType = 'leaveState';
                    } else if (['TURN START', 'BEGIN'].contains(name)) {
                        evalType = 'turnStartState';
                    } else if (['TURN END', 'CLOSE'].contains(name)) {
                        evalType = 'turnEndState';
                    } else if (['SRPG PHASE END'].contains(name)) { //SRPG Edit
                        evalType = 'srpgPhaseEnd';
                    } else if (['SRPG PHASE START'].contains(name)) { //SRPG Edit
                        evalType = 'srpgPhaseStart';
                    } else if (['REGENERATE', 'REGEN', 'WHILE'].contains(name)) {
                        evalType = 'regenerateState';
                    } else if (['SELECT', 'ONTARGET'].contains(name)) {
                        evalType = 'selectState';
                    } else if (['DESELECT', 'OFFTARGET'].contains(name)) {
                        evalType = 'deselectState';
                    } else if (['REACT', 'REACTION'].contains(name)) {
                        evalType = 'reactState';
                    } else if (['RESPOND', 'RESPONSE'].contains(name)) {
                        evalType = 'respondState';
                    } else if (['INITIATE', 'ONAPPLY'].contains(name)) {
                        evalType = 'initiateState';
                    } else if (['CONFIRM', 'PREDAMAGE', 'PRE-DAMAGE'].contains(name)) {
                        evalType = 'confirmState';
                    } else if (['ESTABLISH', 'POSTDAMAGE', 'POST-DAMAGE'].contains(name)) {
                        evalType = 'establishState';
                    } else if (['CONCLUDE', 'OFFAPPLY'].contains(name)) {
                        evalType = 'concludeState';
                    } else if (['ACTION START', 'START'].contains(name)) {
                        evalType = 'actionStartState';
                    } else if (['ACTION END', 'FINISH'].contains(name)) {
                        evalType = 'actionEndState';
                    } else if (['BATTLE', 'BATTLE START'].contains(name)) {
                        evalType = 'battle';
                    } else if (['VICTORY', 'BATTLE VICTORY'].contains(name)) {
                        evalType = 'victory';
                    } else if (['DEFEAT', 'BATTLE DEFEAT'].contains(name)) {
                        evalType = 'defeat';
                    } else if (['ESCAPE', 'BATTLE ESCAPE'].contains(name)) {
                        evalType = 'escape';
                    }
                } else if (line.match(/<\/CUSTOM[ ](.*)[ ]EFFECT>/i)) {
                    evalMode = 'none';
                    evalType = 'none';
                } else if (evalMode === 'custom state effect') {
                    obj.customEffectEval[evalType] = obj.customEffectEval[evalType] + line + '\n';
                } else if (line.match(/<COUNTER FONT SIZE:[ ](\d+)>/i)) {
                    obj.stateCounterSettings['size'] = parseInt(RegExp.$1);
                } else if (line.match(/<COUNTER[ ](?:ALIGNMENT|align):[ ](.*)>/i)) {
                    obj.stateCounterSettings['align'] = String(RegExp.$1).toLowerCase();
                } else if (line.match(/<COUNTER BUFFER X:[ ]([\+\-]\d+)>/i)) {
                    obj.stateCounterSettings['bufferX'] = parseInt(RegExp.$1);
                } else if (line.match(/<COUNTER BUFFER Y:[ ]([\+\-]\d+)>/i)) {
                    obj.stateCounterSettings['bufferY'] = parseInt(RegExp.$1);
                } else if (line.match(/<COUNTER TEXT COLOR:[ ](\d+)>/i)) {
                    obj.stateCounterSettings['color'] = parseInt(RegExp.$1);
                }
            }
        }
    };
    //Yanfly Buff and States Core edit (add Phase Change custom effect)
    DataManager.initStateEval = function (obj) {
        obj.customEffectEval = {};
        obj.customEffectEval['addState'] = '';
        obj.customEffectEval['removeState'] = '';
        obj.customEffectEval['leaveState'] = '';
        obj.customEffectEval['turnStartState'] = '';
        obj.customEffectEval['turnEndState'] = '';
        obj.customEffectEval['regenerateState'] = '';
        obj.customEffectEval['srpgPhaseStart'] = ''; //SRPG Edit
        obj.customEffectEval['srpgPhaseEnd'] = ''; //SRPG Edit
        obj.customEffectEval['selectState'] = '';
        obj.customEffectEval['deselectState'] = '';
        obj.customEffectEval['reactState'] = '';
        obj.customEffectEval['respondState'] = '';
        obj.customEffectEval['initiateState'] = '';
        obj.customEffectEval['concludeState'] = '';
        obj.customEffectEval['confirmState'] = '';
        obj.customEffectEval['establishState'] = '';
        obj.customEffectEval['actionStartState'] = '';
        obj.customEffectEval['actionEndState'] = '';
        obj.customEffectEval['battle'] = '';
        obj.customEffectEval['victory'] = '';
        obj.customEffectEval['defeat'] = '';
        obj.customEffectEval['escape'] = '';
    };
    var _onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function () {
        //Buff & States Core Fix
        if (Imported.YEP_BuffsStatesCore !== undefined) {
            if (Imported.YEP_BuffsStatesCore) {
                if (this.meetTurnEndStateEffectsConditions()) this.onTurnEndStateEffects();
            }
        }
        if (Imported.YEP_X_SkillCooldowns) {
            //Cooldown Fix
            this.updateCooldowns();
            //Warmup Fix
            this.updateWarmups();
        }
        if ($gameSystem.isSRPGMode() == true && typeof this.SrpgRemainingMove !== "undefined") {
            this.setSrpgRemainingMove(0);
            this.setSrpgAfterActionMove(false);
        }
        _onTurnEnd.call(this);
    };
    Game_Battler.prototype.meetTurnEndStateEffectsConditions = function () {
        //SRPG Edit
        //if (!$gameParty.inBattle()) return false;
        if (!$gameParty.inBattle() && !$gameSystem.isSRPGMode()) return false;
        if (Imported.YEP_BattleEngineCore) {
            if (BattleManager.isTurnBased()) {
                return true;
            } else if (BattleManager.isTickBased() && !BattleManager.isTurnEnd()) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    };
    //SRPG Edit <Custom SRPG Phase Start Effect>
    Game_Battler.prototype.srpgPhaseStart = function () {
        var states = this.states();
        var length = states.length;
        for (var i = 0; i < length; ++i) {
            var state = states[i];
            if (state) this.srpgPhaseStartStateEffects(state.id);
        }
    }
    //SRPG Edit <Custom SRPG Phase End Effect>
    Game_Battler.prototype.srpgPhaseEnd = function () {
        var states = this.states();
        var length = states.length;
        for (var i = 0; i < length; ++i) {
            var state = states[i];
            if (state) this.srpgPhaseEndStateEffects(state.id);
        }
    }
    Game_Battler.prototype.srpgPhaseStartStateEffects = function (stateId) {
        this.customEffectEval(stateId, 'srpgPhaseStart');
        this.refresh();
    };
    Game_Battler.prototype.srpgPhaseEndStateEffects = function (stateId) {
        this.customEffectEval(stateId, 'srpgPhaseEnd');
        this.refresh();
    };
    //Runs state code for <Custom SRPG Phase Start Effect> and <Custom SRPG Phase End Effect>
    var _srpgStartActorTurn = Game_System.prototype.srpgStartActorTurn;
    Game_System.prototype.srpgStartActorTurn = function () {
        _srpgStartActorTurn.call(this);
        $gameSystem.SrpgActorsList().forEach(function (unit) {
            unit.srpgPhaseEnd();
        });
        $gameSystem.SrpgActorsList().forEach(function (unit) {
            unit.srpgPhaseStart();
        });
    }
    var _srpgStartEnemyTurn = Game_System.prototype.srpgStartEnemyTurn;
    Game_System.prototype.srpgStartEnemyTurn = function () {
        _srpgStartEnemyTurn.call(this);
        $gameSystem.SrpgEnemiesList().forEach(function (unit) {
            unit.srpgPhaseStart();
        });
        $gameSystem.SrpgEnemiesList().forEach(function (unit) {
            unit.srpgPhaseEnd();
        });
    }
    Game_System.prototype.SrpgEnemiesList = function () {
        var i;
        var array = [];
        for (i = 0; i < $gameSystem._EventToUnit.length; i++) {
            if (typeof $gameSystem._EventToUnit[i] !== 'undefined') {
                if ($gameSystem._EventToUnit[i] !== null) {
                    if ($gameSystem._EventToUnit[i][0] == "enemy") {
                        array.push($gameSystem._EventToUnit[i][1]);
                    }
                }
            }
        }
        return array;
    }
    //EDIT - New function (returns a list of active actors on the battlefield)
    Game_System.prototype.SrpgActorsList = function () {
        var i;
        var array = [];
        for (i = 0; i < $gameSystem._EventToUnit.length; i++) {
            if (typeof $gameSystem._EventToUnit[i] !== 'undefined') {
                if ($gameSystem._EventToUnit[i] !== null) {
                    if ($gameSystem._EventToUnit[i][0] == "actor") {
                        array.push($gameActors.actor($gameSystem._EventToUnit[i][1]));
                    }
                }
            }
        }
        return array;
    }
})();
