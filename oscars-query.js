/*  *************************
    Internet Web Technologies
    2020-2021 Coursework #1
    Sicong Chen 13185775
    *************************  */

// ********************
// varibles declaration
// ********************

// variables to store user input
let inputYear = "";
let inputCategory = "";
let inputNominee = "";
let inputInfo = "";
let inputNomineeInfo = "";
let selectedYear = "none";
let selectedWon = "none";

// other variables
let filePath = "oscars.json";


// **************
// event handlers
// **************

// event handler: DOM ready
$(function () {
    // fetch data
    $.getJSON(filePath, function (data) {
        // set up select year drop down list
        setUpSelectYear(data);
    })
});

// event handler - search button clicked
$("#btn-search").click(function () {
    // check input conflicts
    if (checkYearConflict() || checkNomineeInfoConflict()) return;
    // fetch data
    $.getJSON(filePath, function (data) {
        // filter data
        data = filterData(data);
        // display data
        displayData(data);
    }
    )
});

// event handler - clear button clicked
$("#btn-clear").click(function () {
    // set all variables back to default values
    inputYear = "";
    inputCategory = "";
    inputNominee = "";
    inputInfo = "";
    inputNomineeInfo = "";
    selectedYear = "none";
    selectedWon = "none";
    // reset input and select boxes
    $("#txt-year").val("");
    $("#txt-cat").val("");
    $("#txt-nominee").val("");
    $("#txt-info").val("");
    $("#txt-nominee-info").val("");
    $("#select-won option:first").prop('selected', true);
    $("#select-year option:first").prop('selected', true);
});

// event handler - input year changed
$("#txt-year").change(function () {
    inputYear = this.value;
})

// event handler - input category changed
$("#txt-cat").change(function () {
    inputCategory = this.value;
})

// event handler - input nominee changed
$("#txt-nominee").change(function () {
    inputNominee = this.value;
})

// event handler - input info changed
$("#txt-info").change(function () {
    inputInfo = this.value;
})

// event handler - input nominee info changed
$("#txt-nominee-info").change(function () {
    inputNomineeInfo = this.value;
})

// event handler - select year changed
$("#select-year").change(function () {
    selectedYear = this.value;
})

// event handler - select won changed
$("#select-won").change(function () {
    if (this.value === "won") selectedWon = "yes";
    else if (this.value === "not-won") selectedWon = "no"
    else selectedWon = "none";
})


// *********
// functions
// *********

function setUpSelectYear(data) {
    // create a set to store years (unique value)
    let years = new Set();
    data.forEach(entry => years.add(entry.Year));
    // append option elements to the select element
    years.forEach(year => {
        let option = "<option value='" + year + "'>" + year + "</option>";
        $("#select-year").append(option);
    });
}

function checkYearConflict() {
    // test if both input year and select year are set
    let yearConflict = (inputYear !== "") && (selectedYear !== "none");
    if (yearConflict) {
        alert("ERROR: Filter by year and Select a year cannot be set at the same time.");
        return true;
    }
    else return false;
}

function checkNomineeInfoConflict() {
    // test if both filter by nominee (info) and filter by nominee or info are set
    let nomineeOrInfoFilled = (inputNominee !== "") || (inputInfo !== "");
    let nomineeInfoConflict = nomineeOrInfoFilled && (inputNomineeInfo !== "");
    if (nomineeInfoConflict) {
        alert("ERROR: Filter by nominee (info) and Filter by nominee or info cannot be set at the same time.");
        return true;
    }
    else return false;
}

function filterData(data) {
    if (inputYear !== "") data = filterDataByInputYear(data);
    if (inputCategory !== "") data = filterDataByInputCategory(data);
    if (inputNominee !== "") data = filterDataByInputNominee(data);
    if (inputInfo !== "") data = filterDataByInputInfo(data);
    if (inputNomineeInfo !== "") data = filterDataByInputNomineeInfo(data);
    if (selectedWon !== "none") data = filterDataBySelectWon(data);
    if (selectedYear !== "none") data = filterDataBySelectYear(data);
    return data;
}

function filterDataByInputYear(data) {
    return data.filter(entry => entry.Year.includes(inputYear));
}

function filterDataByInputCategory(data) {
    return data.filter(entry => entry.Category.includes(inputCategory));
}

function filterDataByInputNominee(data) {
    return data.filter(entry => entry.Nominee.includes(inputNominee));
}

function filterDataByInputInfo(data) {
    return data.filter(entry => entry.Info.includes(inputInfo));
}

function filterDataByInputNomineeInfo(data) {
    return data.filter(entry => entry.Nominee.includes(inputNomineeInfo) ||
        entry.Info.includes(inputNomineeInfo));
}

function filterDataBySelectWon(data) {
    return data.filter(entry => entry.Won === selectedWon);
}


function filterDataBySelectYear(data) {
    return data.filter(entry => entry.Year === selectedYear);
}


function displayData(data) {
    // remove table data and summary is exist
    $(".datarow").remove();
    $("#summary").remove();
    // add table data
    data.forEach(entry => {
        let row = "<tr class='datarow'>";
        row += "<td>" + entry.Year + "</td>";
        row += "<td>" + entry.Category + "</td>";
        row += "<td>" + entry.Nominee + "</td>";
        row += "<td>" + entry.Info + "</td>";
        row += "<td>" + entry.Won + "</td>";
        row += "</tr>";
        $("#data").append(row);
    })
    // add summary below the table
    summary = "<p id='summary'><b>" + data.length + "</b> results found.</p>";
    $("#main").append(summary);
}
