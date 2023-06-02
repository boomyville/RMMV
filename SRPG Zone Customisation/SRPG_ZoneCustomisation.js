//=============================================================================
//SRPG_ZoneCustomisation.js
//=============================================================================
/*:
 * @plugindesc Customise the colour of cells when targetting enemies based on various conditions 
 * @author Boomy 
 * 
 * @param Blend
 * @desc Set image blending to be true or false
 * @default true
 *  
 * @param Z Level
 * @desc Set Z level for tiles. Default is 0 (so on the ground), above 0 means above stuff (probably best not to go minus)
 * @default 0
 *   
 * @param AoE Z Level
 * @desc Set Z level for AoE tiles. Default is 0 (so on the ground), above 0 means above stuff (probably best not to go minus)
 * @default 5
 *  
 * @param Animation Cycle Count
 * @desc Set how many frames tiles cycle their opacity
 * @default 40
 *  
 * @param Animation Opacity Formula
 * @desc An eval formula that determines opacity of a tile. Can use this._frameCount parameter. 255 means full opacity.
 * @default (40 - this._frameCount) * 3
 * 
 * @param Animation AoE Cycle Count
 * @desc Set how many frames AoE tiles cycle their opacity
 * @default 40
 *  
 * @param Animation AoE Opacity Formula
 * @desc An eval formula that determines opacity of an AoE tile. Can use this._frameCount parameter. 255 means full opacity.
 * @default (40 - this._frameCount) * 3
 * 
  * @param Attack Tile Colour
 * @desc Colour for attack tiles. Usually red like roses
 * @default Red
 * 
  * @param Move Tile Colour
 * @desc Colour for movement tiles. Usually blue 
 * @default Blue
 * 
  * @param AoE Tile Colour
 * @desc Colour for AoE tiles. Usually yellow
 * @default Yellow
 *  
 * @param Aura Tile Colour
 * @desc Colour for Aura tiles. Usually green
 * @default Green
 * 
  * @param Attack Tile Bitmap
 * @desc A file name for the bitmap used for attack (red) tiles in the img/system folder. Set to false to not use
 * @default false
 * 
  * @param Move Tile Bitmap
 * @desc A file name for the bitmap used for movement (blue) tiles in the img/system folder. Set to false to not use
 * @default false
 * 
  * @param AoE Tile Bitmap
 * @desc A file name for the bitmap used for AoE Attack (yellow) tiles in the img/system folder. Set to false to not use
 * @default false
 *   
 * @param Aura Tile Bitmap
 * @desc A file name for the bitmap used for Aura Attack (green) tiles in the img/system folder. Set to false to not use
 * @default false
 * 
 * @param Condition 1
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default (Imported.YEP_ElementCore) ? (actor.currentAction().calcElementRate(enemy) > 1) : (enemy.elementRate(actor.currentAction().item().damage.elementId) > 1)
 * 
 * @param Result 1
 * @desc A colour. 
 * @default Cyan
 * 
 * @param System Tile Image Name 1
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
 *    
 * @param Condition 2
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default (Imported.YEP_ElementCore) ? (actor.currentAction().calcElementRate(enemy) < 1) : (enemy.elementRate(actor.currentAction().item().damage.elementId) < 1)
 * 
 * @param Result 2
 * @desc A colour. 
 * @default Green
 * 
 * @param System Tile Image Name 2
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
 *       
 * @param Condition 3
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 3
 * @desc A colour. 
 * @default Red
  * 
 * @param System Tile Image Name 3
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
 *    
 * @param Condition 4
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 4
 * @desc A colour. 
 * @default DarkViolet
  *
 * @param System Tile Image Name 4
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
 *    
 * @param Condition 5
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 5
 * @desc A colour. 
 * @default White
  *    
 * @param System Tile Image Name 5
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
 *    
 * @param Condition 6
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 6
 * @desc A colour. 
 * @default Black
  *    
 * @param System Tile Image Name 6
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
 *    
 * @param Condition 7
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 7
 * @desc A colour. 
 * @default Blue
  *     
 * @param System Tile Image Name 7
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
 *   
 * @param Condition 8
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 8
 * @desc A colour. 
 * @default Pink
  *     
 * @param System Tile Image Name 8
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
 *   
 * @param Condition 9
 * @desc A javascript eval. Can use "actor" and "enemy" variables
 * @default false
 * 
 * @param Result 9
 * @desc A colour. 
 * @default Aquamarine
 *     
 * @param System Tile Image Name 9
 * @desc A file name for the bitmap used for tile in the img/system folder. Set to false to not use
 * @default false
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


    Sprite_SrpgMoveTile.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this._frameCount = 0;
        this._posX = -1;
        this._posY = -1;
        this.z = parameters["Z Level"];
        this.visible = false;
        if(parameters["Attack Tile Bitmap"] !== "false") {
            this._attackTile = ImageManager.loadSystem(parameters["Attack Tile Bitmap"]); 
        } if(parameters["Move Tile Bitmap"]  !== "false") {
            this._moveTile = ImageManager.loadSystem(parameters["Move Tile Bitmap"]); 
        } if(parameters["AoE Tile Bitmap"]  !== "false") {
            this._aoeTile = ImageManager.loadSystem(parameters["AoE Tile Bitmap"]); 
        } if(parameters["Aura Tile Bitmap"]  !== "false") {
            this._auraTile = ImageManager.loadSystem(parameters["Aura Tile Bitmap"]); 
        } if(parameters["System Tile Image Name 1"] !== "false") {
            this._tile1 = ImageManager.loadSystem(parameters["System Tile Image Name 1"]); 
        }if(parameters["System Tile Image Name 2"] !== "false") {
            this._tile2 = ImageManager.loadSystem(parameters["System Tile Image Name 2"]); 
        }if(parameters["System Tile Image Name 3"] !== "false") {
            this._tile3 = ImageManager.loadSystem(parameters["System Tile Image Name 3"]); 
        }if(parameters["System Tile Image Name 4"] !== "false") {
            this._tile4 = ImageManager.loadSystem(parameters["System Tile Image Name 4"]); 
        }if(parameters["System Tile Image Name 5"] !== "false") {
            this._tile5 = ImageManager.loadSystem(parameters["System Tile Image Name 5"]); 
        }if(parameters["System Tile Image Name 6"] !== "false") {
            this._tile6 = ImageManager.loadSystem(parameters["System Tile Image Name 6"]); 
        }if(parameters["System Tile Image Name 7"] !== "false") {
            this._tile7 = ImageManager.loadSystem(parameters["System Tile Image Name 7"]); 
        }if(parameters["System Tile Image Name 8"] !== "false") {
            this._tile8 = ImageManager.loadSystem(parameters["System Tile Image Name 8"]); 
        }if(parameters["System Tile Image Name 9"] !== "false") {
            this._tile9 = ImageManager.loadSystem(parameters["System Tile Image Name 9"]); 
        }
    };

    Sprite_SrpgMoveTile.prototype.createBitmap = function() {
        var tileWidth = $gameMap.tileWidth();
        var tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        if(eval(parameters["Blend"])) {
        this.blendMode = Graphics.BLEND_ADD;
        }
    };
Sprite_SrpgAoE.prototype.setAoE = function(x, y, size, minSize, type, dir) {
        this._posX = x;
        this._posY = y;
        if(eval(parameters["Blend"])) {
        this.blendMode = Graphics.BLEND_ADD;
        }
        if (this._size != size || this._minSize != minSize || this._type != type || this._dir != dir) {
            this._size = size;
            this._type = type;
            this._dir = dir;
            this.redrawArea(size, minSize, type, dir);
        }
    };

    Sprite_SrpgMoveTile.prototype.updateAnimation = function() {
        this._frameCount++;
        this._frameCount %= Number(parameters["Animation Cycle Count"]);
        this.opacity = eval(parameters["Animation Opacity Formula"]);
    };

    Sprite_SrpgAoE.prototype.updateAnimation = function() {
        this._frameCount++;
        this._frameCount %= Number(parameters["Animation AoE Cycle Count"]);
        this.opacity = eval(parameters["Animation AoE Opacity Formula"]);
    };


    Sprite_SrpgMoveTile.prototype.setThisMoveTile = function (x, y, attackFlag) {
        this._frameCount = 0;
        this._posX = x;
        this._posY = y;
        if (attackFlag == true) {
            if ($gameSystem.isSubBattlePhase() == "actor_target") {
                var drawColour;
                var drawBitmap;
                if ($gameMap.eventsXy(x, y).length > 0) {
                    for (var i = 0; i < $gameMap.eventsXy(x, y).length; i++) {
                        if ($gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId()) !== undefined) {
                            if ($gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId())) {
                                if ($gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId())[1]) {
                                    if ($gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId())[1].isEnemy()) {
                                        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
                                        var enemy = $gameSystem.EventToUnit($gameMap.eventsXy(x, y)[i].eventId())[1];
                                        if (eval(parameters["Condition 1"])) {
                                            if(this._tile1) { drawBitmap = this._tile1}
                                            drawColour = parameters["Result 1"];
                                            break;
                                        } else if (eval(parameters["Condition 2"])) {
                                            drawColour = parameters["Result 2"];
                                            if(this._tile2) { drawBitmap = this._tile2}
                                            break;
                                        } else if (eval(parameters["Condition 3"])) {
                                            drawColour = parameters["Result 3"];
                                            if(this._tile3) { drawBitmap = this._tile3}
                                            break;
                                        } else if (eval(parameters["Condition 4"])) {
                                            drawColour = parameters["Result 4"];
                                            if(this._tile4) { drawBitmap = this._tile4}
                                            break;
                                        } else if (eval(parameters["Condition 5"])) {
                                            drawColour = parameters["Result 5"];
                                            if(this._tile5) { drawBitmap = this._tile5}
                                            break;
                                        } else if (eval(parameters["Condition 6"])) {
                                            drawColour = parameters["Result 6"];
                                            if(this._tile6) { drawBitmap = this._tile6}
                                            break;
                                        } else if (eval(parameters["Condition 7"])) {
                                            drawColour = parameters["Result 7"];
                                            if(this._tile7) { drawBitmap = this._tile7}
                                            break;
                                        } else if (eval(parameters["Condition 8"])) {
                                            drawColour = parameters["Result 8"];
                                            if(this._tile8) { drawBitmap = this._tile8}
                                            break;
                                        } else if (eval(parameters["Condition 9"])) {
                                            drawColour = parameters["Result 9"];
                                            if(this._tile9) { drawBitmap = this._tile9}
                                            break;
                                        } else {
                                            drawColour = parameters["Attack Tile Colour"];
                                            if(this._attackTile) { drawBitmap = this._attackTile}
                                            break;

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if(drawBitmap) {
                    this.bitmap = drawBitmap;
                } else if(drawColour) {
                    this.bitmap.fillAll(drawColour);
                }
            } else {
                if(parameters["Attack Tile Bitmap"] !== "false") {
                    this.bitmap = this._attackTile;
                } else {
                this.bitmap.fillAll(parameters["Attack Tile Colour"]);
                }
            }
        } else if (attackFlag === false) {	
	       	if(parameters["Move Tile Bitmap"] !== "false") {
                    this.bitmap = this._moveTile;
                } else {
                this.bitmap.fillAll(parameters["Move Tile Colour"]);
                }
		}
		else if (attackFlag === 'AoE') {
         if(parameters["AoE Tile Bitmap"] !== "false") {
                    this.bitmap = this._aoeTile;
                } else {
                this.bitmap.fillAll(parameters["AoE Tile Colour"]);
                }
        } if (attackFlag[0] === "Aura") {
            this.aura = true;
            if(parameters["Aura Tile Bitmap"] !== "false") {
                    this.bitmap = this._auraTile;
                } else {
                this.bitmap.fillAll(parameters["Aura Tile Colour"]);
                }
        }
		
    };

    Sprite_SrpgAoE.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this._frameCount = 0;
        this._posX = -1;
        this._posY = -1;
        this.z = parameters["AoE Z Level"];
        this.visible = false;
        if(parameters["AoE Tile Bitmap"] !== "false") {
            this._aoeTile = ImageManager.loadSystem(parameters["AoE Tile Bitmap"]); 
        } if(parameters["System Tile Image Name 1"] !== "false") {
            this._tile1 = ImageManager.loadSystem(parameters["System Tile Image Name 1"]); 
        }if(parameters["System Tile Image Name 2"] !== "false") {
            this._tile2 = ImageManager.loadSystem(parameters["System Tile Image Name 2"]); 
        }if(parameters["System Tile Image Name 3"] !== "false") {
            this._tile3 = ImageManager.loadSystem(parameters["System Tile Image Name 3"]); 
        }if(parameters["System Tile Image Name 4"] !== "false") {
            this._tile4 = ImageManager.loadSystem(parameters["System Tile Image Name 4"]); 
        }if(parameters["System Tile Image Name 5"] !== "false") {
            this._tile5 = ImageManager.loadSystem(parameters["System Tile Image Name 5"]); 
        }if(parameters["System Tile Image Name 6"] !== "false") {
            this._tile6 = ImageManager.loadSystem(parameters["System Tile Image Name 6"]); 
        }if(parameters["System Tile Image Name 7"] !== "false") {
            this._tile7 = ImageManager.loadSystem(parameters["System Tile Image Name 7"]); 
        }if(parameters["System Tile Image Name 8"] !== "false") {
            this._tile8 = ImageManager.loadSystem(parameters["System Tile Image Name 8"]); 
        }if(parameters["System Tile Image Name 9"] !== "false") {
            this._tile9 = ImageManager.loadSystem(parameters["System Tile Image Name 9"]); 
        }
    };

    Sprite_SrpgAoE.prototype.drawCell = function (bitmap, x, y, tileWidth, tileHeight) {
        if ($gameTemp.activeEvent()) {
            if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction() !== undefined) {
                if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction().item()) {
                    if ($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction().item().meta.srpgAreaRange !== undefined) {
                        var tileX = x / tileWidth;
                        var tileY = y / tileHeight;
                        tileX = tileX - Number($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction().item().meta.srpgAreaRange) + $gamePlayer.posX();
                        tileY = tileY - Number($gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction().item().meta.srpgAreaRange) + $gamePlayer.posY();
                    }
                }
            }
        }
        var drawColour = parameters["AoE Tile Colour"];
        var drawBitmap;
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
                                            if(this._tile1) { drawBitmap = this._tile1}
                                            drawColour = parameters["Result 1"];
                                            break;
                                        } else if (eval(parameters["Condition 2"])) {
                                            drawColour = parameters["Result 2"];
                                            if(this._tile2) { drawBitmap = this._tile2}
                                            break;
                                        } else if (eval(parameters["Condition 3"])) {
                                            drawColour = parameters["Result 3"];
                                            if(this._tile3) { drawBitmap = this._tile3}
                                            break;
                                        } else if (eval(parameters["Condition 4"])) {
                                            drawColour = parameters["Result 4"];
                                            if(this._tile4) { drawBitmap = this._tile4}
                                            break;
                                        } else if (eval(parameters["Condition 5"])) {
                                            drawColour = parameters["Result 5"];
                                            if(this._tile5) { drawBitmap = this._tile5}
                                            break;
                                        } else if (eval(parameters["Condition 6"])) {
                                            drawColour = parameters["Result 6"];
                                            if(this._tile6) { drawBitmap = this._tile6}
                                            break;
                                        } else if (eval(parameters["Condition 7"])) {
                                            drawColour = parameters["Result 7"];
                                            if(this._tile7) { drawBitmap = this._tile7}
                                            break;
                                        } else if (eval(parameters["Condition 8"])) {
                                            drawColour = parameters["Result 8"];
                                            if(this._tile8) { drawBitmap = this._tile8}
                                            break;
                                        } else if (eval(parameters["Condition 9"])) {
                                            drawColour = parameters["Result 9"];
                                            if(this._tile9) { drawBitmap = this._tile9}
                                            break;
                                        }else {
                                            drawColour = parameters["AoE Tile Colour"];
                                            if(this._aoeTile) { drawBitmap = this._aoeTile}
                                            break;

                                        }
                                }
                            }
                        }
                    }
                }
            }
            if(drawBitmap) {
                bitmap = drawBitmap;    
            } else {
            bitmap.fillRect(x, y, tileWidth, tileHeight, drawColour);
            }
        } else {
            drawColour = parameters["AoE Tile Colour"];
                                            if(this._aoeTile) { drawBitmap = this._aoeTile}
                                            
            if(drawBitmap) {
                bitmap = drawBitmap;    
            } else {
            bitmap.fillRect(x, y, tileWidth, tileHeight, drawColour);
            }
        }
    };
})()
