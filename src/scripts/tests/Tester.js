"use strict";

println("Starting tests.");

const a = NumberProperty.new(5);
const b = NumberProperty.new(10);
const c = NumberProperty.new(-3);
const d = Binding.sum(a, b, c);

d.addListener(function(obs, oldVal, newVal)
{
    println("Binding changed from " + oldVal + " to " + newVal + ".");
});

println("Binding is currently: " + d.get());

a.add(5);
b.decrement();
b.set(0);
d.unbind();
a.set(0);

println("Ending tests.");
