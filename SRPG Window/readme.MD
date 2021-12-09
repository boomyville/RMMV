# Useful parameters
Detailed below is a list of javascript code parameters that can be used to help construct your windows. Some parameters also include a 'console' value that allows you to determine the default/current value in your project by entering it in the console.
To open the console, press F12. I have also ranked parameters based on my subjective opinion on usefulness (bold = important)
## Window properties
- **Window Padding**: this.padding or Window_Base.prototype.standardPadding()
	- This is the space within a window that is set as a margin
	- More less padding = contents drawn closer to the edge of the window
	- Modifiable by YEP_Core
	- console: SceneManager._scene._windowLayer.children[0].padding
- Text Padding: this.textPadding() or Window_Base.prototype.standardPadding()
	- This is the space between text elements
	- More less padding = text elements drawn closer together
	- Modifiable by YEP_Core
	- console: SceneManager._scene._windowLayer.children[0].textPadding()
	- Kind of useless for windows 
- **Fitting Height**: this.fittingHeight(X)
	- X is the row number
	- Returns a height in pixels 
	- This value is basically fittingHeight * X + 2 x padding
	- This is useful in that it automatically calculates the window padding for the developer
	- console: SceneManager._scene._windowLayer.children[0].fittingHeight(X)
- **Line Height**: this.fittingHeight()
	- Returns the height of a line of text in pixels
	- Modifiable by YEP_Core
	- console: SceneManager._scene._windowLayer.children[0].fittingHeight()
- Game Window Width: Graphics.boxWidth
	- Returns width of the game window
	- Modifiable by YEP_Core
- Game Window Height: Graphics.boxHeight
	- Returns height of the game window
	- Modifiable by YEP_Core
- **Window Width**: this.windowWidth()
	- Returns width of window 
	- Also set by plugin parameter
- **Window Height**: this.windowHeight()
	- Returns height of window 
	- Also set by plugin parameter
- Face Width: Window_Base._faceWidth
	- Pixel width of faceSet
- Face Height: Window_Base._faceHeight
	- Pixel height of faceSet
- Icon Width: Window_Base._iconWidth
	- Pixel width of icons
- Icon Height: Window_Base._iconHeight
	- Pixel height of icons
	
## Drawing stuff
- **Draw text**: this.drawText(text, x, y, width)
	- Primary function of drawing text
	- Text can be any string
	- X, Y is the position (relative to the window)
	- 0, 0 will draw text at the top left corner
	- Width is set such that if text is too long, the text will be squished to fittingHeight
- **Change text colour**: this.changeTextColor(colour)
	- Colour is a hexadecimal colour as a string
	- https://htmlcolorcodes.com/ is your second best friend
	- Use this.resetTextColor(); to reset text colour to default
- **Draw Icon**: this.drawIcon(iconIndex, x, y)
	- Draws an icon based on iconIndex
	- Useful way to draw 'pictures' 
- **Draw Gauge**: this.drawGauge(x, y, width, rate, colour1, colour2)
	- Used to draw gauges
	- Gauge attributes modifiable by YEP_Core
	- Rate is a value between 0 to 1
	- Colour is set by YEP or via a hexadecimal colour1
	- https://htmlcolorcodes.com/ is your second best friend
	- Colour is a 'string' so use '#FFFFFF' for white for example
	- Most scripters use colours set by RPG Maker such as this.hpGaugeColor()
- **Draw Face**: this.drawActorFace(actor, x, y, width, height)
	- Draws actor's faceSet
	- Use this.drawEnemyFace(enemy, x, y, width, height) for enemies
	- Note that SRPG_Core.js introduces the enemyFace function
- **Draw HP**: this.drawActorHp(actor, x, y, width)
	- Draws Actor's HP / MaxHP as well as gauges
	- Less flexible but more convenient
	- Actor can technically be enemy as well
	- MP and TP version exist as well (this.drawActorMp and this.drawActorTp)4
- **Draw Status Icons**: this.drawActorIcons(actor, x, y, width)
	- Draws icons relating to actor's status effects

## Useful actor parameters
Replace actor with one of the following:
- $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1] 
- $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1] 
- this._battler (Quick status window Only)
- this._actionArray[1] (Prediction window Only)
- this._targetArray[1] (Prediction window Only)

