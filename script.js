'use strict';



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
   id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration){
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

 _setDescription(){

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
 

  this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;

  }

}

class Running extends workout{
  type = 'running';
  constructor(coords,distance,duration,cadence){
    super(coords,distance,duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace(){
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends workout{
  type = 'cycling';
  constructor(coords,distance,duration,elevationGain){
    super(coords,distance,duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed(){
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}



// ===========================================================

class App{
 
  #map;
  #mapEvent;
  #mapZoom = 16;
  #workouts = [];

// ----------------------------------------------------------------

  constructor(){
    this._getPosition(); 

    form.addEventListener('submit' , this._newWorkout.bind(this));
    inputTypes.addEventListener('change',this._toggleElevationField);
    containerWorkouts.addEventListener('click' , this._moveToPopup.bind(this))

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
  
     this.#map = L.map('map').setView(coords,this.#mapZoom);
  
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

// -----------------------------------------------------------------

 _hideform(){
  
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '' ;

  form.style.display = 'none';
  form.classList.add('hidden');
  setTimeout( () => form.style.display = 'grid', 1000);
 }


// ----------------------------------------------------------------  

  _toggleElevationField(){
    inputElevation.closest('.form-row').classList.toggle('form-row-hidden');
    inputCadence.closest('.form-row').classList.toggle('form-row-hidden'); 
  }

// ----------------------------------------------------------------  

  _newWorkout(e){

    const validInputs = (...inputs) => 
           inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => 
          inputs.every(inp => inp > 0 ) ;      

    e.preventDefault();
 
  //  get data from form
   
   const type = inputTypes.value;
   const distance = +inputDistance.value;
   const duration = +inputDuration.value;
   const {lat,lng} = this.#mapEvent.latlng;
   let workout;

  // if workout running , create running object
  
  if( type === "running"){
    const cadence = +inputCadence.value;
    
  // check if data is valid

  if(
    //  !Number.isFinite(distance) || 
    //  !Number.isFinite(duration) ||
    //  !Number.isFinite(cadence)
    !validInputs(distance,duration,cadence) ||
    !allPositive(distance,duration,cadence)
     )

     return alert('Inputs have to be a positive numbers');

     workout = new Running([lat,lng],distance,duration,cadence);
     
  }
 
  // if workout cycling , create cycling object

  
  if( type === "cycling"){
    const elevation = +inputElevation.value;

      // check if data is valid

    if(
      //  !Number.isFinite(distance) || 
      //  !Number.isFinite(duration) ||
      //  !Number.isFinite(elevation)
      !validInputs(distance,duration,elevation) ||
      !allPositive(distance,duration)
       )
  
       return alert('Inputs have to be a positive numbers');

       workout = new Cycling([lat,lng],distance,duration,elevation);
  }

  // add new object to workout array
 
  this.#workouts.push(workout);

  console.log(this.#workouts);

  // render workoutt on map as marker
   
  this._renderWorkoutMarker(workout) 

   // render workout on list

  this._renderWorkout(workout)

  // hide +  clear input field

  this._hideform();

  }

  // --------------------------------------------------------------

  _renderWorkoutMarker(workout){
   
    L.marker(workout.coords).addTo(this.#map)
    .bindPopup(
      L.popup({
          maxWidth: 250,
          minWidth:100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`
      })
    )
    .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
    .openPopup();
  }

  _renderWorkout(workout){
   let html = `
   <li class="workout workout-${workout.type}" data-id="${workout.id}">
          <h2 class="workout-title">${workout.description}</h2>
          <div class="workout-details">
            <span class="workout-icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
            <span class="workout-value">${workout.distance}</span>
            <span class="workout-unit">km</span>
          </div>
          <div class="workout-details">
            <span class="workout-icon">⏱</span>
            <span class="workout-value">${workout.duration}</span>
            <span class="workout-unit">min</span>
          </div>
   `;

   if(workout.type === 'running'){
    html += `
    <div class="workout-details">
            <span class="workout-icon">⚡️</span>
            <span class="workout-value">${workout.pace.toFixed(1)}</span>
            <span class="workout-unit">min/km</span>
          </div>
          <div class="workout-details">
            <span class="workout-icon">🦶🏼</span>
            <span class="workout-value">${workout.cadence}</span>
            <span class="workout-unit">spm</span>
          </div>
        </li>
    `
   }

   if(workout.type === 'cycling'){
    html += `
    <div class="workout-details">
            <span class="workout-icon">⚡️</span>
            <span class="workout-value">${workout.speed.toFixed(1)}</span>
            <span class="workout-unit">km/h</span>
          </div>
          <div class="workout-details">
            <span class="workout-icon">⛰</span>
            <span class="workout-value">${workout.elevationGain}</span>
            <span class="workout-unit">m</span>
          </div>
        </li>
    `
   }


   form.insertAdjacentHTML('afterend' , html);

  }

  _moveToPopup(e){
   
  const workoutEl = e.target.closest('.workout');
  console.log(workoutEl);

  if(!workoutEl) return;

  const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);
  
  console.log(workout);

  this.#map.setView(workout.coords , this.#mapZoom, {
    pan: {
      duration: 1
    }
  })

}

}

const app = new App();


















// ================================================================


// ----------------------------------------------------------



