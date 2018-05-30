"use strict";

println("Starting tests.");

const a = Structure.new();
println(a);
const b = { };
println(Structure.hasInstance(a));
println(Structure.hasInstance(b));

println("Ending tests.");
