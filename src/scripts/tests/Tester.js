"use strict";

println("Starting tests.");

const x = NumberProperty.new(5);
const y = NumberProperty.new(50);

const a = Binding.new(function()
{
    return x.get() < 10;
}, x);

const b = Binding.new(function()
{
    return y.get() % 2 === 0;
}, y);

const d = Binding.and(a, b);

const l = function(obs, oldVal, newVal)
{
    println("Binding changed from " + oldVal + " to " + newVal + ".");
};
d.addListener(l);

println("Binding is currently: " + d.get());

y.increment();
y.add(4);
x.subtract(0);
x.add(2);
y.set(0);

d.unbind();

println("Ending tests.");
