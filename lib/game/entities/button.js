/*
EntityButton

This entity spawns entities of a certain type at specific intervals.

Keys for Weltmeister:

title
	Specifies button text
	
state
	Initial state of button
	Default: ON

isToggle
	Specifies whether button changes state after a release
	Default: false

onPressed
	Specifies method(s) to invoke in target(s) when button is pressed

onReleased
	Specifies method(s) to invoke in target(s) when button is released

target.1..n
	Specifies name(s) of target(s)
	
onColor
	Specifies fillColor when button state is ON
	
offColor
	Specifies fillColor when button state is OFF
	
highlightColor
	Specifies fillColor when button is pressed
*/

ig.module(
	'game.entities.button'
)
.requires(
	'impact.entity',
	'plugins.gamecubate.drawn',
	'plugins.gamecubate.hit-test',
	'impact.font'
)
.defines(function(){


ig.ButtonState = {
	OFF: 0,
	ON: 1
};


EntityButton = ig.Entity.extend({
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(128, 255, 128, 0.2)',
	
	font: new ig.Font('media/04b03.font.png'),

	size: {x:24, y:24},
	offset: {x:0, y:0},
	gravityFactor: 0,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,

	state: ig.ButtonState.OFF,
	isToggle: false,
	onPressed: null,
	onReleased: null,
	onColor: null,
	offColor: null,
	highlightColor: 'rgba(255,255,255,0.5)',
	highlighted: false,

	init: function(x, y, settings)
	{
		this.parent(x, y, settings);

		if (settings.state != undefined)
			this.state = ig.ButtonState[settings.state.toUpperCase()];

		if (! this.offColor) this.offColor = this.fillColor;
		if (! this.onColor) this.onColor = this.highlightColor;
	},
	
	ready: function()
	{
		ig.input.bind( ig.KEY.MOUSE1, 'mouse1' );
	},
	
	update: function()
	{
		// check for and react to touch downs, moved, and ended
		// touch down: highlight this if touch is in bounds
		// touch moved: highlight if in bounds, else unhighlight
		// touch ended: if in bounds, callback

		if (ig.input.pressed('mouse1'))
			this.touchBeganIf();
		else if (this.tracking && ig.input.released('mouse1'))
			this.touchEnded();
		else if (this.tracking)
			this.touchMovedIf();
	},
	
	touchBeganIf: function()
	{
		var p = {x:ig.input.mouse.x, y:ig.input.mouse.y};
		if (this.hitTest(p.x, p.y))
		{
			this.tracking = true;
			this.setHighlighted(true);
			this.fire(this.onPressed);
			this.last = {x:ig.input.mouse.x, y:ig.input.mouse.y};
		}
	},

	touchMovedIf: function()
	{
		var p = {x:ig.input.mouse.x, y:ig.input.mouse.y};
		if (p.x != this.last.x || p.y != this.last.y)
		{
			this.setHighlighted(this.hitTest(p.x, p.y));
			this.last = p;
		}
	},

	touchEnded: function()
	{
		if (this.tracking)
		{
			var p = {x:ig.input.mouse.x, y:ig.input.mouse.y};
			if (this.hitTest(p.x, p.y))
			{
				this.setHighlighted(false);
				this.fire(this.onReleased);
				if (this.isToggle)
					this.state = this.state == ig.ButtonState.OFF ? ig.ButtonState.ON : ig.ButtonState.OFF;
				this.fillColor = this.state == ig.ButtonState.OFF ? this.offColor : this.onColor;
			}
			this.tracking = false;
		}
	},
	
	draw: function ()
	{
		this.parent();

		if (this.visible && this.title)
			this.font.draw(
				this.title,
				this.pos.x-ig.game.screen.x+this.size.x/2,
				this.pos.y-ig.game.screen.y+this.size.y/2-this.font.height/2,
				ig.Font.ALIGN.CENTER);
	},

	// Helpers
	setHighlighted: function(flag)
	{
		if (flag != this.highlighted)
		{
			this.fillColor = flag ? this.highlightColor : (this.state == ig.ButtonState.OFF ? this.offColor : this.onColor);
			this.highlighted = flag;
		}
	},

	fire: function(action)
	{
		if (! action)
			return;
			
		//ig.log('button.fire: ' + action);

		if (this.target && typeof(this.target) == 'object')
		{
			for (var t in this.target)
			{
				var ent = ig.game.getEntityByName(this.target[t]);

				if (ent && typeof(ent[action]) == 'function')
					ent[action].call(ent);
			}
		}
		else
		{
			if (typeof(ig.game[action]) == 'function')
			{
				ig.game[action].call(ig.game);
			}
		}
	},
});
});