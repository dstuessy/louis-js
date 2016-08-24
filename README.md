# louis.js

A simple, flexible, and light-weight JavaScript library for animations. The idea is to provide a library that can be applied to multiple scenarios: from HTML5 canvas game development to DOM manipulations for UI development.

A copy of the source file can be found under `src/louis.js`.


## Contents

- Create Animation
- Functions
- Options
- Browser Support
- Example


## Create Animation

Create an animation by using the global `Animate` function.

~~~ javascript
var animation = Animation(options);
~~~

- **Arguments**:
	- options: Object: An object with several options like `fps`; see the Options section for more info.


## Functions

### animate

~~~ javascript
var animation = Animation(options);
animation.animate(state);
~~~

This function starts the animation with a given state to start with -- the snippet above has that under variable `state`. The state can be of any given choice. This depends entirely on how the state will be manipulated in the `onTick` function; see onTick under the Options section.

## Terminate

~~~ javascript
return Animation.Terminate(state);
~~~

This function wraps the given state object in one that also tells the animation loop to terminate. Use this if the animation should terminate in the `onTick` function; see onTick under the Options section.

## Continue

~~~ javascript
return Animation.Continue(state);
~~~

This function wraps the given state object in one that also tells the animation loop to continue. Use this if the animation should continue in the `onTick` function; see onTick under the Options section.


## Options

### fps

~~~ javascript
Animation({
	fps: Number
});
~~~

Number of frames per second for the animation. This has no default value.

- **Type**: Number

### onStart

~~~ javascript
Animation({
	onStart: function(state) {}
});
~~~

Function to execute just before animation starts the first frame/tick. No alterations of state can happen here.

- **Type**: Function
- **Arguments**:
	- state: Object: The initial state of the animation.

### onTick

~~~ javascript
Animation({
	onTick: function(state) {}
});
~~~

This is the function that alters the state of the animation on each frame/tick. Without alteration of state, the animation simply won't occur.

To stop or continue the animation, return the altered state of the animation using `Animation.Terminate` and `Animation.Continue`, respectively.

- **Type**: Function
- **Arguments**:
	- state: Object: The current state of the animation.
- **Returns**:
	- Object: Either return the altered state through `Animation.Terminate` or `Animation.Continue` to terminate or continue the animation, respectively.

### draw

~~~ javascript
Animation({
	draw: function(state) {}
});
~~~

Draw the current state of the animation to either the DOM or Canvas -- pick your poison!

- **Type**: Function
- **Arguments**:
	- state: Object: The current state of the animation.

### onEnd

~~~ javascript
Animation({
	onEnd: function(state) {}
});
~~~

This function is called right after the last frame/tick has happened. No alterations of state can happen here.

- **Type**: Function
- **Arguments**:
	- state: Object: The final state of the animation.


## Browser Support

This has been written for Browsers only at the time being.

- IE9+
- Latest Firefox
- Latest Chrome

Functions used are from IE9+, so this should hopefully work on any reasonably modern browsers.


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
