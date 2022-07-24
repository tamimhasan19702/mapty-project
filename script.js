'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputTypes = document.querySelector('.form-input-type');
const inputDistance = document.querySelector('.form-input-distance');
const inputDuration = document.querySelector('.form-input-duration');
const inputCadence = document.querySelector('.form-input-cadence');
const inputElevation = document.querySelector('.form-input-elevation');

// ===========================================================

class workout {
   date = new Date();
   id = (new Date() + '').slice(-10);

  constructor(coords, distance, duration){
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends workout{
  constructor(coords,distance,duration,cadence){
    super(coords,distance,duration);
    this,cadence = cadence;
    this.calcPace();
  }
  calcPace(){
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends workout{
  constructor(coords,distance,duration,elevationGain){
    super(coords,distance,duration);
    this,elevationGain = elevationGain;
   this.calcSpeed();
  }
  calcSpeed(){
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const run1 = new Running([39,-120],5.2,24,178)
const cyc1 = new Cycling([39,-12],28,95,523)

console.log(run1,cyc1);

// ===========================================================

class App{
 
  #map;
  #mapEvent;

// ----------------------------------------------------------------

  constructor(){
    this._getPosition(); 

    form.addEventListener('submit' , this._newWorkout.bind(this));
    inputTypes.addEventListener('change',this._toggleElevationField)

  }


// ----------------------------------------------------------------

  _getPosition(){

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
        alert(`Couldn't get your position!!`)
      })
    }
    
  }


// ----------------------------------------------------------------  

  _loadMap(Position){   
      const {latitude} = Position.coords;
      const {longitude} = Position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
  
     const coords = [latitude,longitude]
  
     this.#map = L.map('map').setView(coords,16);
  
     L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.#map);
  
  
  this.#map.on('click', this._showForm.bind(this))
 
  }


// ----------------------------------------------------------------  

  _showForm(mapE){
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

// ----------------------------------------------------------------  

  _toggleElevationField(){
    inputElevation.closest('.form-row').classList.toggle('form-row-hidden');
    inputCadence.closest('.form-row').classList.toggle('form-row-hidden'); 
  }

// ----------------------------------------------------------------  

  _newWorkout(e){
    e.preventDefault();

  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '' ;
   

  const {lat,lng} = this.#mapEvent.latlng;

      L.marker({lat,lng}).addTo(this.#map)
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
  }

}

const app = new App();


















// ================================================================


// ----------------------------------------------------------



