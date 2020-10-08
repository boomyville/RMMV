# What does this do?

It simply resets an event's move speed, walking animation status and stepping animation status.
It requires srpg_core.js and Dr Q's SRPG_PositionEffect.js script
It rewrites two functions in srpg_core to store the event's data and then reset it after an action
This is to be used with the SRPG engine 

# Why would I want this?

You can manipulate an events movement speed with the damage formula (or Yanfly Skill Core)
However, this happens instantaneously; therefore any changes such as changing an event's speed are either pernament or completely reset
For example: We want to create a "rush" skill where the user moves towards the target at great speed and then attacks the unit
We would normally do this via the following process: a.event().setMoveSpeed(7); a.forward(x); a.event().setMoveSpeed(5); damage formula; 
Unfortunately; if we do this, setMoveSpeed(7) and  setMoveSpeed(5) happen instanteously, which means the unit moves to the target at speed 5 not 7
If we omit  setMoveSpeed(5), then the unit will be pernamently set at move speed 7 for the rest of the battle
If we use Yanfly Skill core, we have the same issue as <After Eval> occur prior to a.forward(x) command finishing

The fix is to make srpg_Core reset movespeed at the end of an action (which happens once a.forward(x) AND battle sequence completes)
This results in the following:

![](https://github.com/boomyville/RMMV/blob/master/SRPG%20Event%20Reset%20After%20Action/Rush_Skill.gif?raw=true) 

# How to create a rush skill

I recommend the following notetags (requires SRPG_RangeControl.js)
<srpgRange:X>
<specialRange:rook>  
<srpgMinRange:1> 
<srpgLoS>
<throughObject:false>
<throughFriend:false>
<throughOpponent:false> 
<doubleAction: false>

Skill setup:
No animation set
100% success rate (if attack fails, unit does not move at all)

If you do not use Yanfly Skill core, then you will the following damage formula:
if(!$gameTemp.isPrediction()) { a.event().setMoveSpeed(8); a.event().setWalkAnime(false); a.event().setStepAnime(false); a.push(b, 1); a.forward(X); b.event().requestAnimation(Y; } a.atk - b.def;

This will make the unit move X units in a straight line,push the target back 1 square and play animation Y on the enemy
I prefer using requestAnimation over using a skill animation as skill animation occurs first whereas requestAnimation will happen during the rush movement

If you use Yanfly Skill core, then the damage formula will be your regular damage formula and use the following notetags:

<Before Eval>
a.event().setMoveSpeed(8); 
a.event().setWalkAnime(false); 
a.event().setStepAnime(false); 
a.push(b, 1); 
a.forward(X); 
</Before Eval>

<Post-Damage Eval>
b.event().requestAnimation(Y);
</Post-Damage Eval>

This results in movement towards the target  always happening even if the skill "misses" 

By having this script active, the user's move speed and character animation will be reset; that is  a.event()._moveSpeed, a.event()._stepAnime and  a.event()._walkAnime values.
moveSpeed controls how fast the unit moves. Above 8 makes movement near instanteous (in which case just use teleport function provided by srpg_PositionEffects.js)
Setting walkAnime and stepAnime to false means the unit "freezes" and does not cycling through its walking animation. You could omit this but it kinda looks funny
