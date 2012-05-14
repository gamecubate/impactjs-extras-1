/*
EntityPropertyJoystick

This entity sets the named property of an object to its current value

Keys for Weltmeister:

propHolder
	Specifies name of property holder

propName
	Name of property this slider affects

propKeys

minValues
	Minimum value for property

maxValues
	Max value for property
*/

ig.module(
	'game.entities.property-joystick'
)
.requires(
	'game.entities.property-slider'
)
.defines(function(){


EntityPropertyJoystick = EntityPropertySlider.extend({
	
	size: {x:72, y:72},

	propKeys: {},
	values: {},
	minValues: {},
	maxValues: {},

	setupIf: function()
	{
		if (this.propHolder && typeof(this.propHolder == 'object') &&
			this.propName && typeof(this.propName == 'object') &&
			this.propKeys['1'] &&
			this.propKeys['2']
			)
		{
			var ent = ig.game.getEntityByName(this.propHolder);
			this.values['1'] = ent[this.propName][this.propKeys['1']];
			this.values['2'] = ent[this.propName][this.propKeys['2']];
			this.minValues['1'] = (this.minValues['1'] == undefined) ? 0 : this.minValues['1'];
			this.minValues['2'] = (this.minValues['2'] == undefined) ? 0 : this.minValues['2'];
			this.maxValues['1'] = (this.maxValues['1'] == undefined) ? 0 : this.maxValues['1'];
			this.maxValues['2'] = (this.maxValues['2'] == undefined) ? 0 : this.maxValues['2'];
			this.enabled = true;
		}
	},

	touchMovedIf: function()
	{
		var p = {x:ig.input.mouse.x, y:ig.input.mouse.y};
		if (p.x != this.last.x || p.y != this.last.y)
		{
			this.last = p;
			
			this.values['1'] = p.x.map(this.pos.x, this.pos.x+this.size.x, this.minValues['1'], this.maxValues['1']);
			this.values['2'] = p.y.map(this.pos.y, this.pos.y+this.size.y, this.minValues['2'], this.maxValues['2']);
			
			var roundFactor1 = (this.maxValues['1']-this.minValues['1'] <= 20) ? 1 : 0;
			var roundFactor2 = (this.maxValues['2']-this.minValues['2'] <= 20) ? 1 : 0;
			
			this.values['1'] = this.values['1'].round(roundFactor1).limit(this.minValues['1'], this.maxValues['1']);
			this.values['2'] = this.values['2'].round(roundFactor2).limit(this.minValues['2'], this.maxValues['2']);
			
			var ent = ig.game.getEntityByName(this.propHolder);
			ent[this.propName][this.propKeys['1']] = this.values['1'];
			ent[this.propName][this.propKeys['2']] = this.values['2'];
		}
	},

	// Helpers
	drawLabel: function()
	{
		var ent = ig.game.getEntityByName(this.propHolder);
		var prop = ent[this.propName];
		var key1 = this.propKeys['1'];
		var key2 = this.propKeys['2'];
		var val1 = prop[key1];
		var val2 = prop[key2];

		// Draw label
		var title = this.propName + '\n' + val1 + ', ' + val2;
		var margin = 2;
		var x = this.pos.x -ig.game.screen.x +margin;
		var y = this.pos.y -ig.game.screen.y +margin;
		this.font.draw(title, x, y, ig.Font.ALIGN.LEFT);
	},

	drawCursor: function ()
	{
		var ent = ig.game.getEntityByName(this.propHolder);
		var prop = ent[this.propName];
		var key1 = this.propKeys['1'];
		var key2 = this.propKeys['2'];
		var val1 = prop[key1];
		var val2 = prop[key2];

		var ent = ig.game.getEntityByName(this.propHolder);
		var val = ent[this.propName];

		var w = 8;
		var h = 8;
		
		var offsetX = val1.map(this.minValues['1'], this.maxValues['1'], 0, this.size.x);
		var x = (this.pos.x +offsetX -ig.game.screen.x) *ig.system.scale - w/2;
		x = x.round();

		var offsetY = val2.map(this.minValues['2'], this.maxValues['2'], 0, this.size.y);
		var y = (this.pos.y +offsetY -ig.game.screen.y) *ig.system.scale - h/2;
		y = y.round();

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