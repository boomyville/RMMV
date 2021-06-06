# SRPG AoE Group Animation
Requires SRPG_AoE.js and Yanfly Battle Engine

This script changes the how AoE animations are shown in non-map battle scenarios. Normally an AoE skill with multiple targets will involve multiple 1 vs 1 battles played out.
This script combines all targets onto 1 battle scene for a 1 vs many scenario.

![](https://github.com/boomyville/RMMV/blob/master/SRPG_AoEAnimation/WIP.gif)

This script works with allies, enemies and allies + self
Counter attack only applies to the primary target (which is the target that is displayed in srpgPredictionWindow). 
The primary target cannot really be changed by the user unless they move the AoE area to not include the primary target
Requires skills to target "all enemies" or "all allies" otherwise it will just target the primary target
Animation can be set to screen or individual
This script also removes the target's battle hud if there's more than 1 target to avoid confusion

Incompatabilties:
Doesn't like SRPG_DirectionMod.js though that script is probably way outdated now
