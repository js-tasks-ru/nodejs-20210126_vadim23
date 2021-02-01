const isNumber = (number) => typeof number === 'number' && isFinite(number)

function sum(a, b) {
    if (!isNumber(a) || !isNumber(b)) {
        throw new TypeError()
    }
    return a + b
}

module.exports = sum;
