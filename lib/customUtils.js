/**
 * @Tabris-NeDB
 * Workaround wich returns the Time in Milliseconds beginning with a 't'
 * string is sliced to the given length
 *
 * @Original-NeDB
 * Return a random alphanumerical string of length len
 * There is a very small probability (less than 1/1,000,000) for the length to be less than len
 * (il the base64 conversion yields too many pluses and slashes) but
 * that's not an issue here
 * The probability of a collision is extremely small (need 3*10^12 documents to have one chance in a million of a collision)
 * See http://en.wikipedia.org/wiki/Birthday_problem
 */
function uid(len) {
  var id = "t" + Date.now();

  return id.slice(0, len);;
}


// Interface
module.exports.uid = uid;
