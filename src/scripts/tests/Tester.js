"use strict";

function a(y)
{
    let x = y;

    function b()
    {
        return x;
    }

    return b;
}

let c = a(5);
let d = a(3);
c();
c();
c();
d();
c();
