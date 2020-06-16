"use strict";

var direction = "asc";
var table, available;
var intervalBoolean = false;
var sparkJson = [];

function render(parseMessage) {
    var midprice;
    table = document.getElementById("myTable");
    var arr = [];
    var rows = table.getElementsByTagName("TR");
    var thRows = rows[0].getElementsByTagName("TH");
    for (var i = 0; i < thRows.length - 1; i++) {
        arr.push(thRows[i].id);
    }
    // if row is only one i.e. table is empty. Only headers are present
    if (rows.length <= 1) {
        var row = table.insertRow(1);
        for (i = 0; i < arr.length; i++) {
            if (i == 0)
                row.insertCell(i).innerHTML = parseMessage[arr[i]];
            else
                row.insertCell(i).innerHTML = parseMessage[arr[i]].toFixed(4);
        }
        row.insertCell(arr.length).id = parseMessage[arr[0]];
        midprice = (parseMessage.bestBid + parseMessage.bestAsk) / 2;
        pushToSpark(parseMessage[arr[0]], midprice);
    } else {
        available = false;
        // if currencies pair is avaialble in current table then update existing one.
        for (var i = 1; i < rows.length; i++) {
            var colValue = rows[i].getElementsByTagName("TD");
            var tdValue = colValue[0];
            if (tdValue.innerHTML == parseMessage.name) {
                for (var j = 1; j < arr.length; j++) {
                    colValue[j].innerHTML = parseMessage[arr[j]].toFixed(4);
                }
                midprice = (parseMessage.bestBid + parseMessage.bestAsk) / 2;
                sparkJson.forEach(function(item) {
                    if (item.name == parseMessage[arr[0]]) {
                        if (item.values.length >= 10) {
                            item.values.shift();
                            item.values.push(midprice);
                        } else {
                            item.values.push(midprice);
                        }
                    }
                })
                available = true;
            }
        }
        // if currencies pair is not avaialble in current table then insert a new one.
        if (!available) {
            row = table.insertRow(rows.length);
            for (i = 0; i < arr.length; i++) {
                if (i == 0)
                    row.insertCell(i).innerHTML = parseMessage[arr[i]];
                else
                    row.insertCell(i).innerHTML = parseMessage[arr[i]].toFixed(4);
            }
            row.insertCell(arr.length).id = parseMessage[arr[0]];
            midprice = (parseMessage.bestBid + parseMessage.bestAsk) / 2;
            pushToSpark(parseMessage[arr[0]], midprice);
        }
    }

    // after everything done, sort the table.
    sortTable(3, direction);

    // interval to update sparkline graph by 30 seconds.
    if (!intervalBoolean) {
        setInterval(drawSparkline, 30000);
        intervalBoolean = true;
    }

}

// adding new currency sparkline values to array.
function pushToSpark(name, midprice) {
    var jsonObj = {};
    jsonObj.name = name;
    jsonObj.values = [midprice];
    sparkJson.push(jsonObj);
}

// method to draw sparkline
function drawSparkline() {
    sparkJson.forEach(function(item) {
        const exampleSparkline = document.getElementById(item.name);
        Sparkline.draw(exampleSparkline, item.values, {
            tooltip: function(value, index, collection) {
                return (index + 1) + ' , ' + value.toFixed(4);
            }
        });
    })
}

// change the direction.
function changeDirection() {
    direction == "asc" ? direction = "desc" : direction = "asc";
}