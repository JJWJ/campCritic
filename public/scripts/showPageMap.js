mapboxgl.accessToken = mapBoxToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: campground.geometry.coordinates,
    zoom: 12 // starting zoom
});

const popup = new mapboxgl
    .Popup({ offset: 25})
    .setHTML(`<h5>${campground.title}</h5><p>${campground.location}</p>`)

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)