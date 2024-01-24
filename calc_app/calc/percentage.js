
function percentageFunction () {

  const percentageInputObject  = document.getElementById("percentage-input-field")
  const partOfWholeInputObject = document.getElementById("part_of_whole-input-field")
  const wholeInputObject       = document.getElementById("whole-input-field")

  const percentage  = percentageInputObject.value
  const partOfWhole = partOfWholeInputObject.value
  const whole       = wholeInputObject.value

  const add1PercentageInputObject  = document.getElementById("add1-percentage-input-field")
  const add1PartOfWholeInputObject = document.getElementById("add1-part_of_whole-input-field")
  const add2PercentageInputObject  = document.getElementById("add2-percentage-input-field")
  const add2PartOfWholeInputObject = document.getElementById("add2-part_of_whole-input-field")
  const add3PercentageInputObject  = document.getElementById("add3-percentage-input-field")
  const add3PartOfWholeInputObject = document.getElementById("add3-part_of_whole-input-field")
  const added1Percentage  = add1PercentageInputObject.value
  const added1PartOfWhole = add1PartOfWholeInputObject.value
  const added2Percentage  = add2PercentageInputObject.value
  const added2PartOfWhole = add2PartOfWholeInputObject.value
  const added3Percentage  = add3PercentageInputObject.value
  const added3PartOfWhole = add3PartOfWholeInputObject.value


  if (!percentage && partOfWhole && whole) percentageInputObject.value = calcPercentage(partOfWhole,whole)
  if (!partOfWhole && percentage && whole) partOfWholeInputObject.value = calcPartOfWhole(percentage,whole)
  if (!whole && percentage && partOfWhole) wholeInputObject.value = calcWhole(percentage,partOfWhole)

  if (!added1Percentage && added1PartOfWhole) add1PercentageInputObject.value = calcPercentage(added1PartOfWhole,wholeInputObject.value)    // there need be "wholeInputObject.value" instead of variable "whole", since for case user left whole input field blank, variable "whole" gained zero value, and calculation above will not fix "whole" variable after calculation, but put result to input field
  if (!added1PartOfWhole && added1Percentage) add1PartOfWholeInputObject.value = calcPartOfWhole(added1Percentage,wholeInputObject.value)
  if (!added2Percentage && added2PartOfWhole) add2PercentageInputObject.value = calcPercentage(added2PartOfWhole,wholeInputObject.value)
  if (!added2PartOfWhole && added2Percentage) add2PartOfWholeInputObject.value = calcPartOfWhole(added2Percentage,wholeInputObject.value)
  if (!added3Percentage && added3PartOfWhole) add3PercentageInputObject.value = calcPercentage(added3PartOfWhole,wholeInputObject.value)
  if (!added3PartOfWhole && added3Percentage) add3PartOfWholeInputObject.value = calcPartOfWhole(added3Percentage,wholeInputObject.value)

}

function calcPercentage (partOfWhole,whole) {
  return partOfWhole/whole *100
}

function calcPartOfWhole (percentage,whole) {
  return percentage/100 *whole
}

function calcWhole (percentage,partOfWhole) {
  return 100/percentage *partOfWhole
}



