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

    /* Super accessor. */
    const superClass = ReadOnlyProperty.extend();
    const getProtected = superClass.getProtected;

    /* Protected constructor. */
    const construct = (function()
    {
        const associate = InstanceManager.manage(module);
        const superConstruct = superClass.new;

        return function(value)
        {
            if (value === undefined)
                value = null;

            /* Implement abstract method 'get'. */
            const instance = superConstruct(function()
            {
                return value;
            });
            associate(instance);

            /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */

            /* Property in which this property is bound to. */
            let observing = null;
            /* Callback function for the binding. */
            let binding_callback = null;

            /* Sets the value of the Property and notifies all listeners. */
            const set = (function()
            {
                const notify = getProtected(instance).notify;

                return function(newValue)
                {
                    assert(newValue !== undefined);
                    if (value === newValue) return;
                    const oldValue = value;
                    value = newValue;
                    notify(oldValue);
                };
            })();

            /* ~~~~~~~~~~ Public member(s) ~~~~~~~~~~ */

            /**
             * @returns {boolean} True if the Property is bound.
             */
            instance.isBound = function()
            {
                return observing !== null;
            };

            /**
             * Unbinds the Property.
             */
            instance.unbind = function()
            {
                if (!instance.isBound()) return;
                observing.removeListener(binding_callback);
                observing = null;
                binding_callback = null;
            };

            /**
             * Binds this Property with a binding.
             * Bindings are guaranteed to extend from ReadOnlyProperty.
             * A bound property will automatically update with the binding.
             * Once bound, the Property can no longer be set.
             * @param binding Observable binding to bind the Property to.
             */
            instance.bind = function(binding)
            {
                assert(Boolean(binding));
                assert(Type.of(binding) === Type.OBJECT);
                assert(ReadOnlyProperty.hasInstance(binding));
                if (binding === observing) return;
                instance.unbind();
                observing = binding;

                binding_callback = function(_, __, newValue)
                {
                    set(newValue);
                };

                observing.addListener(binding_callback);
                set(observing.get());
            };

            /**
             * Sets the current value of the Property.
             * A change is not made if the new and old value are equal.
             * Any listeners of the Property will be notified of the change.
             * A Property cannot be set if it is bound to another Property.
             * @param newValue Value to be set.
             */
            instance.set = function(newValue)
            {
                assert(!instance.isBound());
                set(newValue);
            };

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
