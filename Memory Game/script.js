const gameContainer = document.getElementById("game");
let count =0
let cardArray = []
let clickCount = 1
let card1 = null
let card2 = null

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card


function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.setAttribute('id',count)
    newDiv.setAttribute('isClicked',false)
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
    cardArray.push(count)
    count++
  }
}

function resetCards(){
  card1.removeAttribute("style")
  card1.setAttribute("isClicked",false)
  card2.removeAttribute("style")
  card2.setAttribute("isClicked",false)
  card1 = null
  card2 = null
}

function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  console.log(event)
  let currentCard = event.target
  currentCard.style.backgroundColor = currentCard.className
  
  card1 = card1 || currentCard;
  card2 = currentCard === card1 ? null : currentCard;
 
  console.log("card1 is ")
  console.log(card1)
  console.log("card2 is ")
  console.log(card2)
  
  card1.setAttribute('isClicked',true)
  if (card2 != null){
    if (card1.style.backgroundColor != card2.style.backgroundColor){
      //cards match
      setTimeout(resetCards,1100)
    }
    else{
      //cards match
      console.log("Its a match!")
      card1.removeEventListener("click",handleCardClick)
      card2.removeEventListener("click",handleCardClick)
      card1 = null
      card2 = null
    }
  }
  clickCount++
}

// when the DOM loads
createDivsForColors(shuffledColors);


