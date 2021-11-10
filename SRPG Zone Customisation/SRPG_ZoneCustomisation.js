//=============================================================================
//SRPG_ZoneCustomisation.js
//=============================================================================
/*:
 * @plugindesc Customise the colour of cells when targetting enemies based on various conditions 
 * @author Boomy 
 * 
 * @param Condition 1
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default (Imported.YEP_ElementCore) ? (actor.currentAction().calcElementRate(enemy) > 1) : (enemy.elementRate(actor.currentAction().item().damage.elementId) > 1)
 * 
 * @param Result 1
 * @desc A colour. 
 * @default Cyan
 *   
 * @param Condition 2
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default (Imported.YEP_ElementCore) ? (actor.currentAction().calcElementRate(enemy) < 1) : (enemy.elementRate(actor.currentAction().item().damage.elementId) < 1)
 * 
 * @param Result 2
 * @desc A colour. 
 * @default Green
  *   
 * @param Condition 3
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 3
 * @desc A colour. 
 * @default Red
  *   
 * @param Condition 4
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 4
 * @desc A colour. 
 * @default DarkViolet
  *   
 * @param Condition 5
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 5
 * @desc A colour. 
 * @default White
  *   
 * @param Condition 6
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 6
 * @desc A colour. 
 * @default Black
  *   
 * @param Condition 7
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 7
 * @desc A colour. 
 * @default Blue
  *   
 * @param Condition 8
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 8
 * @desc A colour. 
 * @default Pink
  *   
 * @param Condition 9
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 9
 * @desc A colour. 
 * @default Aquamarine
 *   
 * @help
 * This plugin was made at the request of MetalKing11417 of the RPG Maker Forums 
 * This plugin was further edited in response to Yew Bowman of the RPG Maker Forums 
 *
 * Place below all SRPG plugins for maximum compatability
 *
 * This is an advanced plugin that changes the colour of tiles when an enemy is
 *  "in the zone" (within the target range of a skill)
 *
 * Just like in Koroko's no Basuke, the zone user (the developer) needs to have 
 * great passion for javascript to use it to it's full potential
 *
 * The default options provide two examples: 
 * If the enemy is weak and 
 * if the enemy is strong against the user's skill elementFromPoint
 *
 * If the enemy is weak, then the square is shown to be dark red
 * If the enemy is strong, then the square is shown to be Gray
 * The default examples have a weird way of calculating weak and strong; 
 * it checks if Yanfly_Element core is present and if so calculates elementRate 
 * a bit differently
 * 
 * The colours used are from https://www.w3schools.com/cssref/css_colors.asp 
 * because that's what srpg_core.js uses (and what Dr.Q's documentation says)
 * The script only works if the target is an enemy and the user is an actor 
 * The script does not work with srpg_core.js "specialRange" (as it uses 
 * Dr. Q's srpg_AoE.js interprotation of "inArea")
 * This script requires srpg_AoE.js 
 *
 */
