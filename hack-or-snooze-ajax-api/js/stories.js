"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;




async function addStoryToPage(e){
  e.preventDefault()
  const storyData = {
    title: $('#titleSubmit').val(),
    author: $('#authorSubmit').val(),
    url: $('#urlSubmit').val()
  };
  
  //create a story instance
  const story = await storyList.addStory(currentUser,storyData)

  //place story in the DOM
  const $storyMarkup = generateStoryMarkup(story)
  $allStoriesList.prepend($storyMarkup)

  //hide form and reset the values
  $submitLinkForm.hide()
  $('#titleSubmit').val('');
  $('#authorSubmit').val('');
  $('#urlSubmit').val('');

  //add story to owned Stories
  currentUser.ownStories.push
}
$submitLinkBtn.on('click', addStoryToPage)

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  //traverse through current user's favorites and see if there is a match with the story parameter.
  let isFav = currentUser.favorites.some( (s) => {
    return s.storyId === story.storyId
  })

  let starClass = isFav ? "fas fa-star" : "far fa-star";
  let trashHtml ='';
  if(story.username === currentUser.username){
    trashHtml = `<span class="trash-can"><i class="fas fa-trash-alt"> </i></span>`
  }

  return $(`
      <li id="${story.storyId}">
        ${trashHtml}
        <span class="stars"><i class="${starClass}"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//This function handles toggling favorite by calling the API to add/remove it from/to the user's object.
async function starClick(evt){
  console.log(evt);
  const $target = $(evt.target);
  const $li = $target.closest("li");
  const storyId = $li.attr("id");

  //has it been marked as a fav already?
  if( $target.hasClass("far") ){
    //make a new fav
    await currentUser.createFavoriteStory(currentUser, storyId)

    //add the story to the HTML favorites list
    $li.clone().prependTo($favorites)

    //change the star to 'fas'
    $target.closest("i").toggleClass('fas far')

  }
  else{
    await currentUser.removeFavoriteStory(currentUser, storyId)
    $target.closest("i").toggleClass('fas far')
    $(`#favoritesList #${$li.attr('id')}`).remove()
  }
  
  
  $favorites.hide()
}

//generate HTML favorites list from currentUser when called upon. 

function generateFavoritesList(){
  $favorites.empty()

  if(currentUser.favorites !== 0){
    for(let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favorites.append($story);
    }
  }
  $favorites.show();
}

$allStoriesList.on("click", ".stars", starClick);

function generateUserStories() {
  $myStories.empty();

  if (currentUser.ownStories.length !== 0) {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story);
      $myStories.append($story);
    }
  }
  $myStories.show();
}


//Deletes the story from the user. 
async function trashClick(evt) {
  console.log(evt);
  const $target = $(evt.target);
  const $li = $target.closest("li");
  const storyId = $li.attr("id");

  console.log($li)
  console.log(storyId)

  await storyList.removeStory(currentUser, storyId);
  
  // re-generate story list
  await generateUserStories();
}

$myStories.on("click", ".trash-can", trashClick);
