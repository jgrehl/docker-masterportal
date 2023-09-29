import crs from "@masterportal/masterportalapi/src/crs";
import {toLonLat, transform} from "ol/proj";

const earthRadius = 6378137;

/**
 * Helper Function to coordinate the calculation of a square.
 * @param {(Event | Object)} event Event sent when drawing a feature on the map or a simple object.
 * @param {module:ol/coordinate~Coordinate} squareCenter The center of the square to be calculated.
 * @param {Number} squareArea The area of the square to be calculated.
 * @returns {void}
 */
function calculateSquare (event, squareCenter, squareArea) {
    // Berechne die Seitenlänge des Quadrats aus dem Flächeninhalt
    const squareSideLength = Math.sqrt(squareArea),
        halfSide = squareSideLength / 2,
        topLeft = [squareCenter[0] - halfSide, squareCenter[1] + halfSide],
        topRight = [squareCenter[0] + halfSide, squareCenter[1] + halfSide],
        bottomLeft = [squareCenter[0] - halfSide, squareCenter[1] - halfSide],
        bottomRight = [squareCenter[0] + halfSide, squareCenter[1] - halfSide],

        // Erzeuge ein Polygon aus den Koordinaten der Quadratseiten
        coordinates = [[topLeft, topRight, bottomRight, bottomLeft, topLeft]];

    event.feature.getGeometry().setCoordinates(coordinates);
}


/**
 * Calculates new flat and extent latitude coordinates for the square feature.
 *
 * @param {module:ol/coordinate~Coordinate} squareCenter The center of the square to be calculated.
 * @param {Number} halfSide The half side length of the square to be calculated.
 * @param {module:ol/Map} map Map object.
 * @returns {module:ol/coordinate~Coordinate} New and transformed extent / flat coordinates of the square.
 */
function getSquareExtentByDistanceLat (squareCenter, halfSide, map) {
    const offsetLat = halfSide,
        squareCenterWGS = toLonLat(squareCenter, crs.getMapProjection(map)),
        deltaLat = offsetLat / earthRadius,
        newPositionLat = squareCenterWGS[1] + deltaLat * 180 / Math.PI;

    return transform([squareCenterWGS[0], newPositionLat], "EPSG:4326", crs.getMapProjection(map));
}

/**
 * Calculates new flat and extent longitude coordinates for the square feature.
 *
 * @param {module:ol/coordinate~Coordinate} squareCenter The center of the square to be calculated.
 * @param {Number} halfSide The half side length of the square to be calculated.
 * @param {module:ol/Map} map Map object.
 * @returns {module:ol/coordinate~Coordinate} New and transformed extent / flat coordinates of the square.
 */
function getSquareExtentByDistanceLon (squareCenter, halfSide, map) {
    const offsetLon = halfSide,
        squareCenterWGS = toLonLat(squareCenter, crs.getMapProjection(map)),
        deltaLon = offsetLon / (earthRadius * Math.cos(Math.PI * squareCenterWGS[1] / 180)),
        newPositionLon = squareCenterWGS[0] + deltaLon * 180 / Math.PI;

    return transform([newPositionLon, squareCenterWGS[1]], "EPSG:4326", crs.getMapProjection(map));
}

export default {
    calculateSquare,
    getSquareExtentByDistanceLat,
    getSquareExtentByDistanceLon
};
