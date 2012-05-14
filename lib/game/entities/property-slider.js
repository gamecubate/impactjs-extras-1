/*
EntityPropertySlider

This entity sets the named property of an object to its current value

Keys for Weltmeister:

propHolder
	Specifies name of property holder

propName
	Name of property this slider controls

minValue
	Minimum value for property

maxValue
	Max value for property
*/

ig.module(
	'game.entities.property-slider'
)
.requires(
	'impact.entity',
	'plugins.gamecubate.drawn',
	'plugins.gamecubate.hit-test',
	'impact.font'
)
.defines(function(){


EntityPropertySlider = ig.Entity.extend({
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255,255,255,0.3)',

	fillColor: 'rgba(0,0,0,0.3)',
	cursorColor: 'rgba(255,0,0,1)',

	font: new ig.Font('media/04b03.font.png'),

	size: {x:24, y:120},
	offset: {x:0, y:0},
	gravityFactor: 0,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,

	propHolder: null,
	propName: null,
	minValue: undefined,
	maxValue: undefined,
	value: undefined,

	enabled: false,

	init: function(x, y, settings)
	{
		this.parent(x, y, settings);
		if (ig.global.wm)
			this.setupIf();
	},
	
	ready: function()
	{
		ig.input.bind(ig.KEY.MOUSE1, 'mouse1');
		if (! ig.global.wm)
			this.setupIf();
	},

	setupIf: function()
	{
		if (this.propHolder && typeof(this.propHolder == 'object') &&
			this.propName && typeof(this.propName == 'string'))
		{
			var ent = ig.game.getEntityByName(this.propHolder);
			this.value = ent[this.propName];
			this.minValue = (this.minValue == undefined) ? 0 : this.minValue;
			this.maxValue = (this.maxValue == undefined) ? this.value*10 : this.maxValue;
			this.enabled = true;
		}
	},

	update: function()
	{
		// check for and react to touch downs, moved, and ended
		// touch down: highlight this if touch is in bounds
		// touch moved: highlight if in bounds, else unhighlight
		// touch ended: if in bounds, callback

		if (this.enabled)
		{
			if (ig.input.pressed('mouse1'))
				this.touchBeganIf();
			else if (this.tracking && ig.input.released('mouse1'))
				this.touchEnded();
			else if (this.tracking)
				this.touchMovedIf();
		}
	},
	
	touchBeganIf: function()
	{
		var p = {x:ig.input.mouse.x, y:ig.input.mouse.y};
		if (this.hitTest(p.x, p.y))
		{
			this.tracking = true;
			this.last = {x:ig.input.mouse.x, y:ig.input.mouse.y};
		}
	},

	touchMovedIf: function()
	{
		var p = {x:ig.input.mouse.x, y:ig.input.mouse.y};
		//console.log('p.x = ' + p.x + ' size.x = ' + this.size.x);
		if (p.x != this.last.x || p.y != this.last.y)
		{
			this.last = p;
			
			this.value = p.x.map(this.pos.x, this.pos.x+this.size.x, this.minValue, this.maxValue);
			var roundFactor = (this.maxValue-this.minValue <= 20) ? 1 : 0;
			this.value = this.value.round(roundFactor).limit(this.minValue, this.maxValue);
			
			var ent = ig.game.getEntityByName(this.propHolder);
			ent[this.propName] = this.value;
		}
	},

	touchEnded: function()
	{
		if (this.tracking)
		{
			this.tracking = false;
		}
	},
	
	// Helpers
	draw: function ()
	{
		this.parent();
		if (this.visible && this.enabled)
		{
			this.drawLabel();
			this.drawConnectionsIf();
			this.drawCursor();
		}
	},
	
	drawLabel: function()
	{
		var ent = ig.game.getEntityByName(this.propHolder);
		var val = ent[this.propName];

		// Draw label
		var title = this.propName + '\n' + val;
		var margin = 2;
		var x = this.pos.x -ig.game.screen.x +margin;
		var y = this.pos.y -ig.game.screen.y +margin;//ig.system.getDrawPos(this.pos.y);
		this.font.draw(title, x, y, ig.Font.ALIGN.LEFT);
	},
	
	drawConnectionsIf: function()
	{
		var ent = ig.game.getEntityByName(this.propHolder);

		if (ig.global.wm && ent)
			this.drawLineTo(ent, this.fillColor, 1);
	},
	
	drawCursor: function()
	{
		var ent = ig.game.getEntityByName(this.propHolder);
		var val = ent[this.propName];

		var w = 1;
		var offsetX = val.map(this.minValue, this.maxValue, 0, this.size.x);
		var x = (this.pos.x +offsetX -ig.game.screen.x) *ig.system.scale;
		x = x.round();
		
		var h = this.size.y *ig.system.scale;
		var y = (this.pos.y -ig.game.screen.y) *ig.system.scale;

		this.fillRect (x, y, w, h, this.cursorColor);
	},
	
	saveTo: function(aStore)
	{
		var ent = ig.game.getEntityByName(this.propHolder);
		aStore.set(this.propName, ent[this.propName]);
	},
	
	loadFrom: function(aStore)
	{
		var ent = ig.game.getEntityByName(this.propHolder);
		ent[this.propName] = aStore.get(this.propName);
	},
});
});