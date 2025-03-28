//=============================================================================
//SRPG_AoEAnimation.js
//=============================================================================
/*:
 * @plugindesc Allows AoE skills to show once when targetting multiple targets. Requires SRPG_AoE.js and Yanfly BattleCore 
 * @author Boomy 
 * 
 * @param Enable By Default
 * @desc Enable AoE animation by default if srpgAreaRange is specified in a skill
 * @default true
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
 * @default  216 - index * 64
 * 
 * @param Enemy Position Y
 * @desc Formula for where actors are place on the battlefield
 * @default  Graphics.height / 2 + 48 * index
 *
 * @param Center Position X
 * @desc Formula for where units are placed in the middle of the battlefield
 * @default  Graphics.width / 2
 * 
 * @param Center Position Y
 * @desc Formula for where units are placed in the middle of the battlefield 
 * @default  Graphics.height / 2
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
 * Instructions:
 * If srpgAreaRange tag is present in a skill and 'Enable By Default' plugin parameter is set to true, all AoE attacks will have AoEAnimation
 * If not, then add <AoEAnimation> tag to skills where you want multiple targets to appear on one battle scene
 * Make sure skill is set to ALL enemies or ALL Allies
 *
 * Default positions of actors and enemies:
 * Index references the order of which units are displayed. The active target and active user have index values of 0
 * For an AoE Attack, index will be assigned based on the nearest target to the center of the AoE. So the furthest target will have the largest index value
 * By default, targets are staggered along the X and Y axis in a diagonal fashion and positioned in order as specified below:
 * Example 1: [Enemy 3] [Enemy 2] [Enemy 1] [Enemy 0]                                       [User]
 * Example 2:                                                             [Ally 1] [Ally 2] [User]
 * This means the user is always behind allies (eg. using a buff) and the "active enemy" is always the closest to the user
 *
 * Starting formations:
 * If a skill has AoEAnimation and <AoELineFormation>, then all targets will have the same Y coordinate (assumes index = 0 for all units) and thus line up in a straight line
 * If a skill has AoEAnimation and <AoEDistantFormation:X>, then all targets will have their home X position altered by X
 * If a skill has AoEAnimation and <AoESurroundFormation:X>, then all targets will be placed around the user with a radius of X
 
 */
