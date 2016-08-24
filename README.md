# louis.js

A simple, flexible, and light-weight JavaScript library for animations. The idea is to provide a library that can be applied to multiple scenarios: from HTML5 canvas game development to DOM manipulations for UI development.

A copy of the source file can be found under `src/louis.js`.

## Example

For a working example, see the `index.html` file.

~~~ javascript

// This element is going to be animated
el = document.querySelector('.animateMe');

// Define an animation
a = Animation({
	fps: 100,
	// define code to run just before first tick of animation
	onStart: function(state) {
		console.log('starting');
	},
	// define what happens on an animation tick (a.k.a. frame)
	onTick: function(state, delta) {
		var el = state.el;
		var acceleration = state.acceleration;
		var velocity = state.velocity + acceleration;
		var topLimit = 500;
		var top = Math.min(state.top + velocity, topLimit);
		var state = {
			el: el,
			top: top,
			acceleration: acceleration,
			velocity: velocity
		};

		if (top >= topLimit) {
			return Animation.Terminate(state);
		} else {
			return Animation.Continue(state);
		}
	},
	// define how the animation's state is drawn
	draw: function(state) {
		var el = state.el;
		var top = state.top;

		el.style.top = top + 'px';
	},
	// define code to run just after the last tick of animation
	onEnd: function(state) {
		console.log('finished!', state.velocity, state.el.style.top);
	}
});

// animate the animation
a.animate({
	el: el,
	top: parseInt(el.style.top) || 0,
	acceleration: 0.002,
	velocity: 0
});
~~~