(function () {
    //=================================================================================================
    //Plugin Parameters
    //=================================================================================================
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);
    Sprite_SrpgMoveTile.prototype.setThisMoveTile = function (x, y, attackFlag) {
        this._frameCount = 0;
        this._posX = x;
        this._posY = y;
        if (attackFlag == true) {
            if ($gameSystem.isSubBattlePhase() == "actor_target") {
                var drawColour = "red";
                if ($gameMap.eventsXy(x, y).length > 0) {
                    for (var i = 0; i < $gameMap.eventsXy(x, y).length; i++) {
                        if ($gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId()) !== undefined) {
                            if ($gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId())) {
                                if ($gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId())[1]) {
                                    if ($gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId())[1].isEnemy()) {
                                        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
                                        var enemy = $gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId())[1];
                                        if (eval(parameters["Condition 1"])) {
                                            drawColour = parameters["Result 1"];
                                            break;
                                        } else if (eval(parameters["Condition 2"])) {
                                            drawColour = parameters["Result 2"];
                                            break;
                                        } else if (eval(parameters["Condition 3"])) {
                                            drawColour = parameters["Result 3"];
                                            break;
                                        } else if (eval(parameters["Condition 4"])) {
                                            drawColour = parameters["Result 4"];
                                            break;
                                        } else if (eval(parameters["Condition 5"])) {
                                            drawColour = parameters["Result 5"];
                                            break;
                                        } else if (eval(parameters["Condition 5"])) {
                                            drawColour = parameters["Result 5"];
                                            break;
                                        } else if (eval(parameters["Condition 6"])) {
                                            drawColour = parameters["Result 6"];
                                            break;
                                        } else if (eval(parameters["Condition 7"])) {
                                            drawColour = parameters["Result 7"];
                                            break;
                                        } else if (eval(parameters["Condition 8"])) {
                                            drawColour = parameters["Result 8"];
                                            break;
                                        } else if (eval(parameters["Condition 9"])) {
                                            drawColour = parameters["Result 9"];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                this.bitmap.fillAll(drawColour);
            } else {
                this.bitmap.fillAll("red");
            }
        } else {
            this.bitmap.fillAll('blue');
        }
    };
    Sprite_SrpgAoE.prototype.drawCell = function (bitmap, x, y, tileWidth, tileHeight) {
        if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction() !== undefined) {
            if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction().item().meta.srpgAreaRange !== undefined) {
                var tileX = x / tileWidth;
                var tileY = y / tileHeight;
                tileX = tileX - Number($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction().item().meta.srpgAreaRange) + $gamePlayer.posX();
                tileY = tileY - Number($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction().item().meta.srpgAreaRange) + $gamePlayer.posY();
            }
        }
        var drawColour = PluginManager.parameters("SRPG_AoE")["AoE Color"];
        if ($gameSystem.isSubBattlePhase() == "actor_target") {
            if ($gameMap.eventsXy(tileX, tileY).length > 0) {
                for (var i = 0; i < $gameMap.eventsXy(tileX, tileY).length; i++) {
                    if ($gameSystem.EventToUnit($gameMap.eventsXy(tileX, tileY)[i].eventId()) !== undefined) {
                        if ($gameSystem.EventToUnit($gameMap.eventsXy(tileX, tileY)[i].eventId())) {
                            if ($gameSystem.EventToUnit($gameMap.eventsXy(tileX, tileY)[i].eventId())[1]) {
                                if ($gameSystem.EventToUnit($gameMap.eventsXy(tileX, tileY)[i].eventId())[1].isEnemy()) {
                                    var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
                                    var enemy = $gameSystem.EventToUnit($gameMap.eventsXy(tileX, tileY)[i].eventId())[1];
                                    if (eval(parameters["Condition 1"])) {
                                        drawColour = parameters["Result 1"];
                                        break;
                                    } else if (eval(parameters["Condition 2"])) {
                                        drawColour = parameters["Result 2"];
                                        break;
                                    }else if (eval(parameters["Condition 3"])) {
                                        drawColour = parameters["Result 3"];
                                        break;
                                    }else if (eval(parameters["Condition 4"])) {
                                        drawColour = parameters["Result 4"];
                                        break;
                                    }else if (eval(parameters["Condition 5"])) {
                                        drawColour = parameters["Result 5"];
                                        break;
                                    }else if (eval(parameters["Condition 6"])) {
                                        drawColour = parameters["Result 6"];
                                        break;
                                    }else if (eval(parameters["Condition 7"])) {
                                        drawColour = parameters["Result 7"];
                                        break;
                                    }else if (eval(parameters["Condition 8"])) {
                                        drawColour = parameters["Result 8"];
                                        break;
                                    }else if (eval(parameters["Condition 9"])) {
                                        drawColour = parameters["Result 9"];
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            bitmap.fillRect(x, y, tileWidth, tileHeight, drawColour);
        } else {
            bitmap.fillRect(x, y, tileWidth, tileHeight, drawColour);
        }
    };
})()
