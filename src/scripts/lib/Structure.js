"use strict";

/**
 * Structure module.
 * Defines a base class for closure-based objects.
 */
const Structure = (function()
{
    const extend = function(module, superConstructor)
    {
        const protectedMap = new WeakMap();
        const privateMap = new WeakMap();

        const hasInstance = function(instance)
        {
            privateMap.has(instance);
        };
        module.hasInstance = hasInstance;

        const constructorHook = function()
        {
            const obj = superConstructor();
            const instance = obj.instance;
            const prot = { super: obj.protected };
            protectedMap.set(instance, prot);
            privateMap.set(instance, { });

            return Object.freeze({
                instance: instance,
                protected: prot
            });
        };

        return Object.freeze({
            new: constructorHook,
            protected: function(instance)
            {
                assert(Boolean(instance));
                assert(typeof instance === "object");
                assert(hasInstance(instance));
                return protectedMap.get(instance);
            },
            private: function(instance)
            {
                assert(Boolean(instance));
                assert(typeof instance === "object");
                assert(hasInstance(instance));
                return privateMap.get(instance);
            },
            extend: extend
        });
    };
})();
