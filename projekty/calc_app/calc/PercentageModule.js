
let percentage=""

percentage+= '<div class="input-container-group">'

percentage+= '<p class="short_foreword_explanation-paragraph">put only two of three values, without unit of measure<p>'

percentage+= '<div class="input-container">'
percentage+=   '<input type="text" id="percentage-input-field" name="percentageInput" autofocus size="5" class="input-field">'
percentage+=   '<label for="distance" class="input-label">%, that equals </label>'

percentage+=   '<input type="text" id="part_of_whole-input-field" name="part_of_wholeInput" size="5" class="input-field">'
percentage+=   '<label for="time" class="input-label">this part of the whole</label>'
percentage+= '</div>'

percentage+= '<div class="input-container">'
percentage+=   '<input type="text" id="whole-input-field" name="wholeInput" size="5" class="input-field">'
percentage+=   '<label for="time" class="input-label">whole, the 100%</label>'
percentage+= '</div>'

percentage+= '<div class="calculate-input-button-container">'
percentage+=   '<input type="button" value="calculate last value" id="calculate-percentage-input-button" class="calculate-input-button" name="calculatePercentageInputButton" size="20" onClick="percentageFunction()">'
percentage+= '</div>'

percentage+= '</div>'


percentage+= '<div class="input-container-group">'

percentage+= '<p class="short_foreword_explanation-paragraph">additional values, if needed (add only one of the pair)<p>'

percentage+= '<div class="input-container">'
percentage+=   '<input type="text" id="add1-percentage-input-field" name="add1PercentageInput" autofocus size="5" class="input-field">'
percentage+=   '<label for="distance" class="input-label">% equals </label>'

percentage+=   '<input type="text" id="add1-part_of_whole-input-field" name="add1Part_of_wholeInput" size="5" class="input-field">'
percentage+=   '<label for="time" class="input-label"> part</label>'
percentage+= '</div>'

percentage+= '<div class="input-container">'
percentage+=   '<input type="text" id="add2-percentage-input-field" name="add2PercentageInput" autofocus size="5" class="input-field">'
percentage+=   '<label for="distance" class="input-label">% equals </label>'

percentage+=   '<input type="text" id="add2-part_of_whole-input-field" name="add2Part_of_wholeInput" size="5" class="input-field">'
percentage+=   '<label for="time" class="input-label"> part</label>'
percentage+= '</div>'

percentage+= '<div class="input-container">'
percentage+=   '<input type="text" id="add3-percentage-input-field" name="add3PercentageInput" autofocus size="5" class="input-field">'
percentage+=   '<label for="distance" class="input-label">% equals </label>'

percentage+=   '<input type="text" id="add3-part_of_whole-input-field" name="add3Part_of_wholeInput" size="5" class="input-field">'
percentage+=   '<label for="time" class="input-label"> part</label>'
percentage+= '</div>'

percentage+= '</div>'

export default percentage

