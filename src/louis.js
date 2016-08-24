/*jslint
    fudge,
    white: true
*/
(function () {
    'use strict';

    function partial(fn, args) {
        return function partiallyApplied() {
            var moreArgs = Array.prototype.slice.call(/*ignoreme*/arguments, /*ignoreme*/0);
            return fn.apply(null, args.concat(moreArgs));
        };
    }

    // dummy function to do 'no operation'
    function noop() {
        return undefined;
    }

    function now() {
        return Date.now();
    }

    function timePerTick(fps) {
        return 1000 / fps;
    }

    function delta(currentTime, previousTickTime) {
        return currentTime - previousTickTime;
    }

    function Terminate(state) {
        return {
            state: state,
            terminated: true
        };
    }

    function Continue(state) {
        return {
            state: state,
            terminated: false
        };
    }

    function Accumulator(tickFn, fps, startTime) {
        var accumulatedTime = 0;
        var previousTime = startTime;

        return function accumulate(currentTime, tickResult) {

            accumulatedTime += delta(currentTime, previousTime);

            while (accumulatedTime >= timePerTick(fps) && !tickResult.terminated) {
                tickResult = tickFn(tickResult.state, delta(currentTime, previousTime));
                accumulatedTime -= timePerTick(fps);
            }

            return tickResult;
        };
    }

    function tick(previousResult, previousTickTime, fps, accumulator, draw, onEnd) {
        var tickResult = accumulator(now(), previousResult),
            deltaTime = delta(now(), previousTickTime),
            isItNextTick = deltaTime >= timePerTick(fps);

        if (isItNextTick || tickResult.terminated) {
            draw(tickResult.state);
            previousTickTime = now();
        }

        if (tickResult.terminated) {
            onEnd(tickResult.state);
        } else {
            requestAnimationFrame(partial(tick, [tickResult, previousTickTime, fps, accumulator, draw, onEnd]));
        }
    }

    function animate(fps, onStart, onTick, draw, onEnd, startResult) {
        var previousTickTime = now();

        onStart(startResult);
        tick(Continue(startResult), previousTickTime, fps, Accumulator(onTick, 60, now()), draw, onEnd);
    }

    window.Animation = function (options) {

        var animation = Object.create(null);

        animation.animate = partial(animate, [
            options.fps,
            options.onStart || noop,
            options.onTick || noop,
            options.draw || noop,
            options.onEnd || noop
        ]);

        return Object.freeze(animation);
    };

    window.Animation.Terminate = Terminate;

    window.Animation.Continue = Continue;

    window.Animation = Object.freeze(window.Animation);
}());