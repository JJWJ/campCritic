mapboxgl.accessToken = mapBoxToken;
console.log(campground);
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: campground.geometry.coordinates,
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .set(campground.geometry.coordinates)
    .addTo(map)