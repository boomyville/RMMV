//=============================================================================
// SRPGWindow.js
//=============================================================================
/*:
 * @plugindesc Allows for customization of SRPG Windows. Requires SRPGcore.js
 * @author Boomy 
 * 
 * @param Battle Result
 * @desc Enable battle result after an SRPG battle 
 * @default true 
 *
* @param Battle Result X
 * @parent Battle Result
 * @desc X location of Battle Result window 
 * @default (Graphics.boxWidth - this.windowWidth()) / 2
 *
* @param Battle Result Y
 * @parent Battle Result
 * @desc Y location of Battle Result window 
 * @default Graphics.boxHeight / 2 - this.windowHeight()
  *
* @param Battle Result Width
 * @parent Battle Result
 * @desc Width of Battle Result window 
 * @default this.windowWidth()
  *
* @param Battle Result Height 
 * @parent Battle Result
 * @desc Height of Battle Result window 
 * @default this.windowHeight()
 *
 * @param Quick Status 
 * @desc Enable a quick preview of units when selected 
 * @default true 
  *
* @param SRPG Status Enable
 * @parent Quick Status 
 * @desc If true, SRPG status for enemies when selected on map will be shown outside of prediction window 
 * @default true 
 *
 * @param Hide Quick Status With Message
  * @parent Quick Status 
 * @desc Hides the quick status window when a Game_Message window is active 
 * @default true 
  *
 * @param Quick Status Hover 
 * @parent Quick Status 
 * @desc If set to true, quick status is shown over selected unit instead of a set X/Y
 * @default true 
 *
 * @param Quick Status X
 * @parent Quick Status 
 * @desc X location of Quick Status window 
 * @default Graphics.boxWidth - this._mapSrpgActorCommandStatusWindow.windowWidth();
 *
* @param Quick Status Y
 * @parent Quick Status 
 * @desc Y location of Quick Status window 
 * @default Graphics.boxHeight - this._mapSrpgActorCommandStatusWindow.windowHeight();
  *
  * @param Quick Status Opacity
 * @parent Quick Status 
 * @desc Window Opacity of Quick Status window 
 * @default 128
  *
* @param Quick Status Width
 * @parent Quick Status 
 * @desc Width of Quick Status window. Default: Graphics.boxWidth - 240
 * @default 320
  *
* @param Quick Status Height 
 * @parent Quick Status 
 * @desc Height of Quick Status window. Default: this.fittingHeight(3)
 * @default this.fittingHeight(4)
 *
 * @param Quick Status Contents Lunatic Code  
 * @parent Quick Status 
 * @desc Lunatic code that is used to fill the contents of the quick status window 
 * @default false  
 *
  * @param Prediction Window
 * @desc Enable prediction window
 * @default true 
  *
 * @param Prediction Window X
 * @parent Prediction Window 
 * @desc X location of Prediction Window
 * @default 0
 *
* @param Prediction Window Y
 * @parent Prediction Window 
 * @desc Y location of Prediction Window 
 * @default 24
  *
  * @param Prediction Window Opacity
 * @parent Prediction Window
 * @desc Window Opacity of Prediction Window  
 * @default 128
  *
* @param Prediction Window Width
 * @parent Prediction Window 
 * @desc Width of Prediction Window. Default: Graphics.boxWidth
 * @default Graphics.boxWidth
  *
* @param Prediction Window Height 
 * @parent Prediction Window
 * @desc Height of Prediction Window. Default: this.fittingHeight(3)
 * @default this.fittingHeight(4)
 *
 * @param Prediction Window Contents Lunatic Code  	
 * @parent Prediction Window
 * @desc Lunatic code that is used to fill the contents of the Prediction Window 
 * @default false  
  *
 * @param Prediction Window No Action
 * @parent Prediction Window
 * @desc Text to be displayed when no action occurs
 * @default ----------------------------------
  *
  * @param Battle Confirm Window X
 * @parent Prediction Window
 * @desc X position of the confirm battle window 
 * @default (Graphics.boxWidth - 240) / 2
 *
  * @param Battle Confirm Window Y
 * @parent Prediction Window
 * @desc Y position of the confirm battle window 
 * @default Graphics.boxHeight - 80
 *
  * @param Battle Confirm Window Width 
 * @parent Prediction Window
 * @desc Width of the confirm battle window 
 * @default 240
 *
  * @param Battle Confirm Window Rows
 * @parent Prediction Window
 * @desc Height of the confirm battle window 
 * @default 2
 *
 * This plugin adds a whole bunch of parameters that can be modified to change the appearance of SRPG windows
 * The windows that can be edited:
 * Actor Status Window (the window that appears when an actor is selected)
 * Unit Status Window (the window that appears when the battle prediction window is displayed)
 * Prediction Window
 * Battle HUD
 *
 * This script adds a few changes to windows:
 * The enemy now gets the same status window as the actor (previously it used the same unit status window that is used for battle prediction)
 *
 * Some useful examples and tips:
 * Position X Parameter changes to right position or left position depending on where on the canvas the highlighted unit is:
 * var highlightedTarget; if ($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY()).length > 0) { for (var i = 0; i < $gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY()).length; i++) { if (!$gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].isErased()) { if ($gameSystem.EventToUnit($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].eventId())) { highlightedTarget = $gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i]; break; } } } } if (highlightedTarget) { (highlightedTarget.screenX() > Graphics.boxWidth - this._mapSrpgActorCommandStatusWindow.windowWidth()) ? 0 : Graphics.boxWidth - this._mapSrpgActorCommandStatusWindow.windowWidth(); } else { Graphics.boxWidth - this._mapSrpgActorCommandStatusWindow.windowWidth(); }
 *
 * Change contents lunatic code on the fly in developer console:
 * PluginManager.parameters("SRPGWindow")["Quick Status Contents Lunatic Code"] = "newCode";
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
    //============================================================================================================================================
    // Quick  Status
    //============================================================================================================================================
    //Function overwrite: When battle ends, set the position of the battle result window 
    Window_SrpgBattleResult.prototype.initialize = function (battler) {
        //var width = this.windowWidth();
        //var height = this.windowHeight();
        //var x = (Graphics.boxWidth - width) / 2;
        //var y = Graphics.boxHeight / 2 - height;
        var width = eval(parameters['Battle Result Width']);
        var height = eval(parameters['Battle Result Height']);
        var x = eval(parameters['Battle Result X']);
        var y = eval(parameters['Battle Result Y']);
        this.setBattler(battler);
        this._rewards = null;
        this._changeExp = 0;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
    //Function overwrite: Redefine how we create 'quick status' window
    Scene_Map.prototype.createSrpgActorCommandStatusWindow = function () {
        this._mapSrpgActorCommandStatusWindow = new Window_SrpgActorCommandStatus(0, 0);
        this._mapSrpgActorCommandStatusWindow.x = eval(parameters['Quick Status X']);
        this._mapSrpgActorCommandStatusWindow.y = eval(parameters['Quick Status Y']);
        this._mapSrpgActorCommandStatusWindow.openness = 0;
        this.addWindow(this._mapSrpgActorCommandStatusWindow);
        this._mapSrpgActorCommandStatusWindow.opacity = 128;
    };
    //Overwritten function #Boomy
    Window_SrpgActorCommandStatus.prototype.windowWidth = function () {
        if (parameters['Quick Status Width']) {
            return eval(parameters['Quick Status Width']);
        } else {
            return Graphics.boxWidth - 240;
        }
    };
    //Overwritten function #Boomy
    Window_SrpgActorCommandStatus.prototype.windowHeight = function () {
        if (parameters['Quick Status Height']) {
            return eval(parameters['Quick Status Height']);
        } else {
            return this.fittingHeight(3);
        }
    };
    //Overwritten Function #Boomy
    Window_SrpgActorCommandStatus.prototype.drawContents = function () {
        if (parameters['Quick Status Opacity']) {
            this.opacity = eval(parameters['Quick Status Opacity']);
        }
        if (parameters['Quick Status Contents Lunatic Code'] == "false") {

var mirror = false;
if (this.x == 0) {
    mirror = true;
}
var align = mirror ? 'left' : 'right';
var y_adjust = 20;
this.drawText(this._battler.name(), 0, 0, this.width - this.padding * 2, align);
this.drawActorIconsEx(this._battler, 0, this.lineHeight() - 4, this.width - this.padding * 2, align);
this.drawGauge(0, this.lineHeight() + y_adjust, Math.floor((this.width - this.padding * 2) / 3 - 4), this._battler.hpRate(), this.hpGaugeColor1(), this.hpGaugeColor2());
this.drawGauge(Math.floor((this.width - this.padding * 2) / 3), this.lineHeight() + y_adjust, Math.floor((this.width - this.padding * 2) / 3 - 4), this._battler.mpRate(), this.mpGaugeColor1(), this.mpGaugeColor2());
this.drawGauge((Math.floor((this.width - this.padding * 2) / 3) + 0) * 2, this.lineHeight() + y_adjust, Math.floor((this.width - this.padding * 2) / 3 - 4), this._battler.tpRate(), this.tpGaugeColor1(), this.tpGaugeColor2());
this.drawText(this._battler.hp + '/' + this._battler.mhp, 0, this.lineHeight() + y_adjust, Math.floor((this.width - this.padding * 2) / 3 - 4), align);
this.drawText(this._battler.mp + '/' + this._battler.mmp, Math.floor((this.width - this.padding * 2) / 3), this.lineHeight() + y_adjust, Math.floor((this.width - this.padding * 2) / 3 - 4), align);
this.drawText(this._battler.tp + '/' + this._battler.maxTp(), Math.floor((this.width - this.padding * 2) / 3) * 2, this.lineHeight() + y_adjust, Math.floor((this.width - this.padding * 2) / 3 - 4), align);
this.drawIcon(77, 0, Math.round(this.lineHeight() * 2.6) + 4);
this.drawText(this._battler.atk, 0 + 0.1 * Math.floor((this.width - this.padding * 2) / 3), this.lineHeight() * 2.6 - 8, Window_Base._iconWidth, 'center');
this.drawIcon(81, 4 + Math.round(0.5 * Math.floor((this.width - this.padding * 2) / 3)), Math.round(this.lineHeight() * 2.6) + 4);
this.drawText(this._battler.def, 4 + 0.6 * Math.floor((this.width - this.padding * 2) / 3), this.lineHeight() * 2.6 - 8, Window_Base._iconWidth, 'center');
this.drawIcon(70, 8 + Math.round(1 * Math.floor((this.width - this.padding * 2) / 3)), Math.round(this.lineHeight() * 2.6) + 4);
this.drawText(this._battler.mat, 8 + 1.1 * Math.floor((this.width - this.padding * 2) / 3), this.lineHeight() * 2.6 - 8, Window_Base._iconWidth, 'center');
this.drawIcon(302, 12 + Math.round(1.5 * Math.floor((this.width - this.padding * 2) / 3)), Math.round(this.lineHeight() * 2.6) + 4);
this.drawText(this._battler.mdf, 12 + 1.6 * Math.floor((this.width - this.padding * 2) / 3), this.lineHeight() * 2.6 - 8, Window_Base._iconWidth, 'center');
this.drawIcon(82, 16 + Math.round(2 * Math.floor((this.width - this.padding * 2) / 3)), Math.round(this.lineHeight() * 2.6) + 4);
this.drawText(this._battler.srpgMove(), 16 + 2.1 * Math.floor((this.width - this.padding * 2) / 3), this.lineHeight() * 2.6 - 8, Window_Base._iconWidth, 'center');
this.drawIcon(88, 20 + Math.round(2.5 * Math.floor((this.width - this.padding * 2) / 3)), Math.round(this.lineHeight() * 2.6) + 4);
this.drawText(this._battler.level, 20 + 2.6 * Math.floor((this.width - this.padding * 2) / 3), this.lineHeight() * 2.6 - 8, Window_Base._iconWidth, 'center');
} else {
    eval(parameters['Quick Status Contents Lunatic Code']);
}
};
    //============================================================================================================================================
    // Regular  Status
    //============================================================================================================================================
    //Disable Status showing up 
    Window_SrpgStatus.prototype.open = function () {
        if (!this.isOpen()) {
            if($gameSystem.isSubBattlePhase() == 'battle_window' && eval(parameters['SRPG Status Enable'])) {
				this._opening = false;
			} else if (!eval(parameters['SRPG Status Enable'])) {
				this._opening = false;
			} else {
				this._opening = true;
			}
        }
        this._closing = false;
    };
    //============================================================================================================================================
    // Prediction Window
    //============================================================================================================================================
	
	Scene_Map.prototype.createSrpgPredictionWindow = function() {
        this._mapSrpgPredictionWindow = new Window_SrpgPrediction(0, 0);
		this._mapSrpgPredictionWindow.x = eval(parameters['Prediction Window X']);
        this._mapSrpgPredictionWindow.y = eval(parameters['Prediction Window Y']);
        this._mapSrpgPredictionWindow.openness = 0;
        this.addWindow(this._mapSrpgPredictionWindow);
		
    };
	
    Window_SrpgPrediction.prototype.windowWidth = function () {
        return eval(parameters['Prediction Window Width']);
    };
    Window_SrpgPrediction.prototype.windowHeight = function () {
        return eval(parameters['Prediction Window Height']);
    };
    Window_SrpgPrediction.prototype.drawContents = function () {
        if (parameters['Prediction Window Opacity']) {
            this.opacity = eval(parameters['Prediction Window Opacity']);
        }
        if (parameters['Prediction Window Contents Lunatic Code'] == "false") {
            var windowWidth = this.windowWidth();
            var lineHeight = this.lineHeight();
            var x = 40;
            // 攻撃側
            var actor = this._actionArray[1];
            var target = this._targetArray[1];
            var action = actor.currentAction();
            var damage = action.srpgPredictionDamage(target);
            var hit = action.itemHit(target);
            var eva = action.itemEva(target);
            this.drawSrpgBattleActionName(actor, action, windowWidth / 2 + x, lineHeight * 0, true);
            this.drawSrpgBattleHit(hit, eva, windowWidth / 2 + x, lineHeight * 1);
            this.drawSrpgBattleDistance(actor, action, windowWidth / 2 + 160 + x, lineHeight * 1);
            this.drawSrpgBattleDamage(damage, windowWidth / 2 + x, lineHeight * 2);
			this.drawGauge(x +  windowWidth / 2, lineHeight * 3, windowWidth / 2 - 48, actor.hpRate(), this.hpGaugeColor1(), this.hpGaugeColor2());
			this.drawText(actor.name() + " HP: " + actor.hp + "/" + actor.mhp, windowWidth / 2 + x, lineHeight * 3);
			
            // 迎撃側
            var actor = this._targetArray[1];
            var target = this._actionArray[1];
            var action = actor.currentAction();
			if(actor != target) {
            this.drawGauge(x, lineHeight * 3,  windowWidth / 2 - 48, actor.hpRate(), this.hpGaugeColor1(), this.hpGaugeColor2());
			this.drawText(actor.name() + " HP: " + actor.hp + "/" + actor.mhp, x, lineHeight * 3);
			}
			if (!this._targetArray[1].canUse(action.item())) {
                action = null;
            }
            if (!action || actor == target) {
                this.drawSrpgBattleActionName(actor, action, x, lineHeight * 0, false);
                return;
            }
            var damage = action.srpgPredictionDamage(target);
            var hit = action.itemHit(target);
            var eva = action.itemEva(target);
            this.drawSrpgBattleActionName(actor, action, x, lineHeight * 0, true);
            this.drawSrpgBattleHit(hit, eva, x, lineHeight * 1);
            this.drawSrpgBattleDistance(actor, action, 160 + x, lineHeight * 1);
            this.drawSrpgBattleDamage(damage, x, lineHeight * 2);
			
            this._targetArray[1].clearActions();
        } else {
            eval(parameters['Prediction Window Contents Lunatic Code']);
        }
    };

	var _Window_SrpgPrediction_close = Window_SrpgPrediction.prototype.close;
	Window_SrpgPrediction.prototype.close = function () {
        if (this._bust) {
            this._bust.visible = false;
        }
        if (this._bust2) {
            this._bust2.visible = false;
        }
        if (this._background) {
            this._background.visible = false;
        }
        if (this._background2) {
            this._background2.visible = false;
        }	
        if (this._background3) {
            this._background3.visible = false;
        }
        _Window_SrpgPrediction_close.call(this);
    };
	
    Window_SrpgBattle.prototype.windowWidth = function () {
        return eval(parameters['Battle Confirm Window Width']);
    };
    Window_SrpgBattle.prototype.maxCols = function () {
        return eval(parameters['Battle Confirm Window Rows']);
    };
    var _Window_SrpgBattle_close = Window_SrpgBattle.prototype.close;
    Window_SrpgBattle.prototype.close = function () {
        if (this._bust) {
            this._bust.visible = false;
        }
        if (this._bust2) {
            this._bust2.visible = false;
        }
        if (this._background) {
            this._background.visible = false;
        }
        if (this._background2) {
            this._background2.visible = false;
        }	
        if (this._background3) {
            this._background3.visible = false;
        }
        _Window_SrpgBattle_close.call(this);
    }
    Scene_Map.prototype.createSrpgBattleWindow = function () {
        this._mapSrpgBattleWindow = new Window_SrpgBattle();
        this._mapSrpgBattleWindow.x = eval(parameters['Battle Confirm Window X']);
        this._mapSrpgBattleWindow.y = eval(parameters['Battle Confirm Window Y']);
        this._mapSrpgBattleWindow.setHandler('battleStart', this.commandBattleStart.bind(this));
        this._mapSrpgBattleWindow.setHandler('cancel', this.selectPreviousSrpgBattleStart.bind(this));
        this.addWindow(this._mapSrpgBattleWindow);
    };
    //============================================================================================================================================
    // Map  Refresh
    //============================================================================================================================================
    //Function hook: Changes to how map refreshes to update position of quick status 
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
        //Set quick status window if game player is hovering over unit 
        if ($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY()).length > 0 && !$gamePlayer.isMoving()) {
            for (var i = 0; i < $gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY()).length; i++) {
                if (!$gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].isErased()) {
                    if ($gameSystem.EventToUnit($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].eventId())) {
                        if ($gameSystem.EventToUnit($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].eventId())[0] == "actor") {
                            if ($gameSystem.isSubBattlePhase() == 'normal' || $gameSystem.isSubBattlePhase() == 'exchange_position') {
                                this._mapSrpgActorCommandStatusWindow.setBattler($gameSystem.EventToUnit($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].eventId())[1]);
                            }
                        }
                    }
                }
            }
        }
        //Remove quick status window if cursor has moved 
        if ($gameSystem.isSubBattlePhase() !== 'normal') {
            if ($gameSystem.isSubBattlePhase() == 'actor_move' || $gameSystem.isSubBattlePhase() == 'exchange_position') {
                if ($gameTemp.activeEvent()) {
                    //If target cursor is  still on active unit, do not remove quick status 
                    if ($gamePlayer.posX() !== $gameTemp.activeEvent().posX() || $gamePlayer.posY() !== $gameTemp.activeEvent().posY()) {
                        this._mapSrpgActorCommandStatusWindow.clearBattler();
                    }
                } else {
                    this._mapSrpgActorCommandStatusWindow.clearBattler();
                }
            } else if ($gameSystem.isSubBattlePhase() == 'status_window') {
                if ($gameTemp.activeEvent()) {
                    if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[0] == "actor") {
                        this._mapSrpgActorCommandStatusWindow.setBattler($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1]);
                    }
                }
            } else {
                this._mapSrpgActorCommandStatusWindow.clearBattler();
            }
        }
		
		
        //Check highlighted target
        var highlightedTarget;
        if ($gameTemp.activeEvent()) {
            //Determine if cursor over active event or not 
            if ($gamePlayer.posX() == $gameTemp.activeEvent().posX() && $gamePlayer.posY() == $gameTemp.activeEvent().posY()) {
                highlightedTarget = $gameTemp.activeEvent();
            } else if ($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY()).length > 0) {
                for (var i = 0; i < $gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY()).length; i++) {
                    if (!$gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].isErased()) {
                        if ($gameSystem.EventToUnit($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].eventId())) {
                            highlightedTarget = $gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i];
                            break;
                        }
                    }
                }
            }
        } else {
            if ($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY()).length > 0) {
                for (var i = 0; i < $gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY()).length; i++) {
                    if (!$gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].isErased()) {
                        if ($gameSystem.EventToUnit($gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i].eventId())) {
                            highlightedTarget = $gameMap.eventsXy($gamePlayer.posX(), $gamePlayer.posY())[i];
                            break;
                        }
                    }
                }
            }
        }
        //Modify X/Y position if set to hover
        if (eval(parameters['Quick Status Hover']) == true) {
            if (highlightedTarget) {
                //If highlighted target is enemy, show quick status too (when in normal mode)
                if ($gameSystem.EventToUnit(highlightedTarget.eventId())[0] == "enemy" && ($gameSystem.isSubBattlePhase() == "normal" || $gameSystem.isSubBattlePhase() == "actor_move" || $gameSystem.isSubBattlePhase() == "status_window" || $gameSystem.isSubBattlePhase() == "actor_target")) {
                    this._mapSrpgActorCommandStatusWindow.setBattler($gameSystem.EventToUnit(highlightedTarget.eventId())[1]);
                }
                //If location of cursor is too far left, set X to 0; else if its too far right, set it to the justify to the right border. Otherwise set above unit
                if (highlightedTarget.screenX() - this._mapSrpgActorCommandStatusWindow.width * 0.5 < 0) {
                    this._mapSrpgActorCommandStatusWindow.x = 0;
                } else if (highlightedTarget.screenX() + this._mapSrpgActorCommandStatusWindow.width * 0.5 > Graphics.boxWidth) {
                    this._mapSrpgActorCommandStatusWindow.x = Graphics.boxWidth - this._mapSrpgActorCommandStatusWindow.width;
                } else {
                    this._mapSrpgActorCommandStatusWindow.x = highlightedTarget.screenX() - this._mapSrpgActorCommandStatusWindow.width * 0.5;
                }
                //If location of cursor is too high, then reposition window such that it displays above the unit
                if (highlightedTarget.screenY() - 48 - this._mapSrpgActorCommandStatusWindow.height < 0) {
                    this._mapSrpgActorCommandStatusWindow.y = highlightedTarget.screenY();
                } else {
                    this._mapSrpgActorCommandStatusWindow.y = highlightedTarget.screenY() - 48 - this._mapSrpgActorCommandStatusWindow.height;
                }
            }
        } else { //Not Hovering
            if (highlightedTarget) {
                //If highlighted target is enemy, show quick status too (when in normal mode)
                if ($gameSystem.EventToUnit(highlightedTarget.eventId())[0] == "enemy" && ($gameSystem.isSubBattlePhase() == "normal" || $gameSystem.isSubBattlePhase() == "actor_move" || $gameSystem.isSubBattlePhase() == "status_window" || $gameSystem.isSubBattlePhase() == "actor_target")) {
                    this._mapSrpgActorCommandStatusWindow.setBattler($gameSystem.EventToUnit(highlightedTarget.eventId())[1]);
                }
                this._mapSrpgActorCommandStatusWindow.x = eval(parameters['Quick Status X']);
                this._mapSrpgActorCommandStatusWindow.y = eval(parameters['Quick Status Y']);
            }
        }
		
				
		//Remove quick status window if gameMessage present
		if($gameMessage._texts.length > 0 && eval(parameters['Hide Quick Status With Message'])) {
			 this._mapSrpgActorCommandStatusWindow.clearBattler();
		}
		
    };
    //Remove sprites when quick status window is closed
    var _Window_SrpgActorCommandStatus_clear = Window_SrpgActorCommandStatus.prototype.clearBattler;
    Window_SrpgActorCommandStatus.prototype.clearBattler = function () {
        if (this._bust) {
            this._bust.visible = false;
        }
        if (this._background) {
            this._background.visible = false;
        }
		if (this._bust2) {
            this._bust.visible = false;
        }
        if (this._background2) {
            this._background.visible = false;
        }
		if (this._background3) {
            this._background.visible = false;
        }
        _Window_SrpgActorCommandStatus_clear.call(this);
    };
    //New Draw Icons Function
    Window_Base.prototype.drawActorIconsEx = function (actor, x, y, width, align = "left") {
        width = width || 144;
        var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
        for (var i = 0; i < icons.length; i++) {
            if (align == "left") {
                this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
            } else {
                this.drawIcon(icons[i], x + width - Window_Base._iconWidth * (i + 1), y + 2);
            }
        }
        if (Yanfly.BSC.Window_Base_drawActorIcons) {
            this.drawActorIconsTurnsEx(actor, x, y, width, align);
        }
    };
    Window_Base.prototype.drawActorIconsTurnsEx = function (actor, wx, wy, ww, align = "left") {
        var iw = Window_Base._iconWidth;
        var icons = actor.allIcons().slice(0, Math.floor(ww / iw));
        var max = icons.length;
        var shownMax = Math.floor(ww / iw);
		if (align == "right") {
			wx += ww - iw;
		}
        for (var i = 0; i < actor.states().length; ++i) {
            if (shownMax <= 0) break;
            var state = actor.states()[i];
            if (state.iconIndex <= 0) continue;
            if (state.autoRemovalTiming > 0) {
				this.drawStateTurns(actor, state, wx, wy);	
            }
            this.drawStateCounter(actor, state, wx, wy);
            if (align == "left") {
			wx += iw;
			} else {
				wx -= iw;
			}
            --shownMax;
        }
        for (var i = 0; i < 8; ++i) {
            if (shownMax <= 0) break;
            if (actor._buffs[i] === 0) continue;
            this.drawBuffTurns(actor, i, wx, wy);
            if (Yanfly.Param.BSCShowBuffRate) {
                this.drawBuffRate(actor, i, wx, wy);
            }
			if (align == "left") {
            wx += iw;
			} else {
				wx -= iw;
			}
            --shownMax;
        }
        this.resetFontSettings();
        this.resetTextColor();
    };
    //=============================================================================
    // Function overwrite: Window_ActorCommand (Yanfly Core Engine Edit)
    //=============================================================================
    Window_ActorCommand.prototype.addSkillCommands = function () {
        var skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function (a, b) {
            return a - b
        });
        var skillTypes = [...new Set(skillTypes)]; //Fix to remove duplicates
        skillTypes.forEach(function (stypeId) {
            var name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, 'skill', true, stypeId);
        }, this);
    };
})();
