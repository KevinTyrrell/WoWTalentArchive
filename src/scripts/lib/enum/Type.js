"use strict";

/**
 * Type module.
 * Sub-class of Enum.
 * Defines a enum to replace typeof syntax.
 */
const Type = (function()
{
    /* Module design pattern. */
    const module = { };

    /* Private constructor. */
    const construct = (function()
    {
        /* Super accessor. */
        const superConstruct = Enum.extend(module).new;
        const associate = InstanceManager.manage(module);

        return function(name)
        {
            assert(Boolean(name));
            assert(typeof name === "string");

            const instance = superConstruct();
            associate(instance);

            /**
             * @returns {string} Name of this Type.
             */
            instance.getName = function()
            {
                return name;
            };

            /* Override tostring. */
            instance.tostring = instance.getName;

            return Object.freeze(instance);
        }
    })();

    /* Enum constant(s). */
    module.BOOLEAN = construct("boolean");
    module.FUNCTION = construct("function");
    module.UNDEFINED = construct("undefined");
    module.NUMBER = construct("number");
    module.STRING = construct("string");
    module.SYMBOL = construct("symbol");
    module.OBJECT = construct("object");

    /**
     * Returns Type enum value corresponding to the variable's type.
     * Used as a replacement for 'typeof'.
     */
    module.of = (function()
    {
        const fromString = new Map();

        for (let i = 0; i < module.values(); i++)
        {
            const type = module.get(i);
            fromString.set(type.getName(), type);
        }

        return function(variable)
        {
            assert(variable !== null);
            return fromString.get(typeof variable);
        };
    })();

    return Object.freeze(module);
})();
