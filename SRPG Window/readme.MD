# Useful parameters
Detailed below is a list of javascript code parameters that can be used to help construct your windows. Some parameters also include a 'console' value that allows you to determine the default/current value in your project by entering it in the console.
To open the console, press F12. I have also ranked parameters based on my subjective opinion on usefulness (bold = important)
## Window properties
- **Window Padding**: this.padding 
	- This is the space within a window that is set as a margin
	- More less padding = contents drawn closer to the edge of the window
	- Modifiable by YEP_Core
	- console: SceneManager._scene._windowLayer.children[0].padding
- Text Padding: this.textPadding()
	- This is the space between text elements
	- More less padding = text elements drawn closer together
	- Modifiable by YEP_Core
	- console: SceneManager._scene._windowLayer.children[0].textPadding()
	- Kind of useless for windows 
- **Fitting Height**: this.fittingHeight(X)
	- X is the row number
	- Returns a height in pixels 
	- This value is basically lineHeight * X + 2 x padding
	- This is useful in that it automatically calculates the window padding for the developer
	- console: SceneManager._scene._windowLayer.children[0].fittingHeight(X)
- **Line Height**: this.lineHeight()
	- Returns the height of a line of text in pixels
	- Modifiable by YEP_Core
	- console: SceneManager._scene._windowLayer.children[0].lineHeight()
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
- this._activeArray[1] (Prediction window Only)
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



 
	


