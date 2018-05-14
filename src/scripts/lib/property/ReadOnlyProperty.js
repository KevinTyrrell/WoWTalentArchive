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
    const constructor = (function()
    {
        const associate = InstanceManager.manage(module);

        return function(getCallback)
        {
            assert(Boolean(getCallback));
            assert(Type.of(getCallback) === Type.FUNCTION);

            const instance = superClass.new();
            associate(instance);
            const restricted = getProtected(instance);

            /**
             * Returns the value of the Property.
             */
            instance.get = getCallback;

            /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */
            const listeners = new Set();

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

            /**
             * Notifies all listeners of a change within the Property.
             * @param oldValue Value which was overwritten.
             */
            restricted.notifyListeners = function(oldValue)
            {
                assert(oldValue !== undefined);
                const newValue = instance.get();
                for (let listener of listeners)
                    listener(oldValue, newValue);
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
     * @see: readOnlyProperty.get.
     * @returns {ReadonlyArray<{}>} ReadOnlyProperty instance.
     */
    module.new = function(getCallback)
    {
        return Object.freeze(constructor(getCallback));
    };

    /**
     * @see Structure.extend.
     */
    module.extend = function()
    {
        return Object.freeze({
            new: constructor,
            getProtected: getProtected
        });
    };

    return Object.freeze(module);
})();
