
	- this.drawText(this._battler.name(), Window_Base._faceWidth + this.padding, 0, Window_Base._faceWidth)
- To place the unit's HP, we will use a simple this.drawText function
	- text will be this._battler.hp + "/" + this._battler.mhp
	- x will be Window_Base._faceWidth + this.padding (to the right side of the face graphic)
	- y will be 1/3rd down of the status window this.windowHeight() / 3
	- width will be a face width of Window_Base._faceWidth
	- this.drawText(this._battler.hp + "/" + this._battler.mhp, Window_Base._faceWidth + this.padding, this.windowHeight() / 3, Window_Base._faceWidth)
- To draw the HP Gauge, we will use a drawGauge function	
	- x will be Window_Base._faceWidth + this.padding (to the right side of the face graphic)
	- y will be 1/2 down of the status window this.windowHeight() / 2
	- width will be a face width of Window_Base._faceWidth
	- rate will be a float value between 0 and 1 representing "% health left". RMMV gives us the this._battler.hpRate() function
	- colour1 will be a hexadecimal colour of red (#ff0000)
	- colour2 will be a hexadecimal colour of green (#00ff00)
	- this.drawGauge( Window_Base._faceWidth + this.padding, this.windowHeight() / 2, Window_Base._faceWidth, this._battler.hpRate(), '#ff0000', '#00ff00')
- We combine all these functions into one line (separate each line with semi-colon) to get: 
	this._battler.isActor() ? this.drawActorFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight) : this.drawEnemyFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight);
	this.drawText(this._battler.name(), Window_Base._faceWidth + this.padding, 0, Window_Base._faceWidth);
	this.drawText(this._battler.hp + "/" + this._battler.mhp, Window_Base._faceWidth + this.padding, this.windowHeight() / 3, Window_Base._faceWidth);
	this.drawGauge( Window_Base._faceWidth + this.padding, this.windowHeight() / 2, Window_Base._faceWidth, this._battler.hpRate(), '#ff0000', '#00ff00');
- I use notepad++ as well as ctrl + J to remove all line breaks.
- If you want to align the HP and battler name text to the right, you can add 'right' as a final parameter to the drawText function 
- Use the following code to test your code in the game on the fly using the console:
	PluginManager.parameters("SRPG_Window")["Prediction Window Contents Lunatic Code"] = "this._battler.isActor() ? this.drawActorFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight) : this.drawEnemyFace(this._battler, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight); 	this.drawText(this._battler.name(), Window_Base._faceWidth + this.padding, 0, Window_Base._faceWidth, 'right'); 	this.drawText(this._battler.hp + '/' + this._battler.mhp, Window_Base._faceWidth + this.padding, this.windowHeight() / 3, Window_Base._faceWidth, 'right'); 	this.drawGauge( Window_Base._faceWidth + this.padding, this.windowHeight() / 2, Window_Base._faceWidth, this._battler.hpRate(), '#FF0000', '#00FF00');"

 
	


