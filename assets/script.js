//  JQuery DOM Variables here:
var yogaImg = $('.yoga-img');
var yogaName = $('.yoga-name');
var yogaLink = $('#yoga-link')
var closeIcon = $('#close-icon')
var openIcon = $('#open-icon')
var sanskName = $('.sanskrit-name');
var quoteHere = $("#quote-here");
var quoteAuthor = $("#author");
var checkBox = $('.checkbox')
var yesExercise = $('#yes-exercise')
var noExercise = $('#no-exercise')
var addMoodBtn = $('#add-mood');
var moodRange = $("#test5");
var sleepNum = $('.hour-amount');
var dietChoices = $('.diet-choices');
var thoughtOfDay = $('#thought-of-day');
var breatheBox = $('#breatheBox')
var boxBtn = $('#boxBtn')
var sideNavPosts = $('.sidenav-posts')

var navTemplate = '';
var instance = M.Sidenav.getInstance($('.sidenav'));

var moodBoxTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
var navBoxTime = moment().format("dddd, MMMM Do YYYY");


// Creating a current hour and midnight hour as a conditional for daily refresh
var currentHour = moment().hour();
console.log(currentHour);
var midnightHour = moment().hour(23).format('HH');
console.log(midnightHour);
var hasRunOnce = false;

displayRandExerc();
getQuotesApi();
getRecipe(); //api key has 150 request daily quota

$(document).ready(function() {
  // clears side nav links
  sideNavPosts.empty();
  var localMoodArr = JSON.parse(localStorage.getItem('moodArr')) || [];

  // for every object in local storage:
  for (i = 0; i <localMoodArr.length; i++ ) {
    // future moodbox creation on page-load:
    //   createMoodBox(localMoodArr[i])
    
    // Regenerates side nave links
    createSideNavLinks(localMoodArr[i]);
  // }
  }

  //initializers        
  $('#modal1').modal();
  $('#modal2').modal();
  $('select').formSelect();
  $('.sidenav').sidenav();

  // ATTEMPTING TO CREATE A "ONCE-A-DAY" REFRESH OF TIPS. FEEL FREE TO MESS WITH IT
    // if (!hasRunOnce) {
    //     displayRandExerc();

    
    //     hasRunOnce = true;
    // } else if (midnightHour > currentHour) {
      //     displayRandExerc();
      //     hasRunOnce = false;
      //     return;
      // }
})
    

addMoodBtn.on('click', function() {
  
  // creates object based on results of modal
  var modalSubmit = {
    navTime: navBoxTime,
    time: moodBoxTime,
    mood: moodRange.val(),
    sleep: sleepNum.val(),
    exercise: yesExercise.prop('checked'),
    diet: dietChoices.val(),
    thoughts: thoughtOfDay.val(),
  }

  // gets stred array, puts new object in, and re-stores it.
  var localMoodArr = JSON.parse(localStorage.getItem('moodArr')) || [];
  localMoodArr.push(modalSubmit);
  console.log(localMoodArr);
  localStorage.setItem("moodArr", JSON.stringify(localMoodArr));

  // creates a post link in side nav
  createSideNavLinks(modalSubmit)

})


function createSideNavLinks(post) {
  var statusIcon;

    if (post.mood <= 1) {
      statusIcon = '<i class="material-icons red-text">sentiment_very_dissatisfied</i>'
    } else if (post.mood > 1 & post.mood < 4) {
      statusIcon = '<i class="material-icons orange-text">sentiment_dissatisfied</i>'
    } else if (post.mood > 3 & post.mood < 6) {
      statusIcon = '<i class="material-icons yellow-text accent-3">sentiment_neutral</i>'
    } else if (post.mood > 5 & post.mood < 8) {
      statusIcon = '<i class="material-icons lime-text">sentiment_satisfied</i>'
    } else if (post.mood > 7 & post.mood < 10) {
      statusIcon = '<i class="material-icons light-green-text">sentiment_very_satisfied</i>'
    } else {
      statusIcon = '<i class="material-icons green-text">sentiment_very_satisfied</i>'
    }

  // this variable will go in href, to navigate to post on page.
  var grabTime;

  navTemplate += `<li><a href="#!">${statusIcon}${post.navTime}</a></li>`;

  sideNavPosts.html(navTemplate);
}


function displayRandExerc() {
    var randIndex = Math.floor(Math.random() * 48);
    console.log(randIndex);
    fetch("https://raw.githubusercontent.com/rebeccaestes/yoga_api/master/yoga_api.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var yogaData = data[randIndex]
            yogaImg.attr('src', yogaData.img_url)
            yogaName.text(yogaData.english_name)
            var dropDownIcon = $('<i></i>').text('more_vert');
            dropDownIcon.attr('class', 'material-icons right');
            yogaName.append(dropDownIcon);
            sanskName.text(`The Sanksrit name for this pose is "${yogaData.sanskrit_name}".`);
        });
}


//Inspirational Quotes API
function getQuotesApi() {
    var zenQuote = 'https://type.fit/api/quotes';
    fetch(zenQuote)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {  
        var randomIndex = Math.floor(Math.random() * data.length)   
        console.log(data)
        console.log(data[randomIndex].text, data[randomIndex].author);
        quoteHere.append(data[randomIndex].text);
        if (data[randomIndex].author == null) {
            quoteAuthor.append("Author Unknown")
        } else {
            quoteAuthor.append(data[randomIndex].author)
        }
        console.log(data[randomIndex].author)
    })
};

// fetches recipe for display
function getRecipe () {
  var testRecipeUrl = "https://api.spoonacular.com/recipes/random?number=1&apiKey=c4a52647f4a64446b59c7602af76c88b";

  fetch(testRecipeUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log("getting recipe");
    console.log(data);
  });
}

function ckCheckbox(ckType){
  var checked = document.getElementById(ckType.id);

  if (checked.checked) {
    for(var i=0; i < checkBox.length; i++){

        if(!checkBox[i].checked){
            checkBox[i].disabled = true;
        }else{
            checkBox[i].disabled = false;
        }
    } 
  }
  else {
    for(var i=0; i < checkBox.length; i++){
      checkBox[i].disabled = false;
    } 
  }    
}

//BreatheBox
function animateBox() {
    breatheBox.style.transform = 'scale(0.2)';
    requestAnimationFrame(animateBox);
}
boxBtn.on("click", animateBox)   