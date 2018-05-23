"use strict";

const Binding = (function()
{
    /* Module design pattern. */
    const module = { };

    /* Super accessor. */
    const superClass = ReadOnlyProperty.extend();
    const getProtected = superClass.getProtected;

    /* Protected constructor. */
    module.new = (function()
    {
        const associate = InstanceManager.manage(module);
        const superConstruct = superClass.new;

        return function(compute, ...observables)
        {
            assert(Boolean(compute));
            assert(Type.of(compute) === Type.FUNCTION);
            assert(observables.length > 0);

            /* Current value of the Binding. */
            let value = null;
            /* Implement abstract method 'get'. */
            const instance = superConstruct(function()
            {
                return value;
            });
            associate(instance);

            /* ~~~~~~~~~~ Protected member(s) ~~~~~~~~~~ */
            const notify = getProtected(instance).notify;

            /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */

            /* Listener to watch all the observables. */
            const listener = function()
            {
                const oldValue = value;
                value = compute();
                assert(value !== undefined);
                if (oldValue !== value)
                    notify(oldValue);
            };
            listener();

            /* Observables to watch for changes. */
            const obs = new Set();
            for (let i of observables)
            {
                assert(Boolean(i));
                assert(Type.of(i) === Type.OBJECT);
                assert(ReadOnlyProperty.hasInstance(i));
                obs.add(i);
                i.addListener(listener);
            }

            /* ~~~~~~~~~~ Public member(s) ~~~~~~~~~~ */

            /**
             * Unbinds this binding, canceling future updates.
             * A binding should be unbound when no longer used,
             * as it maintains strong references to its observed
             * values and will not allow them to be garbage collected.
             */
            instance.unbind = function()
            {
                for (let i of obs)
                    i.removeListener(listener);
                obs.clear();
            };

            return Object.freeze(instance);
        }
    })();

    /**
     * Creates a binding which is bound to the sum of the observables.
     * @param observables Properties to watch.
     * @returns {{}} Binding instance.
     */
    module.sum = function(...observables)
    {
        assert(observables.length >= 2);
        return module.new(function()
        {
            let sum = 0;
            for (let i of observables)
            {
                assert(Boolean(i));
                assert(Type.of(i) === Type.OBJECT);
                assert(NumberProperty.hasInstance(i));
                sum += i.get();
            }
            return sum;
        }, ...observables);
    };

    /**
     * Creates a binding which is bound to the logical AND of the observables.
     * @param observables Properties to watch.
     * @returns {{}} Binding instance.
     */
    module.and = function(...observables)
    {
        assert(observables.length >= 2);
        return module.new(function()
        {
            for (let i of observables)
            {
                assert(Boolean(i));
                assert(Type.of(i) === Type.OBJECT);
                assert(BooleanProperty.hasInstance(i));
                if (!i.get())
                    return false;
            }
            return true;
        }, ...observables);
    };

    /**
     * Creates a binding which is bound to the logical OR of the observables.
     * @param observables Properties to watch.
     * @returns {{}} Binding instance.
     */
    module.or = function(...observables)
    {
        assert(observables.length >= 2);
        return module.new(function()
        {
            for (let i of observables)
            {
                assert(Boolean(i));
                assert(Type.of(i) === Type.OBJECT);
                assert(BooleanProperty.hasInstance(i));
                if (i.get())
                    return true;
            }
            return false;
        }, ...observables);
    };

    return Object.freeze(module);
})();
