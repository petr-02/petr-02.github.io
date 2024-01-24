
let distance_speed_time=""

distance_speed_time+= '<div class="input-container-group">'

distance_speed_time+= '<div class="input-container">'
distance_speed_time+=   '<input type="text" id="distance-input-field" name="distanceInput" autofocus size="5" class="input-field">'
distance_speed_time+=   '<label for="distance" class="input-label">miles</label>'
distance_speed_time+= '</div>'

distance_speed_time+= '<div class="input-container">'
distance_speed_time+=   '<input type="text" id="speed-input-field" name="speedInput" size="5" class="input-field">'
distance_speed_time+=   '<label for="speed" class="input-label">mph</label>'
distance_speed_time+= '</div>'

distance_speed_time+= '<div class="input-container">'
distance_speed_time+=   '<input type="text" id="time-input-field" name="timeInput" size="5" class="input-field">'
distance_speed_time+=   '<label for="time" class="input-label">hours</label>'
distance_speed_time+= '</div>'

distance_speed_time+= '<div class="calculate-input-button-container">'
distance_speed_time+=   '<input type="button" value="calculate last value" id="calculate-distance_speed_time-input-button" class="calculate-input-button" name="calculateDistanceSpeedTimeInputButton" size="20" onClick="distance_speed_timeFunction()">'
distance_speed_time+= '</div>'

distance_speed_time+= '</div>'

export default distance_speed_time

