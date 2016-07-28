(function () {
    'use strict';

    var TERMINATE = Object.create(null);

    function partial(fn, args) {
        return function partiallyApplied() {
            var moreArgs = Array.prototype.slice.call(arguments, 0);
            return fn.apply(null, args.concat(moreArgs));
        };
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

    function tick(accumulator, fps, duration, startTime, onTick, onEnd) {
        var tickResult = onTick(accumulator, duration, startTime, timeLeft(duration, startTime));

        if (tickResult === TERMINATE || timeIsOver(duration, startTime)) {
            onEnd(accumulator);
        } else {
            requestAnimationFrame(partial(tick, [tickResult, fps, duration, startTime, onTick, onEnd]));
        }
    }

    function animate(fps, duration, onStart, onTick, onEnd, accumulator) {
        onStart(accumulator);
        tick(accumulator, fps, duration, now(), onTick, onEnd);
    }

    window.Animation = function (options) {

        var animation = Object.create(null);

        animation.animate = partial(animate, [
            options.fps,
            options.duration,
            options.onStart,
            options.onTick,
            options.onEnd
        ]);

        return Object.freeze(animation);
    };

    window.Animation.TERMINATE = TERMINATE;
}());