Parameters:
- HP: actor.hp (MaxHP: actor.mhp)
- MP: actor.mp (MaxMp: actor.mmp)
- TP: actor.tp
- Level: actor.level
- Strength: actor.atk
- Defense: actor.def 
- Magic: actor.mat
- Magic Defense: actor.mdf
- Luck: actor.luk
- Agility: actor.agi
- Critical hit rate: actor.cri
- Critical evade rate: actor.cev
- Hit rate: actor.hit
- Evade rate: actor.eva
- (Real) hit rate: actor.currentAction().itemHit(target) (only use with prediction window)
- (Real) crit rate: actor.currentAction().itemCri(target) (only use with prediction window)
- Weapon name: actor.isActor() ? actor.weapons()[0].name : $dataWeapons[actor.meta.srpgWeapon].name
- HP Skill Cost: actor.currentAction().item().hpCost (only use with prediction window)
- MP Skill Cost: actor.currentAction().item().mpCost (only use with prediction window)
- TP Skill Cost: actor.currentAction().item().tpCost (only use with prediction window)
- Skill Element Name: $dataSystem.elements[actor.currentAction().item().damage.elementId] 
	- If using YEP Element Core then you can access other elements using: actor.currentAction().item().multipleElements (which returns an array of other elements)
- Target Element Rate: target.elementRate(actor.currentAction().item().damage.elementId)
- Prediction damage: actor.currentAction().srpgPredictionDamage(target)
- Durability (YEP): DataManager.getDurability(actor.weapons()[0]) + "/" + DataManager.getMaxDurability(actor.weapons()[0])


## Fire Emblem (GBA) Style Quick Status Tutorial
The Fire Emblem games on GBA have a very simple window that pops up when a unit is highlighted. The window is usually shown on the bottom corner and includes the unit's face, name, HP and HP gauge. This is fairly easy to replicate with SRPG_Window.js.

Fire Emblem (GBA):

