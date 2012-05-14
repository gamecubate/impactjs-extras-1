ig.module( 
	'plugins.gamecubate.automata.shifter'
)

.requires(
	'plugins.gamecubate.automata.automata-base'
)

.defines(function(){

	Shifter = AutomataBase.extend({

	directionFunction: function (col, row)
	{
		return {hdir:0, vdir:0};
	},
		
	/*
	Rules
	=====
	At each step, the following transitions occur:
	
	- odd numbered (base 0) row cells are shifted left, even ones are shifted right
	- odd numbered (base 0) column cells are shifted up, even ones are shifted down
	*/

	step: function ()
	{
		// make a working copy of population data
		var nextStates = ig.copy(this.data);
	
		// iterate
		for (var row=0; row<this.rows; row++)
		{
			for (var col=0; col<this.cols; col++)
			{
				var hdir = this.directionFunction (row, col).hdir;
				var vdir = this.directionFunction (row, col).vdir;
				
				var nextCol = col + hdir;
				var nextRow = row + vdir;
				
				if (hdir > 0)
					nextCol = (nextCol < this.cols) ? nextCol : 0;
				else if (hdir < 0)
					nextCol = (nextCol < 0) ? this.cols-1 : nextCol;

				if (vdir > 0)
					nextRow = (nextRow < this.rows) ? nextRow : 0;
				else if (vdir < 0)
					nextRow = (nextRow < 0) ? this.rows-1 : nextRow;

				var state = this.stateAt (col, row);
				nextStates[nextRow][nextCol] = state;
			}
		}
	
		this.data = ig.copy(nextStates);
	
		return this.data;
	}
});
});
