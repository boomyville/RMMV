//=============================================================================
// SRPG_EquipItemsCompatability.js
//=============================================================================

/*:
 * @plugindesc Makes GALV's Actor Equip Items script compatabile with SRPG. Put this below GALV_ActorEquipItems.js. Also disable item menu in battle!
 *
 * @author Boomy 
 * 
 */
//===============================================================
// Parameter Variables
//===============================================================
(function () {
	
	//Find GALV at https://galvs-scripts.com/
	
	//====================================================================================================================
    // Overwritten function: Item compatability with GALV_ActorEquipItems.js 
    //====================================================================================================================
    // Changes how items are counted (and where they are selected from) when in SRPG mode to enable compatability 
    // #Boomy
    //====================================================================================================================	   
	Scene_Battle.prototype.onItemOk = function() {
		var item = this._itemWindow.item();
		var action = BattleManager.inputtingAction();
		var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
		action.setActorEquipItem(actor,this._itemWindow._index);
		$gameParty.setLastItem(item);
		this.onSelectAction();
		this._itemWindow.hide();
		this.startActorTargetting(); 	
	};
	Window_ItemList.prototype.makeActorItemList = function () {
		this._data = [];
		// SRPG EDIT START
		if ($gameSystem.isSRPGMode()) {
			var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
		} else {
			var actor = $gameParty.members()[BattleManager._actorIndex];
		}
		// SRPG EDIT END
		for (var i = 0; i < actor._equipItemSlots.length; i++) {
			this._data[i] = actor._equipItemSlots[i].object();
		};
	};
	Window_Selectable.prototype.drawActorItemNumber = function (item, x, y, width) {
		// SRPG EDIT START
		if ($gameSystem.isSRPGMode()) {
			var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
		} else {
			var actor = $gameParty.members()[BattleManager._actorIndex];
		}
		// SRPG EDIT END
		var itemSlot = actor._equipItemSlots[this._iIteration];
		var txt = itemSlot.amount + "/" + item.actorStack;
		this.drawText(txt, x, y, width, 'right');
	};
	Window_BattleItem.prototype.isEnabled = function (item) {
		if (!item) return false;
		// SRPG EDIT START
		if ($gameSystem.isSRPGMode()) {
			var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
		} else {
			var actor = $gameParty.members()[BattleManager._actorIndex];
		}
		// SRPG EDIT END
		return actor && actor.meetsUsableItemConditions(item);
	};
})();
