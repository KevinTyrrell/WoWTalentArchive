"use strict";

/**
 * Structure module.
 * Defines a base class for closure-based objects.
 */
const Structure = (function()
{
    /* Module design pattern. */
    const module = { };

    /* Protected constructor. */
    const constructor = (function()
    {
        /* Associates JSON object's in the Structure module as Structure instances. */
        const associate = InstanceManager.manage(module);

        return function()
        {
            /* Structure instance. */
            const instance = { };
            associate(instance);

            /**
             * Converts a Structure to a String representation.
             * This function should be overridden in subclasses.
             * Not to be confused with prototype.toString.
             * @returns {string} String representation.
             */
            instance.tostring = function()
            {
                return "structure";
            };

            return instance;
        }
    })();

    /**
     * Public constructor.
     * @returns {ReadonlyArray<{}>} Structure instance.
     */
    module.new = function()
    {
        return Object.freeze(constructor());
    };

    /**
     * Facilitates primitive sub-classing of the Structure class.
     * Sub-classes will have access to mutable objects and protected object members.
     * @returns {Readonly<{new: new, getProtected: getProtected}>} Protected super-constructor & member(s).
     */
    module.extend = function()
    {
        /* Protected members of each instance for this module (and all of its extended modules). */
        const protectedMap = new WeakMap();

        return Object.freeze({
            /**
             * Protected constructor.
             * @returns {*} Structure object.
             */
            new: function()
            {
                const instance = constructor();
                /* The structure's protected member(s). */
                const restricted = { };
                /* Pair each instance with its protected member(s). */
                protectedMap.set(instance, restricted);
                return instance;
            },

            /**
             * Provides a primitive way for sub-classes to access instance's protected members.
             * Note that placing identifiers into the returned object from a sub-class
             * allows for super-classes to access those protected members.
             * To fix that behavior may involve having separate protected members for
             * each extending class, but still interconnecting them in a one-way relationship.
             * @param instance Instance to inspect.
             * @returns {{}} Protected members of the instance.
             */
            getProtected: function(instance)
            {
                assert(Boolean(instance));
                assert(typeof instance === "object");
                assert(module.hasInstance(instance));
                assert(protectedMap.has(instance));
                return protectedMap.get(instance);
            }
        });
    };

    return Object.freeze(module);
})();