(function () {
    //=================================================================================================
    //Plugin Parameters
    //=================================================================================================
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);
    //=================================================================================================
    //Set actor positions
    //=================================================================================================
    var _SRPG_YEP_Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function (index) {
        if ($gameSystem.isSRPGMode() == true) {
            var xModifier = 0;
            if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoEDistantFormation) {
                if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].isActor()) {
                    xModifier = $gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoEDistantFormation;
                } else {
                    xModifier = -$gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoEDistantFormation;
                }
            }
            if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoELineFormation) { //Line formation (set y = 0)
                this.setHome(eval(parameters['Actor Position X']) + xModifier, eval(parameters['Actor Position Y'].replace("index", "0")));
            } else if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoESurroundFormation) { //Surround formation (place units in a circle/ellipse formation)
                //Check if AreaTargets (more than 1 target) is present
                if ($gameTemp._areaTargets.length > 0) {
                    //Check if user is also the target
                    if ($gameTemp.activeEvent() == $gameTemp.targetEvent()) {
                        if (index == 0) {
                            this.setHome(eval(parameters['Center Position X']) + xModifier, eval(parameters['Center Position Y']));
                        } else { //Allied team surround user 
                            var radius = $gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoESurroundFormation;
                            var angleIncrement = 360 / ($gameTemp._areaTargets.length + 0)
                            this.setHome(eval(parameters['Center Position X']) + xModifier + Math.round(radius * Math.sin(Math.PI * 2 * angleIncrement * (index + 0.5) / 360)), eval(parameters['Center Position Y']) + Math.round(radius * Math.cos(Math.PI * 2 * angleIncrement * (index + 0.5) / 360)));
                        }
                    } else {
                        //User is not the target, check if user is to be surrounded by foes or allies 
                        if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].isActor()) {
                            //If an actor is the user, then set index 0 to be in the middle
                            if (index == 0) {
                                this.setHome(eval(parameters['Center Position X']) + xModifier, eval(parameters['Center Position Y']));
                            } else { //Allied team surround user 
                                var radius = $gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoESurroundFormation;
                                var angleIncrement = 360 / ($gameTemp._areaTargets.length + 0)
                                this.setHome(eval(parameters['Center Position X']) + xModifier + Math.round(radius * Math.sin(Math.PI * 2 * angleIncrement * (index + 0.5) / 360)), eval(parameters['Center Position Y']) + Math.round(radius * Math.cos(Math.PI * 2 * angleIncrement * (index + 0.5) / 360)));
                            }
                        } else {
                            //If actor is not the user, then actors are surrounding an enemy user
                            var radius = $gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoESurroundFormation;
                            var angleIncrement = 360 / ($gameTemp._areaTargets.length + 1)
                            this.setHome(eval(parameters['Center Position X']) + xModifier + Math.round(radius * Math.sin(Math.PI * 2 * angleIncrement * (index + 0.5) / 360)), eval(parameters['Center Position Y']) + Math.round(radius * Math.cos(Math.PI * 2 * angleIncrement * (index + 0.5) / 360)));
                        }
                    }
                } else { //Only 1 target (or none), set actor position as normal 
                    this.setHome(eval(parameters['Actor Position X']) + xModifier, eval(parameters['Actor Position Y']));
                }
            } else {
                //Standard formation
                this.setHome(eval(parameters['Actor Position X']) + xModifier, eval(parameters['Actor Position Y']));
            }
            this.moveToStartPosition();
        } else {
            _SRPG_YEP_Sprite_Actor_setActorHome.call(this, index);
        }
    };
    //=================================================================================================
    //Set enemy positions
    //=================================================================================================
    var _SRPG_Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function (troopId) {
        if ($gameSystem.isSRPGMode() == true) {
            this.clear();
            this._troopId = troopId;
            this._enemies = [];
            for (var i = 0; i < this.SrpgBattleEnemys().length; i++) {
                var enemy = this.SrpgBattleEnemys()[i];
                var index = i;
                var xModifier = 0;
                if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoEDistantFormation) {
                    if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].isActor()) {
                        xModifier = -$gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoEDistantFormation;
                    } else {
                        xModifier = $gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoEDistantFormation;
                    }
                }
                if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoELineFormation) { //Line formation (set y = 0)
                    enemy._screenX = eval(parameters['Enemy Position X']); + xModifier;
                    enemy._screenY = eval(parameters['Enemy Position Y'].replace("index", "0"));
                } else if ($gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoESurroundFormation) { //Surround formation (place units in a circle/ellipse formation)
                    //Check if AreaTargets (more than 1 target) is present
                    if ($gameTemp._areaTargets.length > 0) {
                        //Check if user is the target
                        if ($gameTemp.activeEvent() == $gameTemp.targetEvent()) {
                            if (index == 0) {
                                enemy._screenX = eval(parameters['Center Position X']) + xModifier;
                                enemy._screenY = eval(parameters['Center Position Y']);
                            } else { //Allied team surround user 
                                var radius = $gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoESurroundFormation;
                                var angleIncrement = 360 / ($gameTemp._areaTargets.length + 0)
                                enemy._screenX = eval(parameters['Center Position X']) + xModifier + Math.round(radius * Math.sin(Math.PI * 2 * angleIncrement * (index + 0.5) / 360));
                                enemy._screenY = eval(parameters['Center Position Y']) + Math.round(radius * Math.cos(Math.PI * 2 * angleIncrement * (index + 0.5) / 360));
                            }
                        } else {
                            //Check if user is actor or enemy 
                            if (!$gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].isActor()) {
                                //If an enemy is the user, then set index 0 to be in the middle
                                if (index == 0) {
                                    enemy._screenX = eval(parameters['Center Position X']) + xModifier;
                                    enemy._screenY = eval(parameters['Center Position Y']);
                                } else { //Allied team surround user 
                                    var radius = $gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoESurroundFormation;
                                    var angleIncrement = 360 / ($gameTemp._areaTargets.length + 0)
                                    enemy._screenX = eval(parameters['Center Position X']) + xModifier + Math.round(radius * Math.sin(Math.PI * 2 * angleIncrement * (index + 0.5) / 360));
                                    enemy._screenY = eval(parameters['Center Position Y']) + Math.round(radius * Math.cos(Math.PI * 2 * angleIncrement * (index + 0.5) / 360));
                                }
                            } else {
                                //If user is not part of the enemy team so set all enemies to surround the user
                                var radius = $gameSystem.EventToUnit($gameTemp.activeEvent()._eventId)[1].currentAction().item().meta.AoESurroundFormation;
                                var angleIncrement = 360 / ($gameTemp._areaTargets.length + 1)
                                enemy._screenX = eval(parameters['Center Position X']) + xModifier + Math.round(radius * Math.sin(Math.PI * 2 * angleIncrement * (index + 0.5) / 360));
                                enemy._screenY = eval(parameters['Center Position Y']) + Math.round(radius * Math.cos(Math.PI * 2 * angleIncrement * (index + 0.5) / 360));
                            }
                        }
                    } else { //Only 1 target (or none), set actor position as normal 
                        enemy._screenX = eval(parameters['Enemy Position X']); + xModifier;
                        enemy._screenY = eval(parameters['Enemy Position Y']);
                    }
                } else {
                    //Standard formation
                    enemy._screenX = eval(parameters['Enemy Position X']); + xModifier;
                    enemy._screenY = eval(parameters['Enemy Position Y']);
                }
                this._enemies.push(enemy);
            }
            this.makeUniqueNames();
        } else {
            _SRPG_Game_Troop_setup.call(this, troopId);
        }
    };
    //=================================================================================================
    //Create a temporary variable that checks if an AoEAnimation is present or not (used to fix a bug)
    //=================================================================================================
    var _SRPG_Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function () {
        _SRPG_Game_Temp_initialize.call(this);
        this._aoeEffect = false;
    }
    //=================================================================================================
    //Bug fix for map battle 
    //=================================================================================================
    //This fixes the glitch where if mapBattle is ON but a skill with the tag <mapBattle:false> is set, the battle result screen appears prior to the action being executed
    //This results in the user gaining exp twice (if user = player), once prior to skill and once after the skill
    //This glitch happens as by default, the srpg_core.js script checks if map battle is on via $gameSystem.useMapBattle() but this function does not check if a skill has the <mapBattle:false> tag on or not
    //This new function fixes this problem by using the $gameTemp._aoeEffect which is set when an AoE attack with single AoE animation occurs
    //If the developer creates a skill where <mapBattle:false> and the skill is not a single AoE animation, then this glitch will still occur 
    var _USEMAPBATTLE = Game_System.prototype.useMapBattle;
    Game_System.prototype.useMapBattle = function () {
        if ($gameTemp._aoeEffect) {
            return false;
        } else {
            return _USEMAPBATTLE.call(this);
        }
    };
    //=================================================================================================
    //Rewrite of srpgBattleStart (which is created by srpg_core.js and re-alised by mapBattle
    //=================================================================================================
    Scene_Map.prototype.srpgBattleStart = function (actionArray, targetArray) {
        //Check if use regular AoE animation or not
        if (actionArray[1].currentAction().item().meta.AoEAnimation === true || (actionArray[1].currentAction().item().meta.srpgAreaRange >= 0 && eval(parameters['Enable By Default']))) {
            $gameTemp._aoeEffect = true;
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
                    if (!userIsAdded) {
                        $gameParty.pushSrpgBattleActors(targetArray[1]); //Add friendly ally to player team
                    }
                    //Set the action of the 'active unit' to be the ally
                    actionArray[1].action(0).setTarget(1);
                } else if (targetArray[0] === 'enemy') {
                    targetTeam = "foes";
                    $gameTroop.pushSrpgBattleEnemys(targetArray[1]); // Add enemy to enemy team 
                    actionArray[1].action(0).setTarget(0);
                }
                //If the 'active unit' is an enemy, add them to the battle as the 'active unit'
            } else if (actionArray[0] === 'enemy') {
                actionArray[1].action(0).setSrpgEnemySubject(0);
                if (targetArray[0] === 'actor') {
                    targetTeam = "foes";
                    $gameParty.pushSrpgBattleActors(targetArray[1]); //Add opposing player unit to player team
                    actionArray[1].action(0).setTarget(0);
                } else if (targetArray[0] === 'enemy') {
                    targetTeam = "allies";
                    if (!userIsAdded) {
                        $gameTroop.pushSrpgBattleEnemys(targetArray[1]); //Add allied enemy to enemy team
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
            if ($dataTroops[PluginManager.parameters('SRPG_core')._srpgTroopID]) {
                BattleManager.setup(PluginManager.parameters('SRPG_core')._srpgTroopID, false, true);
            } else {
                BattleManager.setup(1, false, true);
            }
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
            var addActionNum = Number(actionArray[1].action(0).item().meta.addActionTimes);
            if (addActionNum && addActionNum > 0) {
                actionArray[1].SRPGActionTimesAdd(addActionNum);
            }
            // pre-skill setup
            $gameSystem.clearSrpgStatusWindowNeedRefresh();
            $gameSystem.clearSrpgBattleWindowNeedRefresh();
            this._srpgBattleResultWindowCount = 0;
            // Call the battle 
            this._callSrpgBattle = true;
            this.eventBeforeBattle();
        } else {
            //=================================================================================================
            //Not an AOE effect / the following code is copied from srpg_core.js (regular battle + mapBattle)
            //=================================================================================================
            $gameTemp._aoeEffect = false;
            // get the data
            var user = actionArray[1];
            var target = targetArray[1];
            var action = user.action(0);
            var reaction = null;
            // check if we're using map battle on this skill
            if (action && action.item()) {
                var mapBattleTag = action.item().meta.mapBattle;
                if (mapBattleTag == 'true') $gameSystem.forceSRPGBattleMode('map');
                else if (mapBattleTag == 'false') $gameSystem.forceSRPGBattleMode('normal');
            }
            //=================================================================================================
            //Regular SRPG Battle
            //=================================================================================================
            if (!$gameSystem.useMapBattle()) {
                $gameParty.clearSrpgBattleActors();
                $gameTroop.clearSrpgBattleEnemys();
                if (actionArray[0] === 'actor') {
                    $gameParty.pushSrpgBattleActors(actionArray[1]);
                    if (targetArray[0] === 'actor') {
                        if (actionArray[1] != targetArray[1]) {
                            $gameParty.pushSrpgBattleActors(targetArray[1]);
                            actionArray[1].action(0).setTarget(1);
                        } else {
                            actionArray[1].action(0).setTarget(0);
                        }
                    } else if (targetArray[0] === 'enemy') {
                        $gameTroop.pushSrpgBattleEnemys(targetArray[1]);
                        actionArray[1].action(0).setTarget(0);
                    }
                } else if (actionArray[0] === 'enemy') {
                    $gameTroop.pushSrpgBattleEnemys(actionArray[1]);
                    actionArray[1].action(0).setSrpgEnemySubject(0);
                    if (targetArray[0] === 'actor') {
                        $gameParty.pushSrpgBattleActors(targetArray[1]);
                        actionArray[1].action(0).setTarget(0);
                    } else if (targetArray[0] === 'enemy') {
                        if (actionArray[1] != targetArray[1]) {
                            $gameTroop.pushSrpgBattleEnemys(targetArray[1]);
                            actionArray[1].action(0).setTarget(1);
                        } else {
                            actionArray[1].action(0).setTarget(0);
                        }
                    }
                }
                actionArray[1].setActionTiming(0);
                if ($dataTroops[PluginManager.parameters('SRPG_core')._srpgTroopID]) {
                    BattleManager.setup(PluginManager.parameters('SRPG_core')._srpgTroopID, false, true);
                } else {
                    BattleManager.setup(1, false, true);
                }
                //対象の行動を設定
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
                if (PluginManager.parameters('SRPG_DirectionSelection')['After Battle Direction Selection'] || PluginManager.parameters('Boomy_DirectionSelection')['After Battle Direction Selection']) {
                    //this.preBattleSetDirection(); //EDIT (Compatability with direction Selection BOOMY)
                } else {
                    this.preBattleSetDirection();
                }
                //行動回数追加スキルなら行動回数を追加する
                var addActionNum = Number(actionArray[1].action(0).item().meta.addActionTimes);
                if (addActionNum && addActionNum > 0) {
                    actionArray[1].SRPGActionTimesAdd(addActionNum);
                }
                this._callSrpgBattle = true;
                this.eventBeforeBattle();
            } else {
                //=================================================================================================
                // MapBattle
                //=================================================================================================
                // prepare action timing
                user.setActionTiming(0);
                if (user != target) target.setActionTiming(1);
                // pre-skill setup
                $gameSystem.clearSrpgStatusWindowNeedRefresh();
                $gameSystem.clearSrpgBattleWindowNeedRefresh();
                this._srpgBattleResultWindowCount = 0;
                // make free actions work
                var addActionTimes = Number(action.item().meta.addActionTimes || 0);
                if (addActionTimes > 0) {
                    user.SRPGActionTimesAdd(addActionTimes);
                }
                //this.preBattleSetDirection();
                this.eventBeforeBattle();
                // set up the troop and the battle party
                $gameTroop.clearSrpgBattleEnemys();
                $gameTroop.clear();
                $gameParty.clearSrpgBattleActors();
                if (actionArray[0] === 'enemy') $gameTroop.pushSrpgBattleEnemys(user);
                else $gameParty.pushSrpgBattleActors(user);
                if (targetArray[0] === 'enemy') $gameTroop.pushSrpgBattleEnemys(target);
                else $gameParty.pushSrpgBattleActors(target);
                BattleManager.setup(PluginManager.parameters('SRPG_core')._srpgTroopID, false, true);
                action.setSubject(user);
                // queue the action
                this.srpgAddMapSkill(action, user, target);
                // queue up counterattack
                if (actionArray[0] !== targetArray[0] && target.canMove() && !action.item().meta.srpgUncounterable) {
                    target.srpgMakeNewActions();
                    reaction = target.action(0);
                    reaction.setSubject(target);
                    reaction.setAttack();
                    var actFirst = (reaction.speed() > action.speed());
                    if (PluginManager.parameters('SRPG_core').srpgUseAgiAttackPlus == 'true') actFirst = false;
                    this.srpgAddMapSkill(reaction, target, user, actFirst);
                }
                // agi attack plus
                if (PluginManager.parameters('SRPG_core').srpgUseAgiAttackPlus == 'true') {
                    if (user.agi >= target.agi) {
                        var firstBattler = user;
                        var secondBattler = target;
                    } else {
                        var firstBattler = target;
                        var secondBattler = user;
                    }
                    if (!firstBattler.currentAction() || !firstBattler.currentAction().item()) {
                        return;
                    }
                    if (firstBattler.currentAction().isForOpponent() && !firstBattler.currentAction().item().meta.doubleAction) {
                        var dif = firstBattler.agi - secondBattler.agi;
                        var difMax = secondBattler.agi * _srpgAgilityAffectsRatio - secondBattler.agi;
                        if (difMax == 0) {
                            agilityRate = 100;
                        } else {
                            agilityRate = dif / difMax * 100;
                        }
                        if (agilityRate > Math.randomInt(100)) {
                            var agiAction = firstBattler.action(0);
                            this.srpgAddMapSkill(agiAction, firstBattler, secondBattler)
                        }
                    }
                }
            }
        }
    };
    //=================================================================================================
    //Kill units that were affected by AreaTargets
    //=================================================================================================
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
        if ($gameTemp._aoeEffect == true) {
            $gameTemp.clearAreaTargets();
            $gameTemp._aoeEffect = false;
        }
    };
    //=================================================================================================
    //SRPG Battle window 
    //=================================================================================================
