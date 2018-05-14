"use strict";

/**
 * Property module.
 * Sub-class of ReadOnlyProperty.
 * Defines a mutable subscriber producer object pattern.
 */
const Property = (function()
{
    /* Module design pattern. */
    const module = { };

    /**
     * Public constructor.
     */
    module.new = (function()
    {
        /* Super accessor. */
        const superClass = ReadOnlyProperty.extend();
        const associate = InstanceManager.manage(module);
        const superConstruct = superClass.new;
        const getProtected = superClass.getProtected;

        return function(value)
        {
            if (value === undefined)
                value = null;

            /* Implementation for abstract super method 'get'. */
            const get = function()
            {
                return value;
            };

            /* Implement abstract method 'get'. */
            const instance = superConstruct(get);
            associate(instance);

            /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */
            let readOnly = null;

            /* Protected member reference(s). */
            const notifyListeners = getProtected(instance).notifyListeners;

            /**
             * Provides a read-only view of the Property.
             * Changes made in the Property are reflected in the view.
             * A read-only view will only be created if requested.
             * @returns {{}} Read-only view of the Property.
             */
            instance.readOnly = function()
            {
                if (readOnly === null)
                    readOnly = ReadOnlyProperty.new(get);
                return readOnly;
            };

            /**
             * Sets the current value of the Property.
             * A change is not made if the new and old value are equal.
             * Any listeners of the Property will be notified of the change.
             * @param newValue Value to be set.
             */
            instance.set = function(newValue)
            {
                assert(newValue !== undefined);
                if (value === newValue) return;
                const oldValue = value;
                value = newValue;
                notifyListeners(oldValue);
                /* Notify the read-only view as well. */
                if (readOnly !== null)
                    getProtected(readOnly).notifyListeners(oldValue);
            };

            return Object.freeze(instance);
        }
    })();

    return Object.freeze(module);
})();
