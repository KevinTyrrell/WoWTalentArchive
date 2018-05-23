"use strict";

/**
 * Boolean property module.
 * Sub-class of ReadOnlyPropertyWrapper
 * Defines a mutable Property specifically for boolean values.
 */
const BooleanProperty = (function()
{
    /* Module design pattern. */
    const module = { };

    /* Super accessor. */
    const superClass = ReadOnlyPropertyWrapper.extend();

    /* ~~~~~~~~~~ Private static member(s) ~~~~~~~~~~ */

    /* Returns true if the parameter is a boolean value. */
    const checkBool = function(bool)
    {
        return bool !== undefined && bool !== null && Type.of(bool) === Type.BOOLEAN;
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
            if (value === undefined) value = false;
            assert(checkBool(value));

            const instance = superConstruct(value);
            associate(instance);

            /* ~~~~~~~~~~ Public member(s) ~~~~~~~~~~ */

            /* Override set. */
            (function()
            {
                const superSet = instance.set;
                instance.set = function(newValue)
                {
                    assert(checkBool(newValue));
                    superSet(newValue);
                };
            })();

            /**
             * Flips the boolean value of the Property.
             */
            instance.not = function()
            {
                instance.set(!instance.get());
            };

            return Object.freeze(instance);
        };
    })();

    return Object.freeze(module);
})();