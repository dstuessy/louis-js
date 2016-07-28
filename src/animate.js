(function () {
    'use strict';

    var TERMINATE = Object.create(null);

    function partial(fn, args) {
        return function partiallyApplied() {
            var moreArgs = Array.prototype.slice.call(arguments, 0);
            return fn.apply(null, args.concat(moreArgs));
        };
    }

    function noop() {
        return undefined;
    }

    function now() {
        return Date.now();
    }

    function timePassed(startTime) {
        return now() - startTime;
    }

    function timeLeft(duration, startTime) {
        return duration - timePassed(startTime);
    }

    function timeIsOver(duration, startTime) {
        return timeLeft(duration, startTime) <= 0;
    }

    function timePerTick(fps) {
        return 1000 / fps;
    }

    function delta(currentTime, previousTickTime) {
        return currentTime - previousTickTime;
    }

    function isNextTick(deltaTime, tPerTick) {
        return deltaTime >= tPerTick;
    }

    function tick(accumulator, previousTickTime, fps, duration, startTime, onTick, onEnd) {
        var tickResult,
            deltaTime = delta(now(), previousTickTime),
            isItNextTick = isNextTick(deltaTime, timePerTick(fps));

        console.log(isItNextTick, 'delta time: ', deltaTime, 'time per tick: ', timePerTick(fps), 'fps: ', fps);

        if (isItNextTick) {
            console.log('tick is gonna happen!');
            tickResult = onTick(accumulator, deltaTime, duration, startTime, timeLeft(duration, startTime));
            previousTickTime = now();
        }

        if (tickResult === TERMINATE || timeIsOver(duration, startTime)) {
            onEnd(accumulator);
        } else {
            requestAnimationFrame(partial(tick, [tickResult || accumulator, previousTickTime, fps, duration, startTime, onTick, onEnd]));
        }
    }

    function animate(fps, duration, onStart, onTick, onEnd, accumulator) {
        onStart(accumulator);
        tick(accumulator, now(), fps, duration, now(), onTick, onEnd);
    }

    window.Animation = function (options) {

        var animation = Object.create(null);

        animation.animate = partial(animate, [
            options.fps,
            options.duration,
            options.onStart || noop,
            options.onTick || noop,
            options.onEnd || noop
        ]);

        return Object.freeze(animation);
    };

    window.Animation.TERMINATE = TERMINATE;
}());