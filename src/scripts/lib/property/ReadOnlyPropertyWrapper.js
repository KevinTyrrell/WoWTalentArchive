"use strict";

/**
 * Read-only property wrapper module.
 * Sub-class of Property.
 * Defines a mutable Property which holds a read-only version of itself.
 */
const ReadOnlyPropertyWrapper = (function()
{
    /* Module design pattern. */
    const module = { };

    /* Super accessor. */
    const superClass = Property.extend();
    const getProtected = superClass.getProtected;

    /* Protected constructor. */
    const construct = (function()
    {
        const associate = InstanceManager.manage(module);
        const superConstruct = superClass.new;

        return function(value)
        {
            const instance = superConstruct(value);
            associate(instance);

            /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */

            /* Read-only property which shadows this mutable property. */
            let readOnly = null;
            /* Notifies all listeners of the read-only property. */
            let readOnlyNotify = null;

            /* ~~~~~~~~~~ Public member(s) ~~~~~~~~~~ */

            /**
             * Provides a read-only view of the Property.
             * Changes made in the Property are reflected in the view.
             * A read-only view will only be created if requested.
             * @returns {{}} Read-only view of the Property.
             */
            instance.readOnly = function()
            {
                if (readOnly === null)
                {
                    readOnly = ReadOnlyProperty.new(function()
                    {
                        return instance.get();
                    });
                    readOnlyNotify = getProtected(readOnly).notify;
                }

                return readOnly;
            };

            /* Override set. */
            (function()
            {
                const set = instance.set;
                instance.set = function(newValue)
                {
                    const oldValue = instance.get();
                    set(newValue);
                    if (readOnly !== null)
                        readOnlyNotify(oldValue);
                };
            })();

            return instance;
        }
    })();

    /**
     * Public constructor.
     * @param value Value of the Property.
     * @returns {ReadonlyArray<{}>} Property instance.
     */
    module.new = function(value)
    {
        return Object.freeze(construct(value));
    };

    /**
     * @see Structure.extend
     * @returns {Readonly<{new: Function, getProtected: getProtected|*}>} Protected super-constructor & member(s).
     */
    module.extend = function()
    {
        return Object.freeze({
            new: construct,
            getProtected: getProtected
        });
    };

    return Object.freeze(module);
})();
