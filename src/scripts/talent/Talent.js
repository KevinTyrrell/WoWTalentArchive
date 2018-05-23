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


    })();

    /**
     * Parses a JSON object into a Talent object.
     * JSON fields must be the following:
     * {
     *  name: string
     *  description: string
     *  values: array or undefined
     *  icon: string
     * }
     * @throws SyntaxException if JSON object cannot be parsed.
     * @param objJSON JSON object to parse.
     * @returns {{}} Talent instance.
     */
    module.parse = function(objJSON)
    {
        assert(Boolean(objJSON));
        assert(Type.of(objJSON) === Type.OBJECT);

        const name = objJSON.name;
        const description = objJSON.description;
        /* Values is an optional parameter. */
        const values = (objJSON.values !== undefined) ? objJSON.values : [ ];
        const icon = objJSON.icon;

        if (!Boolean(name) || Type.of(name) !== Type.STRING || name.length <= 0
            || !Boolean(description) || Type.of(description) !== Type.STRING || description.length <= 0
            || !Boolean(values) || Type.of(values) !== Type.OBJECT || !Array.isArray(values)
            || !Boolean(icon) || Type.of(icon) !== Type.STRING || icon.length <= 0)
            throw SyntaxError;

        return module.new(name, description, icon, values);
    };

    return Object.freeze(module);
})();
