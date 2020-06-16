function sortTable(n, dire) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable");
    switching = true;
    //set ascending or descending
    (dire != undefined && direction == "asc") ? dir = dire: dir = direction;
    direction = dir;
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("TR");
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        // if shouldSwitch is true then switch the cell
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        }
    }
}