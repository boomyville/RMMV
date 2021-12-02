# Useful parameters
Detailed below is a list of javascript code parameters that can be used to help construct your windows
Some parameters also include a 'console' value that allows you to determine the default/current value in your project by entering it in the console
To open the console, press F12 
I have also ranked parameters based on my subjective opinion on usefulness (bold = important)
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