![Fire Emblem Example](https://gamefaqs.gamespot.com/a/screen/full/9/1/6/242916.jpg)

SRPG_Core.js:

![SRPG Example](https://github.com/boomyville/RMMV/blob/master/SRPG%20Window/Example1.png?raw=true)


Firstly we need to create the background for our window. In this tutorial, we will use the default window skin but it is possible to use a background image instead. We will set the window to have a height of 1 face_height + padding * 2 and width of 2 face_widths + padding * 2. This will mean we need to use the following plugin parameters (Quick Status):
- No hover (false)
- Quick Status X: Graphics.boxWidth - Window_Base._faceWidth * 2 - Window_Base.prototype.standardPadding() * 3
- Quick Status Y: Graphics.boxHeight - Window_Base._faceHeight * 1 - Window_Base.prototype.standardPadding() * 2
- Opacity: 128 (Half transparent)
- Width: Window_Base._faceWidth * 2 + Window_Base.prototype.standardPadding() * 3
- Height: Window_Base._faceHeight * 1 + Window_Base.prototype.standardPadding() * 2

![Plugin Parameters](https://github.com/boomyville/RMMV/blob/master/SRPG%20Window/PluginParameters1.png?raw=true)

The contents parameter is basically javascript (lunatic) code that will fill our window. In this case, we will have the face of the unit placed on the left side of the window and the unit's name / HP / HP gauge on the right side of the window
- To place a face, we use the this.drawActorFace(actor, x, y, width, height) function (for actor) or drawEnemyFace for enemies. 
	- Actor will be this._battler 
	- x will be 0 (top left corner)
	- y will be 0 (top left corner)
	- width will be the default face width (Window_Base._faceWidth)
	- height will be the default face width (Window_Base._faceHeight)
	- We will do a check to see if we should call the drawActorFace or drawEnemyFace function by using the isActor() function
	- if (this._battler.isActor()) { this.drawActorFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight); } else { this.drawEnemyFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight); }
- To place the unit's name, we will use a simple this.drawText function
	- text will be this._battler.name()
	- x will be Window_Base._faceWidth + Window_Base.prototype.standardPadding() (to the right side of the face graphic)
	- y will be 0 (top of window)
	- width will be a face width of Window_Base._faceWidth
	- this.drawText(this._battler.name(), Window_Base._faceWidth + this.padding, 0, Window_Base._faceWidth)
- To place the unit's HP, we will use a simple this.drawText function
	- text will be this._battler.hp + "/" + this._battler.mhp
	- x will be Window_Base._faceWidth + this.padding (to the right side of the face graphic)
	- y will be 1/3rd down of the status window this.windowHeight() / 3
	- width will be a face width of Window_Base._faceWidth
	- this.drawText(this._battler.hp + "/" + this._battler.mhp, Window_Base._faceWidth + this.padding, this.windowHeight() / 3, Window_Base._faceWidth)
- To draw the HP Gauge, we will use a drawGauge function	
	- x will be Window_Base._faceWidth + this.padding (to the right side of the face graphic)
	- y will be 2/3 down of the status window this.windowHeight() / 3 * 2
	- width will be a face width of Window_Base._faceWidth
	- rate will be a float value between 0 and 1 representing "% health left". RMMV gives us the this._battler.hpRate() function
	- colour1 will be a hexadecimal colour of red (#ff0000)
	- colour2 will be a hexadecimal colour of green (#00ff00)
	- this.drawGauge( Window_Base._faceWidth + this.padding, this.windowHeight() / 3 * 2, Window_Base._faceWidth, this._battler.hpRate(), '#ff0000', '#00ff00')
- We combine all these functions into one line (separate each line with semi-colon) to get: 
	if (this._battler.isActor()) { this.drawActorFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight); } else { this.drawEnemyFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight); } 	this.drawText(this._battler.name(), Window_Base._faceWidth + this.padding, 0, Window_Base._faceWidth, 'right'); 	
	this.drawText(this._battler.hp + '/' + this._battler.mhp, Window_Base._faceWidth + this.padding, this.windowHeight() / 3, Window_Base._faceWidth, 'right'); 	
	this.drawGauge(Window_Base._faceWidth + this.padding, this.windowHeight()  / 3 * 2, Window_Base._faceWidth, this._battler.hpRate(), '#FF0000', '#00FF00');
- I use notepad++ as well as ctrl + J to remove all line breaks.
- If you want to align the HP and battler name text to the right, you can add 'right' as a final parameter to the drawText function 
- Use the following code to test your code in the game on the fly using the console:
	PluginManager.parameters("SRPG_Window")["Prediction Window Contents Lunatic Code"] = "if (this._battler.isActor()) { this.drawActorFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight); } else { this.drawEnemyFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight); } 	this.drawText(this._battler.name(), Window_Base._faceWidth + this.padding, 0, Window_Base._faceWidth, 'right'); 	 this.drawText(this._battler.hp + '/' + this._battler.mhp, Window_Base._faceWidth + this.padding, this.windowHeight() / 3, Window_Base._faceWidth, 'right'); 	 this.drawGauge(Window_Base._faceWidth + this.padding, this.windowHeight()  / 3 * 2, Window_Base._faceWidth, this._battler.hpRate(), '#FF0000', '#00FF00');"

## Fire Emblem (GBA) Style Battle Prediction Tutorial
Fire Emblem (GBA) has a simple box that appears when selecting a target. It shows the combatant's HP, damage, hit rate, critical hit rate, weapons/skill and name of combatants. The default SRPG_Core.js prediction window already shows all these details but we will condense all this information into a smaller window.

Fire Emblem (GBA):

![Fire Emblem Example](https://gamefaqs.gamespot.com/a/screen/full/9/1/2/242912.jpg)

SRPG_Core.js:

![Example](https://github.com/boomyville/RMMV/blob/master/SRPG%20Window/Example2.png?raw=true)

Firstly we need to create the background for our window. In this tutorial, we will use the default window skin but it is possible to use a background image instead. We will set the window to have a height of 8 lines as we will display 8 rows of text. We will add 2 padding as well to the height of the window. The confirm window will go below the prediction window. The width will be set at 2 faceWidth + padding * 2 though this is arbitrary. The window will be placed in the middle of the screen. This will mean we need to use the following plugin parameters (Prediction Window):
	- No hover (false)
	- Prediction Window X: Graphics.boxWidth / 2 - ( Window_Base._faceWidth * 2 + Window_Base.prototype.standardPadding() * 2) / 2
	- Prediction Window Y: Graphics.boxHeight / 2 - (Window_Base.prototype.lineHeight() * 8 + Window_Base.prototype.standardPadding() * 6) / 2
	- Opacity: 128 (Half transparent)
	- Prediction Window Width: Window_Base._faceWidth * 2 + Window_Base.prototype.standardPadding() * 2
	- Prediction Window Height: Window_Base.prototype.lineHeight() * 8 + Window_Base.prototype.standardPadding() * 6
	- Confirm Window X: Graphics.boxWidth / 2 - ( Window_Base._faceWidth * 2 + Window_Base.prototype.standardPadding() * 2) / 2
	- Confirm Window Y: Graphics.boxHeight / 2 + (Window_Base.prototype.lineHeight() * 8 + Window_Base.prototype.standardPadding() * 6) / 2
	- Confirm Window Width: Window_Base._faceWidth * 2+ Window_Base.prototype.standardPadding() * 2
	- Confirm Window Rows: 2
	
We will have the window show the following details in order (top to bottom):
	- Actor name + icon of weapons
	- Actor's action name + icon of action
	- HP 
	- Damage
	- Hit Rate
	- Crit Rate
	- Target's name + icon of weapons
	- Targets's action name + icon of action
	
All of these parameters can be drawn using drawText and drawIcon functions
	- Battler Name + Icon of weapons
		- The actor will be denoted by this._actionArray[1]
		- We want to draw an icon to the left of battler's name so we will add a Window_Base._iconWidth buffer
		- this.drawText(this._actionArray[1].name(), Window_Base._iconWidth + this.padding, this.fittingHeight(0), this.windowWidth() - Window_Base._iconWidth)
		- To draw the icon, we need to check if the user is an enemy or not; if so we grab it using the weapons()[0] function; otherwise it will be defined by meta.srpgWeapon 
		- if(this._actionArray[1].isActor()) { this.drawIcon(this._actionArray[1].weapons()[0].iconIndex, 0, this.fittingHeight(0)); } else if (this._actionArray[1].meta.srpgWeapon){ this.drawIcon($dataWeapons[this._actionArray[1].meta.srpgWeapon].iconIndex, 0, this.fittingHeight(0)); }
	- Action Name + Icon of Skill
		- We can draw the action's icon by grabbing the user (this._actionArray[1]) currentAction's item
		- this.drawIcon(this._actionArray[1].currentAction().item().iconIndex, 0, this.fittingHeight(1)) 
		- Skill name can be drawn by using the same function but instead of grabbing iconIndex we grab the name
		- this.drawText(this._actionArray[1].currentAction().item().name, Window_Base._iconWidth + this.padding, this.fittingHeight(1), this.windowWidth() - Window_Base._iconWidth)
	- HP
		- We will draw HP in the middle. We can draw in the middle using the textWidth function that Window_Base provides 
		- this.drawText('HP', this.windowWidth() / 2 - this.textWidth('HP') / 2, this.fittingHeight(2), this.textWidth('HP'));
		- We will draw the user's HP on the left and target's HP on the right
		- this.drawText(this._actionArray[1].currentAction().item().name, Window_Base._iconWidth + this.padding, this.fittingHeight(1), this.windowWidth() - Window_Base._iconWidth);
		- We need to check if the target is not the same as the user; if so then no target info is displayed
		- if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].currentAction() !== null) { this.drawText(this._targetArray[1].hp, this.windowWidth() - this.textWidth(this._targetArray[1].hp) - this.padding * 2, this.fittingHeight(2), this.textWidth(this._targetArray[1].hp), 'right'); }
	- Damage 
		- Damage is provided by srpgPredictionDamage(target) function
		- Just like HP, we will draw DMG in the middle of the window
		- We need to check if the skill can be used too by using the canUse(item) function
		- this.drawText('DMG', this.windowWidth() / 2 - this.textWidth('DMG') / 2 - this.padding, this.fittingHeight(3), this.textWidth('DMG'));
		- if(this._actionArray[1].canUse(this._actionArray[1].currentAction().item())) { if(this._actionArray[1].currentAction().srpgPredictionDamage(this._targetArray[1]) !== 0) { this.drawText(this._actionArray[1].currentAction().srpgPredictionDamage(this._targetArray[1]), 0, this.fittingHeight(3), this.textWidth(this._actionArray[1].currentAction().srpgPredictionDamage(this._targetArray[1])), 'left'); } }
		- if(this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { if(this._targetArray[1].currentAction().srpgPredictionDamage(this._actionArray[1]) != 0) { if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].currentAction() !== null) { this.drawText(this._targetArray[1].currentAction().srpgPredictionDamage(this._actionArray[1]), this.windowWidth() - this.padding * 2 - this.textWidth(this._actionArray[1].currentAction().srpgPredictionDamage(this._actionArray[1])), this.fittingHeight(3), this.textWidth(this._targetArray[1].currentAction().srpgPredictionDamage(this._actionArray[1])), 'right'); } } }
	- Hit
		- Hit follows the same structure as damage. We get action success rate using itemHit function
		- We also use a canUse check for the target as if the target cannot counter attack then we need to not check success rate of 'null'
		- this.drawText('HIT', this.windowWidth() / 2 - this.textWidth('HIT') / 2 - this.padding, this.fittingHeight(4), this.textWidth('HIT'));
		- this.drawText(Math.round(100 * this._actionArray[1].currentAction().itemHit(this._targetArray[1])), 0, this.fittingHeight(4), this.textWidth(Math.round(100 * this._actionArray[1].currentAction().itemHit(this._targetArray[1]))), 'left');
		- if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { this.drawText(Math.round(this._targetArray[1].currentAction().itemHit(this._actionArray[1]) * 100), this.windowWidth() - this.padding * 2 - this.textWidth(Math.round(this._targetArray[1].currentAction().itemHit(this._actionArray[1]) * 100)), this.fittingHeight(4), this.textWidth(Math.round(this._targetArray[1].currentAction().itemHit(this._actionArray[1]) * 100)), 'right'); }
	- Crit 
		- Crit follows the same structure as damage. We get crit rate using itemCri function (as this incorporates critical evasion and whatever other critical hit rate modifiers present on the battler)
		- this.drawText('CRIT', this.windowWidth() / 2 - this.textWidth('CRIT') / 2 - this.padding, this.fittingHeight(5), this.textWidth('CRIT'));
		- this.drawText(Math.round(100 * this._actionArray[1].currentAction().itemCri(this._targetArray[1])), 0, this.fittingHeight(5), this.textWidth(Math.round(100 * this._actionArray[1].currentAction().itemCri(this._targetArray[1]))), 'left');
		- if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { this.drawText(Math.round(100 * this._targetArray[1].currentAction().itemCri(this._actionArray[1])), this.windowWidth() - this.padding * 2 - this.textWidth(Math.round(100 * this._targetArray[1].currentAction().itemCri(this._actionArray[1]))), this.fittingHeight(5), this.textWidth(Math.round(100 * this._targetArray[1].currentAction().itemCri(this._actionArray[1]))), 'right');
}
	- Action Name + Icon of Skill (Target)
		- If target exists (not the user), then we will draw the action name and icon as we do with the user
		- This time we will user this._targetArray[1]
		- We set the 'width' of the text for the action name to be windowWidth - iconWidth - 3 x padding (1 padding x 2 for each right/left side + 1 padding for space between icon)
		- We also run a check to see if the target can use an action; if not then nothing is displayed; we achieve this using the canUse function 
		- if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { this.drawText(this._targetArray[1].currentAction().item().name, 0, this.fittingHeight(6), this.windowWidth() - Window_Base._iconWidth - this.padding * 3, 'right'); }
		- if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { this.drawIcon(this._targetArray[1].currentAction().item().iconIndex, this.windowWidth() - Window_Base._iconWidth - this.padding * 2, this.fittingHeight(6)); }
	- Battler Name + Icon of weapons
		- If target exists (not the user), then we will draw the target's name and icon as we do with the user
		- We place the icon on the right by setting its X value to be windowWidth - iconWidth x 2
		- this.drawIcon(this._targetArray[1].currentAction().item().iconIndex, this.windowWidth() - Window_Base._iconWidth * 2, this.fittingHeight(6));
		- We set the name of the battler to justify to the right, and set its length to be windowWidth() - iconWidth - 3 x padding (we use 3 x padding to so it aligns with action name)
		- if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].currentAction() !== null) { this.drawText(this._targetArray[1].name(), 0, this.fittingHeight(7), this.windowWidth()) - Window_Base._iconWidth - this.padding * 3, 'right'); }
		- if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].currentAction() !== null) { if (this._targetArray[1].isActor()) { this.drawIcon(this._targetArray[1].weapons()[0].iconIndex,  this.windowWidth() - Window_Base._iconWidth * 2, this.fittingHeight(7)); } else if (this._targetArray[1].meta.srpgWeapon) { this.drawIcon($dataWeapons[this._targetArray[1].meta.srpgWeapon].iconIndex,  this.windowWidth() - 2 * Window_Base._iconWidth, this.fittingHeight(7)); } }
	- If we bundle all the lines of code we get the following to plug into our plugin parameter (Prediction Window Contents Lunatic Code):
		- this.drawText(this._actionArray[1].name(), Window_Base._iconWidth + this.padding, this.fittingHeight(0), this.windowWidth() - Window_Base._iconWidth); if (this._actionArray[1].isActor()) { this.drawIcon(this._actionArray[1].weapons()[0].iconIndex, 0, this.fittingHeight(0)); } else if (this._actionArray[1].meta.srpgWeapon) { this.drawIcon($dataWeapons[this._actionArray[1].meta.srpgWeapon].iconIndex, 0, this.fittingHeight(0)); } this.drawIcon(this._actionArray[1].currentAction().item().iconIndex, 0, this.fittingHeight(1)); this.drawText(this._actionArray[1].currentAction().item().name, Window_Base._iconWidth + this.padding, this.fittingHeight(1), this.windowWidth() - Window_Base._iconWidth); this.drawText('HP', this.windowWidth() / 2 - this.textWidth('HP') / 2, this.fittingHeight(2), this.textWidth('HP')); this.drawText(this._actionArray[1].hp, 0, this.fittingHeight(2), this.textWidth(this._actionArray[1].hp), 'left'); if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].currentAction() !== null) { this.drawText(this._targetArray[1].hp, this.windowWidth() - this.textWidth(this._targetArray[1].hp) - this.padding * 2, this.fittingHeight(2), this.textWidth(this._targetArray[1].hp), 'right'); } this.drawText('DMG', this.windowWidth() / 2 - this.textWidth('DMG') / 2, this.fittingHeight(3), this.textWidth('DMG')); if(this._actionArray[1].canUse(this._actionArray[1].currentAction().item())) { if(this._actionArray[1].currentAction().srpgPredictionDamage(this._targetArray[1]) !== 0) { this.drawText(this._actionArray[1].currentAction().srpgPredictionDamage(this._targetArray[1]), 0, this.fittingHeight(3), this.textWidth(this._actionArray[1].currentAction().srpgPredictionDamage(this._targetArray[1])), 'left'); } } if(this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { if(this._targetArray[1].currentAction().srpgPredictionDamage(this._actionArray[1]) != 0) { if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].currentAction() !== null) { this.drawText(this._targetArray[1].currentAction().srpgPredictionDamage(this._actionArray[1]), this.windowWidth() - this.padding * 2 - this.textWidth(this._actionArray[1].currentAction().srpgPredictionDamage(this._actionArray[1])), this.fittingHeight(3), this.textWidth(this._targetArray[1].currentAction().srpgPredictionDamage(this._actionArray[1])), 'right'); } } } this.drawText('HIT', this.windowWidth() / 2 - this.textWidth('HIT') / 2, this.fittingHeight(4), this.textWidth('HIT')); this.drawText(Math.round(100 * this._actionArray[1].currentAction().itemHit(this._targetArray[1])), 0, this.fittingHeight(4), this.textWidth(Math.round(100 * this._actionArray[1].currentAction().itemHit(this._targetArray[1]))), 'left'); if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { this.drawText(Math.round(this._targetArray[1].currentAction().itemHit(this._actionArray[1]) * 100), this.windowWidth() - this.padding * 2 - this.textWidth(Math.round(this._targetArray[1].currentAction().itemHit(this._actionArray[1]) * 100)), this.fittingHeight(4), this.textWidth(Math.round(this._targetArray[1].currentAction().itemHit(this._actionArray[1]) * 100)), 'right'); } this.drawText('CRIT', this.windowWidth() / 2 - this.textWidth('CRIT') / 2, this.fittingHeight(5), this.textWidth('CRIT')); this.drawText(Math.round(100 * this._actionArray[1].currentAction().itemCri(this._targetArray[1])), 0, this.fittingHeight(5), this.textWidth(Math.round(100 * this._actionArray[1].currentAction().itemCri(this._targetArray[1]))), 'left'); if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { this.drawText(Math.round(100 * this._targetArray[1].currentAction().itemCri(this._actionArray[1])), this.windowWidth() - this.padding * 2 - this.textWidth(Math.round(100 * this._targetArray[1].currentAction().itemCri(this._actionArray[1]))), this.fittingHeight(5), this.textWidth(Math.round(100 * this._targetArray[1].currentAction().itemCri(this._actionArray[1]))), 'right'); } if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { this.drawText(this._targetArray[1].currentAction().item().name, 0, this.fittingHeight(6), this.windowWidth() - Window_Base._iconWidth - this.padding * 3, 'right'); } if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].canUse(this._targetArray[1].currentAction().item())) { this.drawIcon(this._targetArray[1].currentAction().item().iconIndex, this.windowWidth() - Window_Base._iconWidth - this.padding * 2, this.fittingHeight(6)); }  if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].currentAction() !== null) { this.drawText(this._targetArray[1].name(), 0, this.fittingHeight(7), this.windowWidth() - Window_Base._iconWidth - this.padding * 3, 'right'); } if (this._actionArray[1] != this._targetArray[1] && this._targetArray[1].currentAction() !== null) { if (this._targetArray[1].isActor()) { this.drawIcon(this._targetArray[1].weapons()[0].iconIndex, this.windowWidth() - Window_Base._iconWidth * 2, this.fittingHeight(7)); } else if (this._targetArray[1].meta.srpgWeapon) { this.drawIcon($dataWeapons[this._targetArray[1].meta.srpgWeapon].iconIndex, this.windowWidth() - 2 * Window_Base._iconWidth, this.fittingHeight(7)); } }

