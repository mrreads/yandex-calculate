const x_element = document.querySelector('#x-coordinate');
const y_element = document.querySelector('#y-coordinate');
const image_element = document.querySelector('#image-source');
const info_element = document.querySelector('.info');

function calculateCoordinates() {
    let projections = [{ name: 'wgs84Mercator', eccentricity: 0.0818191908426}, { name: 'sphericalMercator', eccentricity: 0 }], 
    params = {
        z: 19,
        geoCoords: [
            parseFloat(x_element.value), 
            parseFloat(y_element.value)
        ],
        projection: projections[0]
   };

    const pixelCoords = fromGeoToPixels(
        params.geoCoords[0],
        params.geoCoords[1],
        params.projection,
        params.z
    );

    const tileNumber = fromPixelsToTileNumber(pixelCoords[0], pixelCoords[1]);
    
    let url = `https://core-carparks-renderer-lots.maps.yandex.net/maps-rdr-carparks/tiles?l=carparks&x=${tileNumber[0]}&y=${tileNumber[1]}&z=${params.z}&scale=1&lang=ru_RU`
    image_element.src = url;
    image_element.alt = `x=${tileNumber[0]}&y=${tileNumber[1]}&z=${params.z}`

    info_element.innerHTML = `
    <p>Уровень масштабирования: <strong>${params.z}</strong>.</p>
    <p>Географические координаты. X: <strong>${params.geoCoords[0]}</strong>, Y: <strong>${params.geoCoords[1]}</strong>.</p>
    <p>Номер тайла: <strong>${tileNumber[0]}</strong> и <strong>${tileNumber[1]}</strong>.</p>
    <p>${params.geoCoords[0]} => ${tileNumber[0]}</p>
    <p>${params.geoCoords[1]} => ${tileNumber[1]}</p>
    `;
}

function fromPixelsToTileNumber (x, y) {
    return [
        Math.floor(x / 256),
        Math.floor(y / 256)
    ];
}

function fromGeoToPixels (lat, long, projection, z) {
    var x_p, y_p,
        pixelCoords,
        tilenumber = [],
        rho,
        pi = Math.PI,
        beta,   
        phi,
        theta,
        e = projection.eccentricity;
 
    rho = Math.pow(2, z + 8) / 2;
    beta = lat * pi / 180;
    phi = (1 - e * Math.sin(beta)) / (1 + e * Math.sin(beta));
    theta = Math.tan(pi / 4 + beta / 2) * Math.pow(phi, e / 2);
    
    x_p = rho * (1 + long / 180);
    y_p = rho * (1 - Math.log(theta) / pi);
    
    return [x_p, y_p];
}

// Функция для расчета номера тайла на основе глобальных пиксельных координат.
function fromPixelsToTileNumber (x, y) {
    return [
        Math.floor(x / 256),
        Math.floor(y / 256)
    ];
}