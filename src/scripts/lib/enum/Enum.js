"use strict";

/**
 * Enum module.
 * Sub-class of Structure.
 * Defines a base class for all Enum constants.
 */
const Enum = (function()
{
    /* Module design pattern. */
    const module = { };

    /* Super accessor. */
    const superClass = Structure.extend();

    /**
     * @see Structure.extend.
     */
    module.extend = (function()
    {
        const associate = InstanceManager.manage(module);

        return function(module)
        {
            assert(Boolean(module));
            assert(typeof module === "object");
            assert(!Object.isFrozen(module));

            /* Tracks all values for enums. */
            const values = [ ];

            /* Protected constructor. */
            const constructor = function()
            {
                /* Call parent to construct base object. */
                const instance = superClass.new();
                associate(instance);

                const ordinal = values.length;
                values.push(instance);

                /**
                 * @returns {number} Order of this value in the Enum.
                 */
                instance.ordinal = function()
                {
                    return ordinal;
                };

                return instance;
            };

            /**
             * Returns the Enum corresponding to this ordinal.
             * @param ordinal Ordinal Enum value.
             * @returns {{}} Enum value.
             */
            module.get = function(ordinal)
            {
                assert(typeof ordinal === "number");
                assert(Number.isInteger(ordinal));
                assert(ordinal >= 0);
                assert(ordinal < values.length);
                return values[ordinal];
            };

            /**
             * @returns {number} Number of values in the Enum.
             */
            module.values = function()
            {
                return values.length;
            };

            return Object.freeze({
                new: constructor,
                getProtected: superClass.getProtected
            });
        };
    })();

    return Object.freeze(module);
})();
