"use strict";

/**
 * Module manager module.
 * Defines a system for pairing instances with their respective modules.
 */
const InstanceManager = (function()
{
    /* Module design pattern. */
    const manager = { };

    /* ~~~~~~~~~~ Private static member(s) ~~~~~~~~~~ */
    let add = null;

    /**
     * Manages a module, by tracking what instances (objects) belong to them.
     * Any object passed to the returned function is tracked and associated
     * with the specified module, and can be checked with 'hasInstance'.
     * This functionality emulates the 'instanceof' keyword from Java.
     * @param module Module to be managed.
     * @returns {Function} Function to associate instances with the module.
     */
    manager.manage = function(module)
    {
        assert(Boolean(module));
        assert(typeof module === "object");
        assert(!Object.isFrozen(module));
        if (add !== null)
        {
            assert(!manager.hasInstance(module));
            /* Indicate that this module is being managed. */
            add(module);
        }

        /* Tracks all current instances of the module. */
        const instances = new WeakSet();

        /**
         * Indicates if the instance was created from the specified module.
         * @param instance Instance to check.
         * @returns {boolean} True if the instance was created from this module.
         */
        module.hasInstance = function(instance)
        {
            assert(Boolean(instance));
            assert(typeof instance === "object");
            return instances.has(instance);
        };

        /**
         * Provide a way for instances to be added to the manager.
         * This function should be called when an instance is constructed.
         */
        return function(instance)
        {
            assert(Boolean(instance));
            assert(typeof instance === "object");
            assert(!instances.has(instance));
            instances.add(instance);
        };
    };

    /* Allow this manager to track managed modules. */
    add = manager.manage(manager);

    return Object.freeze(manager);
})();
