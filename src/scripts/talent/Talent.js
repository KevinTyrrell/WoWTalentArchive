"use strict";

/**
 * Talent module.
 * Sub-class of Structure.
 * Defines a talent within a talent tree.
 */
const Talent = (function()
{
    /* Module design pattern. */
    const module = { };

    /* ~~~~~~~~~~ Private static member(s) ~~~~~~~~~~ */
    const MAX_TALENT_RANK = 5;

    /**
     * Public constructor.
     */
    module.new = (function()
    {
        /* Super accessor. */
        const superClass = Structure.extend();
        const superConstruct = superClass.new;
        const getProtected = superClass.getProtected;
        const associate = InstanceManager.manage(module);

        return function(name, description, icon, scalingValues)
        {
            assert(Boolean(name));
            assert(Type.of(name) === Type.STRING);
            assert(Boolean(description));
            assert(Type.of(description) === Type.STRING);
            assert(Boolean(icon));
            assert(Type.of(icon) === Type.STRING);

            const instance = superConstruct();
            associate(instance);
            const restricted = getProtected(instance);

            /* ~~~~~~~~~~ Protected member(s) ~~~~~~~~~~ */

            /* Talent(s) which require this talent. */
            restricted.requiredFor = new Set();

            /* Number of prerequisite talents this talent requires. */
            restricted.inDegree = Property.new(0);
            restricted.inDegree.addListener(function(_, newVal)
            {
                assert(newVal !== undefined);
                assert(newVal !== null);
                assert(Type.of(newVal) === Type.NUMBER);
                assert(Number.isInteger(newVal));
                assert(newVal >= 0);
            });

            /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */

            /* True if the talent has the maximum amount of points invested. */
            const maxed = Property.new(false);
            maxed.addListener(function(_, newVal)
            {
                assert(newVal !== undefined);
                assert(newVal !== null);
                assert(Type.of(newVal) === Type.BOOLEAN);
            });

            /* Talent is locked when prerequisites are not met. */
            const locked = Property.new(false);
            locked.addListener(function(_, newVal)
            {
                assert(newVal !== undefined);
                assert(newVal !== null);
                assert(Type.of(newVal) === Type.BOOLEAN);
            });
            restricted.inDegree.addListener(function(_, newVal)
            {
                /* Unlock or lock depending on the prerequisite(s). */
                locked.set(newVal === 0);
            });

            /* Maximum number of points that can be invested in the talent. */
            const maxPoints = scalingValues.length;

            /* Number of points currently invested into the talent. */
            const points = Property.new(0);
            points.addListener(function(_, newVal)
            {
                assert(newVal !== undefined);
                assert(newVal !== null);
                assert(Type.of(newVal) === Type.NUMBER);
                assert(Number.isInteger(newVal));
                assert(newVal >= 0);
                assert(newVal <= maxPoints);
                maxed.set(newVal >= maxPoints);
            });

            /**
             * Indicates that this talent requires another talent prerequisite.
             * @param talent Prerequisite talent for the talent.
             */
            instance.require = function(talent)
            {
                assert(Boolean(talent));    
                assert(Type.of(talent) === Type.OBJECT);
                assert(module.hasInstance(talent));
                assert(instance.getPoints() === 0);
                assert(talent.getPoints() === 0);
                const unlocks = getProtected(talent).requiredFor;
                if (unlocks.has(instance)) return;
                unlocks.add(instance);
                locked.set(true);
                // TODO: Check for cycle(s).
            };

            /**
             * @param newPoints Amount of points to set for the talent.
             */
            instance.setPoints = function(newPoints)
            {
                assert(newPoints !== undefined);
                assert(newPoints !== null);
                assert(Type.of(newPoints) === Type.NUMBER);
                assert(Number.isInteger(newPoints));
                assert(newPoints >= 0);
                assert(newPoints <= maxPoints);
                const p = points.get();
                if (p === newPoints) return;

                if (instance.isMaxed())
                {
                    /* Points cannot be removed if we are meeting a requirement. */
                    for (let t of restricted.requiredFor)
                        if (t.getPoints() > 0) return;
                    points.set(newPoints);
                }
                else if (newPoints === maxPoints)
                {
                    points.set(newPoints);
                    for (let t of restricted.requiredFor)

                }


            };

            /**
             * Return number of points invested into the talent.
             */
            instance.getPoints = function()
            {
                return points.get();
            };

            /**
             * Returns a read-only property which is equal
             * to the number of points invested into the talent.
             * @see: ReadOnlyProperty
             * @see: property.readOnly
             * @returns {{}|*} Read-only Property wrapped integer.
             */
            instance.pointsProperty = function()
            {
                return points.readOnly();
            };

            /**
             * Return the maximum number of points that can be invested in the talent.
             */
            instance.getMaxPoints = function()
            {
                return maxPoints;
            };

            /**
             * Returns a read-only property which is true when
             * the maximum number of points are invested into the talent.
             * @see: ReadOnlyProperty
             * @see: property.readOnly
             * @returns {{}|*} Read-only Property wrapped boolean.
             */
            instance.maxedProperty = function()
            {
                return maxed.readOnly();
            };

            /**
             * Return true if the the talent has the maximum amount of points invested.
             */
            instance.isMaxed = function()
            {
                return maxed.get();
            };

            /**
             * Returns a read-only property which is true when
             * the talent is locked due to a pre-requisite not being met.
             * @see: ReadOnlyProperty
             * @see: property.readOnly
             * @returns {{}|*} Read-only Property wrapped boolean.
             */
            instance.lockedProperty = function()
            {
                return locked.readOnly();
            };

            /**
             * Returns true if the talent is locked due to a pre-requisite not being met.
             */
            instance.isLocked = function()
            {
                return locked.get();
            };

            return Object.freeze(instance);
        };
    })();

    return Object.freeze(module);
})();