### Background window image
We can make things nicer by using a background window image instead of the default window. This plugin comes built in sprites that the user can use: this._bust/this._bust2 and this._background/this._background2/this._background3
	- Before we add a background image, the window layer opacity should be set to 0 (this can be done via plugin parameter)
	- This plugin will make this._bust / this._background sprites invisible when a window (prediction or quick status) is inactivated. However, it is up to the user to create the sprite first and set its visible properties.
		- We can add this code to the contents lunatic code plugin parameter
		- To create a sprite, we can use the following code:
			- this._background = new Sprite(ImageManager.loadSystem('PredictionWindow'));
			- this.addChildAt(this._background, 1);
		- The above code will set the background sprite to an image in the /System/ folder with the name PredictionWindow
		- We can adjust the background sprite properties using the following parameters:
			- Anchor Points: This is where the image reference X,Y coordinates will be RELATIVE to the window
				- this._background.anchor.x = 0.5
				- this._background.anchor.y = 0.5 (this makes the 'center' of the image as the anchor point)
			- this._background.x = Graphics.boxWidth / 2  (this is relative to the WINDOW, so if x = 0, then it will be pinned to the top left of the WINDOW)
			- this._background.y = Graphics.boxHeight / 2
			- this._background.scale.x = -1 (this flips the image)
			- Other useful sprite functions:
				this._background.setBlendColor([r,g,b,a]) or setColorTone([r,g,b,a])
				this._background.visible = true/false
				this._background.setFrame (x, y, height, width) - Useful for spritesheets
		- Once our background sprite is set, a new sprite will be create whenever the code is run. This however will cause issues as duplicate sprites will be produced. We can fix this by checking if a background sprite exists or not; if it does then we simply set it to be visible (instead of creating a new one)
		- Full code (add to predictions lunatic code):
			- if(!this._background) { 
				this._background = new Sprite(ImageManager.loadSystem('PredictionWindow'));
				this.addChildAt(this._background, 1);
			} else {
				this._background = true;
			}
		- To try this example, copy the [PredictionWindow image](https://github.com/boomyville/RMMV/blob/master/SRPG%20Window/PredictionWindow.png) from this repository and use the fire emblem prediction code as discussed earlier in this document
	- The background sprite is designed to be a 'window'
	- The bust sprite is designed to be either the battler's face (easier to use drawActorFace function though) or custom bust (aka IrinaVisualNovelBust or Mog Window Effects)
	- The addChildAt(A, Z) is important for Z-layer properties. The lower the Z value, the further behind the sprite is. Bust Z = 2 and Background Z = 1 works well.

![Example](https://github.com/boomyville/RMMV/blob/master/SRPG%20Window/Example3.png?raw=true)
