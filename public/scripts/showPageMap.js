mapboxgl.accessToken = mapBoxToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: campground.geometry.coordinates,
    zoom: 8 // starting zoom
});

const popup = new mapboxgl
    .Popup({ offset: 25})
    .setHTML(`<h5>${campground.title}</h5><p>${campground.location}</p>`)

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)

map.addControl(new mapboxgl.NavigationControl());