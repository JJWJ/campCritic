const form = document.querySelector('[name=newCampForm]');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(document.querySelector('[name=newCampForm]'));
    const newFormData = new FormData();
    const xhr = new XMLHttpRequest();
    const data = {};
    for (let [key, value] of formData) {
        data[key] = value;
    };
    newFormData.append('campground[title]', data['campground[title]']);
    newFormData.append('campground[location]', data['campground[location]']);
    newFormData.append('campground[description]', data['campground[description]']);
    newFormData.append('campground[price]', data['campground[price]']);
    newFormData.append('images', data['images']);
    xhr.open('POST', '/campground', true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.send(newFormData);
});