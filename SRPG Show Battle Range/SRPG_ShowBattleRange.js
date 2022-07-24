//=============================================================================
// SRPG_ShowBattleRange.js
//=============================================================================
/*:
 * @plugindesc Creates a new function $gameSystem.rangeTableTeam(team) that displays tiles that the specified team can traverse
 * Accepts "actor" or "enemy" as valid teams
 * Tiles which can be traversed by multiple team members will be shown in a slightly darker colour
 * Relies on existing makeRangeTable functions that srpg_core.js provides
 * 
 * The best way to use it is to bind a common event button or keypress to call the $gameSystem.rangeTableTeam(team)  function
 * To clear the highlighted square, use the $gameTemp.clearMoveTable() function 
 *
 * @author Boomy 
 * 
 */
(function () {
    Game_System.prototype.SrpgEnemiesList = function () {
        var i;
        var array = [];
        for (i = 0; i < $gameSystem._EventToUnit.length; i++) {
            if (typeof $gameSystem._EventToUnit[i] !== 'undefined') {
                if ($gameSystem._EventToUnit[i] !== null) {
                    if ($gameSystem._EventToUnit[i][0] == "enemy") {
                        if (typeof $gameSystem._EventToUnit[i][1].event !== undefined) {
                            if ($gameSystem._EventToUnit[i][1].event()) {
                                array.push($gameSystem._EventToUnit[i][1]);
                            }
                        }
                    }
                }
            }
        }
        return array;
    };
    Game_System.prototype.SrpgActorsList = function () {
        var i;
        var array = [];
        for (i = 0; i < $gameSystem._EventToUnit.length; i++) {
            if (typeof $gameSystem._EventToUnit[i] !== 'undefined') {
                if ($gameSystem._EventToUnit[i] !== null) {
                    if ($gameSystem._EventToUnit[i][0] == "actor") {
                        if (typeof $gameActors.actor($gameSystem._EventToUnit[i][1]).event !== undefined) {
                            if ($gameActors.actor($gameSystem._EventToUnit[i][1]).event()) {
                                array.push($gameActors.actor($gameSystem._EventToUnit[i][1]));
                            }
                        }
                    }
                }
            }
        }
        return array;
    };
    //====================================================================================================================
    // New function: rangeTableTeam
    //====================================================================================================================
    // Create range table for teams (ally or enemy)
    // #Boomy
    //====================================================================================================================	
    Game_System.prototype.srpgMakeMoveTableTeam = function (team) {
        var a = [];
        if (team == "actor") {
            $gameTemp.clearMoveTable();
            for (var i = 0; i < $gameSystem.SrpgActorsList().length; i++) {
                if ($gameSystem.SrpgActorsList()[i]) {
                    var battlerArray = $gameSystem.SrpgActorsList()[i];
                    var event = $gameSystem.SrpgActorsList()[i].event();
                    $gameTemp.setActiveEvent(event);
                    $gameTemp.clearMoveTable();
                    $gameTemp.initialMoveTable(event.posX(), event.posY(), battlerArray.srpgMove());
                    event.makeMoveTable(event.posX(), event.posY(), battlerArray.srpgMove(), [0], battlerArray.srpgThroughTag());
                    var list = $gameTemp.moveList();
                    a = a.concat(list);
                }
            }
        } else if (team == "enemy") {
            $gameTemp.clearMoveTable();
            for (var i = 0; i < $gameSystem.SrpgEnemiesList().length; i++) {
                if ($gameSystem.SrpgEnemiesList()[i]) {
                    var battlerArray = $gameSystem.SrpgEnemiesList()[i];
                    var event = $gameSystem.SrpgEnemiesList()[i].event();
                    $gameTemp.setActiveEvent(event);
                    $gameTemp.clearMoveTable();
                    $gameTemp.initialMoveTable(event.posX(), event.posY(), battlerArray.srpgMove());
                    event.makeMoveTable(event.posX(), event.posY(), battlerArray.srpgMove(), [0], battlerArray.srpgThroughTag());
                    var list = $gameTemp.moveList();
                    a = a.concat(list);
                }
            }
        }
        var b = a.filter((item, pos) => a.indexOf(item) === pos);
        $gameTemp._MoveList = b;
        return b;
    };
})();
