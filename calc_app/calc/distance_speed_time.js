
function distance_speed_timeFunction () {

  const distanceInputObject= document.getElementById("distance-input-field")
  const speedInputObject= document.getElementById("speed-input-field")
  const timeInputObject= document.getElementById("time-input-field")

  const distance= distanceInputObject.value
  const speed= speedInputObject.value
  const time= timeInputObject.value

  if (!distance && speed && time) distanceInputObject.value = calcDistance(speed,time)
  if (!speed && distance && time) speedInputObject.value = calcSpeed(distance,time)
  if (!time && distance && speed) timeInputObject.value = calcTime(distance,speed)

}

function calcDistance (speed,time) {
  return speed*time
}

function calcSpeed (distance,time) {
  return distance/time
}

function calcTime (distance,speed) {
  return distance/speed
}

