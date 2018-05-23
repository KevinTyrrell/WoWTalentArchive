"use strict";

println("Starting tests.");

const a = BooleanProperty.new(true);
const b = BooleanProperty.new(false);
const c = BooleanProperty.new(true);
const d = Binding.or(a, b, c);

d.addListener(function(obs, oldVal, newVal)
{
    println("Binding changed from " + oldVal + " to " + newVal + ".");
});

println("Binding is currently: " + d.get());

a.set(false);
c.not();
b.not();
d.unbind();

println("Ending tests.");
