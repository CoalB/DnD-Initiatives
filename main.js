var maxTableRow = 0;

document.addEventListener("keypress", function (e) {
  // For the enter key, prevent making a newline. Instead leave the element.
  if (e.key === "Enter") {
      // https://stackoverflow.com/questions/4604930/changing-the-keypress
      e.preventDefault();
      document.activeElement.blur();
  } else {
      //print(event);
  }
});

/** Adds a row to the table with a unique id, and the provided statistics.
 * 
 * @param {String} name The creature's name.
 * @param {Number} init The creature's initiative.
 * @param {Number} ac   The creature's armor class.
 * @param {Number} hp   The creature's hit points.
 */
function addToTable(name, init, ac, hp) {
    clearInputs();
    if (name == "") { name = "placeholder"; }
    // Initiative is between 1 and 20.
    if (init == 0) { init = roll(20); }
    if (ac == 0) { ac = 10; }
    if (hp == 0) { hp = 1; }
    //https://stackoverflow.com/questions/6012823/how-to-make-html-table-cell-editable
    // Start the table row, and give a unique ID.
    let newRow = '<tr id="tr' + maxTableRow + '">'
    // Add the name, initiative, Armor Class, and hitpoint sections.
    newRow += '<td> <div contenteditable class="name">' + name + '</div> </td>';
    newRow += '<td> <div contenteditable class="initiative">' + init + '</div> </td>';
    newRow += '<td> <div contenteditable class="armorClass">' + ac + '</div> </td>';
    newRow += '<td> <div contenteditable class="hitPoints">' + hp + '</div> </td>';
    // Add the ability to remove said row.
    newRow += '<td> <button onclick="removeTableRow(' + maxTableRow + ')" class="remove btn">Remove</button> </td>'
    // Add the ability to lock said row. (Prevent removal).
    newRow += '<td> <input type="checkbox" class="locker"></td>'
    // Add the ability to duplicate said row.
    newRow += '<td> <button onclick="duplicateRow(' + maxTableRow + ')" class="duplicate btn dupe">Duplicate</button> </td>';
    newRow += '</tr>'
    // Add the new row to the table.
    $("#creatureTable tbody").append(newRow);
    // Increment the row.
    maxTableRow++;
}

/** Rolls a number of dice in the table, with the number of sides provided, and shows the results in the die results textarea. '0' is used for the custom die.
 * 
 * @param {Number} dieSides The number of sides the die that's trying to roll has.
 */
function rollDice(dieSides) {
  // Grab all the text that exists in the textarea previously.
  var appendText = $("#dieResults").val();
  // dieResults will hold each individual roll, and dieTotal will take a cumulative total.
  let dieResults = [], dieTotal = 0;
  let numRolls = $("#D" + dieSides + "Roller").val();
  // If the value for number of dice is empty, then default to 1 die roll.
  if (!numRolls) numRolls = 1;
  // If it's the custom die grab the proper number instead of '0' default.
  if (!dieSides) {
    let newNumber = $("#D0Roller2").val()
    // If the value is empty, then default to a 1 sided die.
    dieSides = (newNumber) ? newNumber:1;
  }
  // Show the user the combination of dice they're rolling.
  let prependText = numRolls + "d" + dieSides + ": (";

  // Show the result of each die roll.
  for (let i = 0; i < numRolls; i++) {
    dieResults[i] = roll(dieSides);
    prependText += dieResults[i] + ", ";
    dieTotal += dieResults[i];
  }
  // Remove extra the comma, and space.
  prependText = prependText.slice(0,-2);
  // Add the total of the dice rolled to the text.
  prependText += ")\nTotal: " + dieTotal + "\n";
  // https://stackoverflow.com/questions/23700824/after-erasing-clearing-a-textarea-i-can-no-longer-append-text-to-it/23701067
  $("#dieResults").val(prependText + "\n" + appendText);
}

/** Returns a random number from 1 to the given number.
 * 
 * @param {Number} number The roof for the random number.
 * @returns A random number from 1 to the given number.
 */
function roll(number, modifier = 0) {
  number = Math.floor(Math.random() * number) + modifier + 1;
  if (number < 1) number = 1;
  return number;
}

/** Clears the input values for name, initiaitve, ac, and hp.
 */
function clearInputs() {
  $("#creature").val("");
  $("#init").val("");
  $("#armorClass").val("");
  $("#hitPoints").val("");
}

/** Removes a row from the table with the ("tr" + row) id.
 * 
 * @param {Number} row The id number of the row to be removed.
 */
function removeTableRow(row) {
    if (!$("#tr" + row + " input").prop('checked'))
        $("#tr" + row).remove();
}

/** Duplicates a row with the provided ("tr" + row) id, and adds it to the table.
 * The new entry has a unique id.
 * 
 * @param {Number} row The id number of the row to be duplicated.
 */
function duplicateRow(row) {
    let tableRow = "#tr" + row;
    // Copy all attributes except for the initiative so that it may be different.
    addToTable($(tableRow + " .name").html(), 0, 
        $(tableRow + " .armorClass").html(), $(tableRow + " .hitPoints").html());
}

// https://www.w3schools.com/howto/howto_js_sort_table.asp was the base
function sortTable(col) {
  var table, rows, switching, i, x, y, shouldSwitch, dirAscending, switchcount = 0;
  table = document.getElementById("creatureList");
  switching = true;
  // Set the sorting direction to ascending for names, and descending for numbers.
  if (col == 0)
    dirAscending = true;
  else
    dirAscending = false;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 0; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      // Pulling DIV's instead of TD as that was not working out with the divs inside of each td.
      x = rows[i].getElementsByTagName("Div")[col];
      y = rows[i + 1].getElementsByTagName("Div")[col];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dirAscending) {
        // The first row is name, and should use alphabetization.
        if (col == 0) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
          // All other rows should have numerical comparisons.
        } else {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      } else if (!dirAscending) {
        // The first row is name, and should use alphabetization.
        if (col == 0) {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
          // All other rows should have numerical comparisons.
        } else {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0) {
        if (dirAscending && col == 0) {
          dirAscending = !dirAscending;
          switching = true;
        } else if (!dirAscending && col != 0) {
          dirAscending = !dirAscending;
          switching = true;
        }
      }
    }
  }
}

/** Make the dice rolling tables.
 */
function startup() {
  makeDieTable("#dieRoller1", [100, 20, 12, 10]);
  makeDieTable("#dieRoller2", [8, 6, 4, 0]);
}

/** Easily sets up the tables for rolling dice.
 * Editing the tables is significantly easier this way.
 * @param {String} id The id of the table to constructed. Including the #.
 * @param {Array} list A 1-D array with all dice that will be in that table. '0' is for the custom die.
 */
function makeDieTable(id, list){
  let dieInput = '<input type="number" value="1" min="1" max="100" class="dieInput"';
  let tableHtml = '<tr><th>X Dice</th><th>Die</th><th>Action</th>';
  for (let i = 0; i < list.length; i++) {
    let row = '<tr><td>' + dieInput + 'id="D';
    row += list[i];
    row += 'Roller"></td><td>';
    if (list[i]) {
      row += 'D' + list[i];
    } else {
      row += dieInput + 'id="D';
      row += list[i];
      row += 'Roller2">';
    }
    row += '</td><td><button class="btn" onclick="rollDice(';
    row += list[i];
    row += ')">Roll</button></td></tr>'
    tableHtml += row;
  }
  $(id).html(tableHtml);
}

/** Print to the console. */
function print() {
    for (i = 0; i < arguments.length; i++) console.log(arguments[i]);
}

$(startup);