/**
 * Helper Function to coordinate the calculation of a square.
 * @param {Object} feature The square feature.
 * @param {module:ol/coordinate~Coordinate} squareCenter The center of the square to be calculated.
 * @param {Number} squareArea The area of the square to be calculated.
 * @returns {void}
 */
function calculateSquare (feature, squareCenter, squareArea) {
    // Berechne die Seitenlänge des Quadrats aus dem Flächeninhalt
    const squareSideLength = Math.sqrt(squareArea),
        halfSide = squareSideLength / 2,
        topLeft = [squareCenter[0] - halfSide, squareCenter[1] + halfSide],
        topRight = [squareCenter[0] + halfSide, squareCenter[1] + halfSide],
        bottomLeft = [squareCenter[0] - halfSide, squareCenter[1] - halfSide],
        bottomRight = [squareCenter[0] + halfSide, squareCenter[1] - halfSide],

        // Erzeuge ein Polygon aus den Koordinaten der Quadratseiten
        coordinates = [[topLeft, topRight, bottomRight, bottomLeft, topLeft]];

    feature.getGeometry().setCoordinates(coordinates);
}

export default {
    calculateSquare
};
