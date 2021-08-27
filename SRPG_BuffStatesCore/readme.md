A very simple plug and play plugin that extends Yanfly's Buff and States Core to be used with SRPG_core.js
Adds the two notetags to states: <Custom SRPG Phase Start Effect> <Custom SRPG Phase End Effect>
Code is run when each team's turns starts or ends. This is different to Yanfly's implementation of <Custom Battle/Turn End Effect> which runs at the end of a unit's battle/turn
This code does not fix the incompatability with Yanfly's Buff and States Core and srpg_core.js when <Custom Battle/Turn End Effect> is run 
