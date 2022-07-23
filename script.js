'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputTypes = document.querySelector('.form-input-type');
const inputDistance = document.querySelector('.form-input-distance');
const inputDuration = document.querySelector('form-input-duration');
const inputCadence = document.querySelector('.form-input-cadence');
const inputElevation = document.querySelector('.form-input-elevation');

let map,mapEvent;


// ===========================================================

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(function(Position){
    const {latitude} = Position.coords;
    const {longitude} = Position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

   const coords = [latitude,longitude]

   map = L.map('map').setView(coords,15);

   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


map.on('click', (mapE) => {
  mapEvent = mapE
 form.classList.remove('hidden');
 inputDistance.focus();

})



  },function(){
    alert(`Couldn't get your position!!`)
  })
}


// ----------------------------------------------------------

form.addEventListener('submit' , (e) => {

  e.preventDefault();

  inputDistance.value = '' ;
  

  const {lat,lng} = mapEvent.latlng;

      L.marker({lat,lng}).addTo(map)
      .bindPopup(
        L.popup({
            maxWidth: 250,
            minWidth:100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup'
        })
      )
      .setPopupContent('Workout!')
      .openPopup();


})

inputTypes.addEventListener('change',()=>{
  inputElevation.closest('.form-row').classList.toggle('form-row-hidden');
  inputCadence.closest('.form-row').classList.toggle('form-row-hidden');
})