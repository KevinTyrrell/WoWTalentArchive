"use strict";

/* Debug assistance. */
const println = console.log;
const assert = console.assert;

/**
 * Loads a local file using XMLHttpRequest.
 * This method is more modular than directly placing files into the HTML header.
 * @param mimeType MIME type to be used by the server.
 * @see  XMLHttpRequest.overrideMimeType
 * @param path Path to the file.
 * @param callback Callback function to be passed the contents of the file.
 */
const loadFile = function(mimeType, path, callback)
{
    assert(Boolean(mimeType));
    assert(typeof mimeType === "string");
    assert(Boolean(path));
    assert(typeof path === "string");
    assert(Boolean(callback));
    assert(typeof callback === "function");

    const REQUEST_TYPE = "GET";
    const REQUEST_ASYNC = true;

    const request = new XMLHttpRequest();
    request.overrideMimeType(mimeType);
    request.open(REQUEST_TYPE, path, REQUEST_ASYNC);

    const XML_READYSTATE_DONE = 4;
    const HTTP_REQUEST_OK = 200;

    /* Event when state of event changes. */
    request.onreadystatechange = function()
    {
        if (request.readyState === XML_READYSTATE_DONE && request.status === HTTP_REQUEST_OK)
            /* Callback required, as request is asynchronous. */
            callback(request.responseText);
    };

    /* HTTP GET request, so send no data. */
    request.send(null);
};
