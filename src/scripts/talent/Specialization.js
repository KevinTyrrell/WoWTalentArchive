/* Catacylsm Talent trees: http://rpgworld.altervista.org/talentcata/eng/?WR */

const Specialization = (function()
{
    /* Module design pattern. */
    const module = { };

    module.new = (function()
    {
        const superConstruct = Structure.extend().new;
        const associate = InstanceManager.manage(module);

        /* Non-static inner module. */
        module.Talent = { };
        const sub_associate = InstanceManager.manage(module.Talent);
        const sub_superClass = Structure.extend();

        return function(name)
        {
            assert(Boolean(name));
            assert(Type.of(name) === Type.STRING);
            assert(name.length > 0);

            const instance = superConstruct();
            associate(instance);

            /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */

            /* Points invested into this specialization. */
            const points = NumberProperty.new();

            /**
             * @returns {string} Name of the specialization.
             */
            instance.getName = function()
            {
                return name;
            };

            /**
             * Return number of points invested in the specialization.
             */
            instance.getPoints = function()
            {
                return points.get();
            };

            /**
             * Returns a read-only property which is equal to the
             * number of points invested into the specialization.
             * @see: ReadOnlyProperty.readOnly
             * @returns {{}|*}
             */
            instance.pointsProperty = function()
            {
                return points.readOnly();
            };

            const sub_construct = (function()
            {
                const sub_superConstruct = sub_superClass.new;
                const sub_getProtected = sub_superClass.getProtected;

                /* ~~~~~~~~~~ Private static member(s) ~~~~~~~~~~ */
                const MAX_TALENT_RANK = 5;

                return function(name, description, icon, scalingValues)
                {
                    assert(Boolean(name));
                    assert(Type.of(name) === Type.STRING);
                    assert(Boolean(description));
                    assert(Type.of(description) === Type.STRING);
                    assert(Boolean(icon));
                    assert(Type.of(icon) === Type.STRING);
                    assert(Boolean(scalingValues));
                    assert(Type.of(scalingValues) === Type.OBJECT);
                    assert(Array.isArray(scalingValues));
                    assert(scalingValues.length <= MAX_TALENT_RANK);

                    const talent = sub_superConstruct();
                    sub_associate(talent);

                    /* ~~~~~~~~~~ Protected member(s) ~~~~~~~~~~ */

                    /* Talent(s) which require this talent. */
                    // restricted.requiredFor = new Set();
                    //
                    // /* Number of prerequisite talents this talent requires. */
                    // restricted.inDegree = NumberProperty.new();
                    // restricted.inDegree.addListener(function(_, newVal)
                    // {
                    //     assert(Number.isInteger(newVal));
                    //     assert(newVal >= 0);
                    // });

                    /* ~~~~~~~~~~ Private member(s) ~~~~~~~~~~ */

                    /* Maximum rank of the talent. */
                    const maxRank = scalingValues.length;

                    /* True if the talent is at the maximum rank. */
                    const maxed = Property.new(false);
                    maxed.addListener(function(_, newVal)
                    {
                        assert(newVal !== undefined);
                        assert(newVal !== null);
                        assert(Type.of(newVal) === Type.BOOLEAN);
                    });

                    /* Current rank of the current. */
                    const rank = NumberProperty.new();
                    rank.addListener(function(_, newVal)
                    {
                        assert(Number.isInteger(newVal));
                        assert(newVal >= 0);
                        assert(newVal <= maxRank);
                        maxed.set(newVal >= maxRank);
                    });

                    /* Talent descriptions for each rank. */
                    const descriptions = (function()
                    {
                        const tmp = [ ];
                        /* Default case for talents without scaling values. */
                        tmp[0] = description;

                        for (let i = 0; i < maxRank; i++)
                        {
                            /* Some talents have multiple values that scale per point.
                            * Due to this, the scaling values array should be parsed as a 2D array.
                            * If the talent only has one scaling value (ex. 1% crit, 2% crit, etc),
                            * then a 1D array can be passed and will be boxed and parsed as a 2D array. */
                            const subArr = (Array.isArray(scalingValues[i]) ?
                                scalingValues[i] : [ scalingValues[i] ]);
                            let copy = description;
                            /* Python format syntax. "{0} is a {1}".format("Bob", "Cat") ==> "Bob is a Cat". */
                            for (let h = 0; h < subArr.length; h++)
                                copy = copy.replace(new RegExp("\\{" + h + "\\}", "gi"), subArr[h]);
                            tmp[i] = copy;
                        }

                        return tmp;
                    })();

                    /*  */
                    const requirements = new Map();

                    /* Talent is locked when prerequisites are not met. */
                    // const locked = Property.new(false);
                    // locked.addListener(function(_, newVal)
                    // {
                    //     assert(newVal !== undefined);
                    //     assert(newVal !== null);
                    //     assert(Type.of(newVal) === Type.BOOLEAN);
                    // });
                    // restricted.inDegree.addListener(function(_, newVal)
                    // {
                    //     /* Unlock or lock depending on the prerequisite(s). */
                    //     locked.set(newVal > 0);
                    // });

                    /**
                     * Indicates that this talent requires another talent prerequisite.
                     * @param talent Prerequisite talent for the talent.
                     */
                    // instance.require = function(talent)
                    // {
                    //     assert(Boolean(talent));
                    //     assert(Type.of(talent) === Type.OBJECT);
                    //     assert(module.hasInstance(talent));
                    //     assert(instance.getPoints() === 0);
                    //     assert(talent.getPoints() === 0);
                    //
                    //     const otherRequiredFor = getProtected(talent).requiredFor;
                    //     if (otherRequiredFor.has(instance)) return;
                    //     otherRequiredFor.add(instance);
                    //     restricted.inDegree.increment();
                    //     // TODO: Check for cycle(s).
                    // };
                    //
                    // /**
                    //  * @param newPoints Amount of points to set for the talent.
                    //  */
                    // instance.setPoints = function(newPoints)
                    // {
                    //     assert(newPoints !== undefined);
                    //     assert(newPoints !== null);
                    //     assert(Type.of(newPoints) === Type.NUMBER);
                    //     assert(Number.isInteger(newPoints));
                    //     assert(newPoints >= 0);
                    //     assert(newPoints <= maxPoints);
                    //
                    //     if (instance.isLocked() || points.get() === newPoints) return;
                    //
                    //     if (instance.isMaxed())
                    //     {
                    //         /* Points cannot be removed if we are meeting a requirement. */
                    //         for (const t of restricted.requiredFor)
                    //             if (t.getPoints() > 0) return;
                    //         points.set(newPoints);
                    //         /* Indicate requirements are no longer met. */
                    //         for (const t of restricted.requiredFor)
                    //             getProtected(t).inDegree.increment();
                    //     }
                    //     else
                    //     {
                    //         points.set(newPoints);
                    //         if (instance.isMaxed())
                    //         /* Requirement is now met for next talent. */
                    //             for (const t of restricted.requiredFor)
                    //                 getProtected(t).inDegree.decrement();
                    //     }
                    // };

                    // /**
                    //  * Places a point in the talent, if possible.
                    //  */
                    // instance.place = function()
                    // {
                    //     if (!instance.isMaxed())
                    //         instance.setPoints(instance.getPoints() + 1);
                    // };
                    //
                    // /**
                    //  * Removes a point from the talent, if possible.
                    //  */
                    // instance.remove = function()
                    // {
                    //     const p = instance.getPoints();
                    //     if (p > 0)
                    //         instance.setPoints(p - 1);
                    // };

                    /**
                     * @returns {string} Name of the talent.
                     */
                    instance.getName = function()
                    {
                        return name;
                    };

                    /* Override tostring. */
                    instance.tostring = function()
                    {
                        return instance.getName();
                    };

                    return Object.freeze(instance);
                };
            })();

            return Object.freeze(instance);
        }
    })();

    return Object.freeze(module);
})();
