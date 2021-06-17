const API_URL = "https://jservice.io/api";
const NUM_CLUES_PER_CAT = 5
const NUM_CATEGORIES = 6
// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let array = []
    const response = await axios.get(`${API_URL}/categories?count=100`)
    for(let each of response.data)
    {
        array.push(each.id)
    }

    return array
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    let obj = {}
    let cluesArray = []
    let response = await axios.get(`${API_URL}/categories?id=${catId}`)
    obj['title'] = response.data[0].title

    const cluesResponse = await axios.get(`${API_URL}/clues?category=${catId}`)
    for(let each of cluesResponse.data){
        let clueArrObj = {}
        clueArrObj['question'] = each.question
        clueArrObj['answer'] = each.answer
        cluesArray.push(clueArrObj)
    }
    obj['clues'] = cluesArray
    return obj
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_CLUES_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    console.log('fill table called')

    //clearing existing headers and refreshing it
    $("#jeopardy thead").empty()
    $tr = $('<tr>')
      //adding <th> to thead
      for(let i = 0; i < NUM_CATEGORIES; i++){
        // $tr.append(`<th>${categories[i].title}</th>`)
        $tr.append($("<th>").text(categories[i].title));
    }
    $("#jeopardy thead").append($tr)
 
   
    //clearing existing body and refreshing it
    $('#jeopardy tbody').empty()
    for (let clueIdx = 0; clueIdx < NUM_CLUES_PER_CAT; clueIdx++) {
        let $tr = $("<tr>");
        for (let catIdx = 0; catIdx < NUM_CATEGORIES; catIdx++) {
          $tr.append($("<td>").attr("id", `${catIdx}-${clueIdx}`).text("?"));
        }
        $("#jeopardy tbody").append($tr);
      }
}
//fillTable()


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let id = evt.target.id;  // for ex, id is 5-4
    let [catId, clueId] = id.split("-");  //catId = 5, clueID = 4
    let clue = categories[catId].clues[clueId];  //clue = {question: blah, answer: blah, showing null}
    //console.log(clue)
    let msg;
  
    if (!clue.showing) {
      msg = clue.question;
      clue.showing = "question";
    } else if (clue.showing === "question") {
      msg = clue.answer;
      clue.showing = "answer";
    } else {
      // already showing answer; ignore
      return
    }

    // Update text of cell
    $(`#${catId}-${clueId}`).html(msg);
}

//DEBUG
// $('tbody').on('click', function(e){
//     console.log(e)
// })

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    let catIds = await getCategoryIds()
    catIds = shuffle(catIds)

    categories = []
    for(let each of catIds){
        categories.push( await getCategory(each) )
    }

    fillTable()
    console.log('finished setupAndStart')
  }

// /** On click of start / restart button, set up game. */

// $('button').on('click', function(e){
//     e.preventDefault()
//     setupAndStart()
// })

// /** On page load, add event handler for clicking clues */

// $('#jeopardy tbody').on('click','td', function(e){
//   console.log("Clicked on ?")
//   handleClick(e)
// })

// setupAndStart();

//=================================

/** On click of restart button, restart game. */

$("#restart").on("click", setupAndStart);

/** On page load, setup and start & add event handler for clicking clues */

$(async function () {
    setupAndStart();
    $("#jeopardy").on("click", "td", handleClick);
  }
);

