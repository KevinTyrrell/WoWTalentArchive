"use strict";

/**
 * Read-only property module.
 * Sub-class of Structure.
 * Defines a subscriber producer object pattern.
 */
const ReadOnlyProperty = (function()
{
    /* Module design pattern. */
    const module = { };

    /* Super accessor. */
    const superClass = Structure.extend();
    const getProtected = superClass.getProtected;

    /* Protected constructor. */
    const construct = (function()
    {
        const associate = InstanceManager.manage(module);
        const superConstruct = superClass.new;

        return function(getCallback)
        {
            assert(Boolean(getCallback));
            assert(Type.of(getCallback) === Type.FUNCTION);

            const instance = superConstruct();
            associate(instance);
            const restricted = getProtected(instance);

            /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */

            /* Callbacks listening to changes in the Property. */
            const listeners = new Set();

            /* ~~~~~~~~~~ Protected member(s) ~~~~~~~~~~ */

            /**
             * Notifies all listeners that the Property changed.
             * Callback functions will be called with the following parameters:
             * <property>, <oldValue>, <newValue>
             *     <property>: Property which has changed.
             *     <oldValue>: The value that was replaced.
             *     <newValue>: The replacement value that was set.
             * @param oldValue Value which was overwritten.
             */
            restricted.notify = function(oldValue)
            {
                assert(oldValue !== undefined);
                const newValue = instance.get();
                for (let listener of listeners)
                    listener(instance, oldValue, newValue);
            };

            /* ~~~~~~~~~~ Public member(s) ~~~~~~~~~~ */

            /**
             * Returns the value of the Property.
             */
            instance.get = getCallback;

            /**
             * Adds a listener which monitors changes to the Property.
             * The callback will be provided the old value and the updated value.
             * @param callback Function to be called.
             */
            instance.addListener = function(callback)
            {
                assert(Boolean(callback));
                assert(Type.of(callback) === Type.FUNCTION);
                listeners.add(callback);
            };

            /**
             * Removes a listener from the Property.
             * @param callback Function to be removed.
             * @returns {boolean|void|Promise<void>} True if the listener was removed.
             */
            instance.removeListener = function(callback)
            {
                assert(Boolean(callback));
                assert(Type.of(callback) === Type.FUNCTION);
                return listeners.delete(callback);
            };

            /* Override tostring. */
            instance.tostring = function()
            {
                const v = instance.get();
                if (v !== null
                    && Type.of(v) === Type.OBJECT
                    && Structure.hasInstance(v))
                    return v.tostring();
                return "" + v;
            };

            return instance;
        };
    })();

    /**
     * Public constructor.
     * @param getCallback get() implementation.
     * @see: readOnlyProperty.get
     * @returns {ReadonlyArray<{}>} ReadOnlyProperty instance.
     */
    module.new = function(getCallback)
    {
        return Object.freeze(construct(getCallback));
    };

    /**
     * @see Structure.extend
     * @returns {Readonly<{new: *, getProtected: getProtected|*}>} Protected super-constructor & member(s).
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
