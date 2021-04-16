var maxTableRow = 0;

document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        // https://stackoverflow.com/questions/4604930/changing-the-keypress
        e.preventDefault();
    } else {
        //console.log(event);
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
    if (init == 0) { init = Math.floor(Math.random() * 20) + 1; }
    if (ac == 0) { ac = 10; }
    if (hp == 0) { hp = 1; }
    //https://stackoverflow.com/questions/6012823/how-to-make-html-table-cell-editable
    // Start the table row, and give a unique ID.
    let newRow = '<tr id="tr' + maxTableRow + '">'
    // Add the name, initiative, Armor Class, and hitpoint sections.
    newRow += '<td contenteditable class="name">' + name + '</td>';
    newRow += '<td contenteditable class="initiative">' + init + '</td>';
    newRow += '<td contenteditable class="armorClass">' + ac + '</td>';
    newRow += '<td contenteditable class="hitPoints">' + hp + '</td>';
    // Add the ability to remove said row.
    newRow += '<td onclick="removeTableRow(' + maxTableRow + ')">Remove</td>'
    // Add the ability to lock said row. (Prevent deletion).
    newRow += '<td><input type="checkbox"></td>'
    // Add the ability to duplicate said row.
    newRow += '<td onclick="duplicateRow(' + maxTableRow + ')">Duplicate</td>';
    newRow += '</tr>'
    // Add the new row to the table.
    $("#textProper tbody").append(newRow);
    // Increment the row.
    maxTableRow++;
}

/** Clears the input values.
 */
function clearInputs() {
    $("#creature").val("");
    $("#init").val("");
    $("#armorClass").val("");
    $("#hitPoints").val("");
}

/** Removes a row from the table with the ("tr" + row) id.
 * 
 * @param {Number} row The row of the table to be removed.
 */
function removeTableRow(row) {
    if (!$("#tr" + row + " input").prop('checked'))
        $("#tr" + row).remove();
}

/** Duplicates a row with the provided tr id, and adds it to the table.
 * 
 * @param {Number} row The ("tr" + row) id of the row to be duplicated.
 */
function duplicateRow(row) {
    tableRow = "#tr" + row;
    addToTable($(tableRow + " .name").html(), $(tableRow + " .initiative").html(), 
        $(tableRow + " .armorClass").html(), $(tableRow + " .hitPoints").html());
}

// https://www.w3schools.com/howto/howto_js_sort_table.asp was the base
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dirAscending, switchcount = 0;
  table = document.getElementById("creatureList");
  rows = table.rows;
  switching = true;
  // Set the sorting direction to ascending:
  if (n == 0)
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
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dirAscending) {
        // The first row is name, and should use alphabetization.
        if (n == 0) {
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
        if (n == 0) {
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
    // print("rows: " + rows.length + " N: " + n);
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
        if (dirAscending && n==0) {
          dirAscending = !dirAscending;
          switching = true;
        } else if (!dirAscending && n != 0) {
          dirAscending = !dirAscending;
          switching = true;
        }
      }
    }
  }
}

/** Print to the console. */
function print() {
    for (i = 0; i < arguments.length; i++) console.log(arguments[i]);
}