## PinTrigger and Blocker

* PinTrigger: This entity calls the triggeredBy method of one or more
  targets when it and another entity of a specific collision type overlap at
  the almost-same position.
* Blocker: This entity stops the movement of all all triggering entities
  and releases them after a specified duration.

### Installation
* Put these into your lib/game/entities folder. Be careful to not overwrite existing files.
* Read the source code headers to better understand usage and options.

### Sample project
* http://www.gamecubate.com/playground/pin_triggers_and_blockers .


## Button, Property Slider, and Property Joystick

* Button: 
* PropertySlider: 
* PropertyJoystick: 

### Installation
* Put these into your lib/game/entities folder. Be careful to not overwrite existing files.
* Read the source code headers to better understand usage and options.

### Sample project
* http://www.gamecubate.com/playground/player_test_rig .


## Automata

* AutomataBase: provides base functionality for cellular automata subclasses.
* Conway: Game of Life automaton.
* Shifter: this entity kills/births cells according to a direction function supplied by the client. The function decides, given a row and column, in which direction to shift a cell.

### Installation
* Put into your lib/plugins/gamecubate/automata/ folder. Be careful to not overwrite existing files.
* Read the source code headers to better understand usage and options.

### Sample project
* http://www.gamecubate.com/playground/automata_plugin_demo.


# Info
* Created by Alexandre Rousseau for [gamecubate](http://www.gamecubate.com)
* Use at will and at own risk.
* You can reach me by email (alexr at gamecubate dot com) or via the Impact
  forums (alexandre).
