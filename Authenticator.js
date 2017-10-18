// From http://jalaj.net/blog/2012/09/13/hex-to-from-ascii-in-javascript/
function hex2asc(pStr) {
    var tempstr = '';
    for (b = 0; b < pStr.length; b = b + 2) {
        tempstr = tempstr + String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
    }
    return tempstr;
}

/**
 * Create authentication string (security key) for access to video
 *
 * @param {string} preSharedSecret The secret key. Must match with EOV project's "video_authenticator_secret" setting
 * @param {string} algorithm       Name of algorithm used. Must match EOV project's
 *                                 "video_authenticator_hash_algorithm" setting. Supported values: "sha1", "noop".
 * @param {string} uid             UID used in current PURL (personalized URL)
 * @param {string} timestamp       UNIX timestamp in seconds precision (not JS timestamp!)
 *
 * @return {string} URL-encoded authentication string
 */

function createAuthenticationString(preSharedSecret, algorithm, uid, timestamp) {
    var combined  = uid + ':' + timestamp;
    if (algorithm == "noop") {
        var encrypted = combined;
    } else if (algorithm == "sha1") {
        var encrypted = CryptoJS.HmacSHA1(combined, preSharedSecret);
    } else {
        throw new Error("Unsupported algorithm " + algorithm);
    }
    // Encrypted is stored as an array of 32-bit ints - Adding '' converts it to an easier-to-handle hex representation
    var asc = hex2asc(encrypted + '');
    var base64 = window.btoa(asc);
    var urlencoded = encodeURIComponent(base64);
    return urlencoded;
}
