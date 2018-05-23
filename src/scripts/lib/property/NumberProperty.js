"use strict";

/**
 * Number property module.
 * Sub-class of ReadOnlyPropertyWrapper
 * Defines a mutable Property specifically for numbers.
 */
const NumberProperty = (function()
{
    /* Module design pattern. */
    const module = { };

    /* Super accessor. */
    const superClass = ReadOnlyPropertyWrapper.extend();

    /* ~~~~~~~~~~ Private static member(s) ~~~~~~~~~~ */

    /* Returns true if the parameter is a valid number. */
    const checkNum = function(num)
    {
        return num !== undefined && num !== null && Type.of(num) === Type.NUMBER;
    };

    /**
     * Public constructor.
     */
    module.new = (function()
    {
        const associate = InstanceManager.manage(module);
        const superConstruct = superClass.new;

        return function(value)
        {
            if (value === undefined) value = 0;
            assert(checkNum(value));

            const instance = superConstruct(value);
            associate(instance);

            /* Override set. */
            (function()
            {
                const superSet = instance.set;
                instance.set = function(newValue)
                {
                    assert(checkNum(newValue));
                    superSet(newValue);
                };
            })();

            /**
             * Adds a number to the Property.
             * @param summand Number to be added.
             */
            instance.add = function(summand)
            {
                assert(checkNum(summand));
                instance.set(instance.get() + summand);
            };

            /**
             * Subtracts a number from the Property.
             * @param subtrahend Number to be subtracted.
             */
            instance.subtract = function(subtrahend)
            {
                assert(checkNum(subtrahend));
                instance.add(-subtrahend);
            };

            /**
             * Multiplies a number to the Property.
             * @param factor Number to be multiplied.
             */
            instance.multiply = function(factor)
            {
                assert(checkNum(factor));
                instance.set(instance.get() * factor);
            };

            /**
             * Divides the Property by a number.
             * @param divisor
             */
            instance.divide = function(divisor)
            {
                assert(checkNum(divisor));
                assert(divisor !== 0);
                instance.set(instance.get() / divisor);
            };

            /**
             * Increments the Property by one.
             */
            instance.increment = function()
            {
                instance.add(1);
            };

            /**
             * Decrements the Property by one.
             */
            instance.decrement = function()
            {
                instance.subtract(1);
            };

            /* Override tostring. */
            instance.tostring = function()
            {
                return "" + value;
            };

            return Object.freeze(instance);
        };
    })();

    return Object.freeze(module);
})();