/*
    Scene_Battle.prototype.createSprgBattleStatusWindow = function () {
        this._srpgBattleStatusWindowLeft = new Window_SrpgBattleStatus(0);
        this._srpgBattleStatusWindowRight = new Window_SrpgBattleStatus(1);
        this._srpgBattleStatusWindowLeft.openness = 0;
        this._srpgBattleStatusWindowRight.openness = 0;
        //Boomy edit for AoE display 
        if ($gameParty.battleMembers().length == 1 && $gameTroop.members().length == 0) {
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        } else if ($gameParty.battleMembers().length == 0 && $gameTroop.members().length == 1) {
            this._srpgBattleStatusWindowRight.setBattler($gameTroop.members()[0]);
        } else if ($gameParty.battleMembers().length == 1 && $gameTroop.members().length == 1) {
            this._srpgBattleStatusWindowLeft.setBattler($gameTroop.members()[0]);
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        } else if ($gameParty.battleMembers().length == 2 && $gameTroop.members().length == 0) {
            this._srpgBattleStatusWindowLeft.setBattler($gameParty.battleMembers()[1]);
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        } else if ($gameParty.battleMembers().length == 0 && $gameTroop.members().length == 2) {
            this._srpgBattleStatusWindowRight.setBattler($gameTroop.members()[0]);
            this._srpgBattleStatusWindowLeft.setBattler($gameTroop.members()[1]);
        } else if ($gameParty.battleMembers().length > 2) {
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        } else if ($gameTroop.members().length > 2) {
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
        }
        this.addWindow(this._srpgBattleStatusWindowLeft);
        this.addWindow(this._srpgBattleStatusWindowRight);
        BattleManager.setSrpgBattleStatusWindow(this._srpgBattleStatusWindowLeft, this._srpgBattleStatusWindowRight);
    };
	*/
})()
