// JQuery DOM Variables
const yogaImg = $(".yoga-img");
const yogaName = $(".yoga-name");
const yogaLink = $("#yoga-link");
const closeIcon = $("#close-icon");
const openIcon = $("#open-icon");
const sanskName = $(".sanskrit-name");
const quoteHere = $("#quote-here");
const quoteAuthor = $("#author");
const checkBox = $(".checkbox");
const yesExercise = $("#yes-exercise");
const noExercise = $("#no-exercise");
const addMoodBtn = $("#add-mood");
const moodRange = $("#test5");
const sleepNum = $(".hour-amount");
const dietChoices = $(".diet-choices");
const dietChoice = $(".diet-option");
const thoughtOfDay = $("#thought-of-day");
const breatheBox = $("#breatheBox");
const boxBtn = $("#boxBtn");
const select = $("select");
const sideNavPosts = $(".sidenav-posts");
const sleepTipButton = $("#generate");
const sleepTipElement = $("#sleep-tip");

const sleepTips = [
  "Sleep in a Pitch Black Room",
  "Keep Your Bedtime Consistent",
  "Wear Blue Light Blocking Glasses Before Bed",
  "Avoid Late-Night Meals",
  "Be Hydrated",
  "Have Pre-Sleep Routine",
  "Have a “Can’t Sleep” Backup Plan",
  "Increase bright light exposure during the day",
  "Don’t consume caffeine late in the day",
  "Set your bedroom temperature",
  "Reduce irregular or long daytime naps",
  "Take a relaxing bath or shower",
  "Exercise regularly — but not before bed",
];

// breathing exercise prompts
const boxTextArray = ["Breathe In...", "Hold...", "Breathe Out...", "Hold..."];

let boxTimer;
let navTemplate = "";
let moodBoxTemplate = "";

// check to see if page has been visited today
const hasVisitedRecently = dayCheck();

let moodBoxTime = moment().format("dddd, MMMM Do YYYY, h:mm a");
let navBoxTime = moment().format("dddd, MMMM Do");

// retrieve saved entries from local storage and place them in an array
const localMoodArr = JSON.parse(localStorage.getItem("moodArr")) || [];

M.Sidenav.getInstance($(".sidenav"));

// await doc readiness before fetching data
$(document).ready(function () {
  $("#stopBtn").hide();

  getQuote();
  getYoga();
  getSleep();
  getRecipe();
  writeMoodEntries();

  //initializers
  $("#modal1").modal();
  $("#modal2").modal();
  $("select").formSelect();
  $(".sidenav").sidenav({
    draggable: true,
  });
  $(".collapsible").collapsible();
});

$(document).on("click", ".removeButton", function () {
  $(this).closest("section").remove();
  for (i = 0; i < localMoodArr.length; i++) {
    if ($(this).closest("section").attr("id") === localMoodArr[i].time) {
      localMoodArr.splice(i, 1);
      localStorage.setItem("moodArr", JSON.stringify(localMoodArr));
    }
    writeMoodEntries();
  }
});

function getQuote() {
  const dailyQuote = JSON.parse(localStorage.getItem("dailyQuote"));
  if (dailyQuote && hasVisitedRecently) {
    writeQuote(dailyQuote);
  } else {
    fetch("https://type.fit/api/quotes")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const randomIndex = Math.floor(Math.random() * data.length);
        localStorage.setItem("dailyQuote", JSON.stringify(data[randomIndex]));
        writeQuote(data[randomIndex]);
      });
  }
}

function writeQuote(quoteData) {
  quoteHere.append(quoteData.text);
  quoteAuthor
    ? quoteAuthor.append(quoteData.author)
    : quoteAuthor.append("Author Unknown");
}

function getYoga() {
  const dailyPose = JSON.parse(localStorage.getItem("dailyPose"));
  if (dailyPose && hasVisitedRecently) {
    writeYoga(dailyPose);
  } else {
    fetch(
      "https://raw.githubusercontent.com/rebeccaestes/yoga_api/master/yoga_api.json"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const randIndex = Math.floor(Math.random() * data.length);
        localStorage.setItem("dailyPose", JSON.stringify(data[randIndex]));
        writeYoga(data[randIndex]);
      });
  }
}

function writeYoga(yogaData) {
  yogaImg.attr("src", yogaData.img_url);
  yogaName.text(yogaData.english_name);

  const dropDownIcon = $("<i></i>").text("more_vert");
  dropDownIcon.attr("class", "material-icons right");
  yogaName.append(dropDownIcon);
  sanskName.text(
    `The Sanksrit name for this pose is "${yogaData.sanskrit_name}".\n 36 million people in the US regularly practice yoga.`
  );
}

function getSleep() {
  const dailySleep = JSON.parse(localStorage.getItem("dailySleep"));
  if (dailySleep && hasVisitedRecently) {
    sleepTipElement.text(dailySleep);
  } else {
    const randomIndex = Math.floor(Math.random() * sleepTips.length);
    localStorage.setItem("dailySleep", JSON.stringify(sleepTips[randomIndex]));
    sleepTipElement.text(sleepTips[randomIndex]);
  }
}

sleepTipButton.on("click", function () {
  const randomIndex = Math.floor(Math.random() * sleepTips.length);
  sleepTipElement.text(sleepTips[randomIndex]);
});

function getRecipe() {
  const dailyRecipe = JSON.parse(localStorage.getItem("dailyRecipe"));
  if (dailyRecipe && hasVisitedRecently) {
    writeRecipe(dailyRecipe);
  } else {
    const recipeUrl =
      "https://api.spoonacular.com/recipes/complexSearch?apiKey=198c96c33ce745628b902946d8818677&addRecipeInformation=true&number=100&tags=healthy&sort=healthiness";

    fetch(recipeUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        localStorage.setItem(
          "dailyRecipe",
          JSON.stringify(data.results[randomIndex])
        );
        writeRecipe(data.results[randomIndex]);
      });
  }
}

function writeRecipe(recipeData) {
  const titleSpan = $("#recipe-title");
  titleSpan.text(recipeData.title);

  const dropDownIcon = $("<i></i>").text("more_vert");
  dropDownIcon.attr("class", "material-icons right");
  titleSpan.append(dropDownIcon);

  $("#recipe-image")
    .attr("src", recipeData.image)
    .attr("alt", recipeData.title);
  $("#recipe-source").attr("href", recipeData.sourceUrl);

  const recipeSum = recipeData.summary;

  // split summary into str array
  // note that this also splits dollar amounts
  const sumArray = recipeSum.split(".");

  // create new summary to write to card
  let revisedSummmary = "";
  for (let i = 0; i < sumArray.length - 1; i++) {
    // skip sentences that contain unwanted promotional data
    if (
      !sumArray[i].includes("<a") &&
      !sumArray[i].includes("a>") &&
      !sumArray[i].includes("/recipes/") &&
      !sumArray[i].includes("tried") &&
      !sumArray[i].includes("made") &&
      !sumArray[i].includes("found") &&
      !sumArray[i].includes("impressed") &&
      !sumArray[i].includes("liked") &&
      !sumArray[i].includes("brought") &&
      !sumArray[i].includes("score")
    ) {
      // if the str includes a dollar sign, concat strings so $ per serving displays correctly
      if (sumArray[i].includes("$")) {
        revisedSummmary += sumArray[i] + "." + sumArray[i + 1] + ". ";
        i += 2;
      } else {
        revisedSummmary += sumArray[i] + ". ";
      }
    }
  }
  $("#recipe-summary").html(revisedSummmary);
}

function writeMoodEntries() {
  $("#mood-box-entries").empty();
  moodBoxTemplate = "";

  sideNavPosts.empty();
  navTemplate = "";

  for (i = 0; i < localMoodArr.length; i++) {
    createMoodBox(localMoodArr[i]);
    createSideNavLinks(localMoodArr[i]);
  }

  $("#mood-box-entries").html(moodBoxTemplate);
  sideNavPosts.html(navTemplate);

  if (moodBoxTemplate === "") {
    moodBoxTemplate =
      '<div class="center placeholder-text">Add a daily update here by using the "Add Update" button above!</div>';
    $("#mood-box-entries").html(moodBoxTemplate);
  }
}

addMoodBtn.on("click", function () {
  const modalSubmit = {
    navTime: navBoxTime,
    time: moodBoxTime,
    mood: moodRange.val(),
    sleep: sleepNum.val(),
    exercise: yesExercise.prop("checked"),
    notExercise: noExercise.prop("checked"),
    diet: dietChoices.val(),
    thoughts: thoughtOfDay.val(),
  };

  localMoodArr.unshift(modalSubmit);
  localStorage.setItem("moodArr", JSON.stringify(localMoodArr));

  writeMoodEntries();

  moodRange.val("");
  sleepNum.attr("value", "");
  sleepNum.val("");
  thoughtOfDay.val("");
  select.prop("selectedIndex", 0);
  select.formSelect();
  yesExercise.prop("checked", false);
  noExercise.prop("checked", false);
  yesExercise.prop("disabled", false);
  noExercise.prop("disabled", false);
  $(".placeholder-text").prop("display", "none");
});

// creates an html template for a mood entry
function createMoodBox(post) {
  if (post.mood <= 1) {
    statusIcon =
      '<i class="material-icons red-text">sentiment_very_dissatisfied</i>';
  } else if ((post.mood > 1) & (post.mood < 4)) {
    statusIcon =
      '<i class="material-icons orange-text">sentiment_dissatisfied</i>';
  } else if ((post.mood > 3) & (post.mood < 6)) {
    statusIcon =
      '<i class="material-icons yellow-text accent-3">sentiment_neutral</i>';
  } else if ((post.mood > 5) & (post.mood < 8)) {
    statusIcon = '<i class="material-icons lime-text">sentiment_satisfied</i>';
  } else if ((post.mood > 7) & (post.mood < 10)) {
    statusIcon =
      '<i class="material-icons light-green-text">sentiment_very_satisfied</i>';
  } else {
    statusIcon =
      '<i class="material-icons green-text">sentiment_very_satisfied</i>';
  }

  let exerciseText;

  if (post.exercise) {
    exerciseText = "I exercised!";
  } else if (post.notExercise) {
    exerciseText = `I'll exercise tomorrow!`;
  } else {
    exerciseText = "";
  }

  let dietText;

  if (post.diet < 3 && post.diet > 0) {
    dietText = "I ate healthy!";
  } else if (post.diet > 2) {
    dietText = "Gotta eat better!";
  } else {
    dietText = "";
  }

  let sleepText = `I slept ${post.sleep} hours.`;

  if (post.sleep === null) {
    sleepText = "";
  }

  let quoteIt;

  if (post.thoughts === "") {
    quoteIt = `I didn't feel like journaling today.`;
  } else {
    quoteIt = `${post.thoughts}`;
  }
  moodBoxTemplate += `
  <section class="card row horizontal mood-box" id="${post.time}">
    <div class="col s12 timestamp-container">
        <div class="row status">
        <div class="col s4 status-time">${post.time}</div>
            <div class="col s4 status-emoticon"><p class="feeling-text">I'm Feeling: ${statusIcon}</p></div>
            <div class="col s4 status-placeholder"> <a class="waves-effect waves-light removeButton"><i class="material-icons close">close</i></a></div>
        </div>
        <div class="divider"></div>
        <div class="row zenthoughts-container">
            <div class="col s12 m2 l2 card-image zen-box">
                <img class="zen-pic materialboxed" id='first-zen' src="./assets/images/lotus.png" >
            </div>
            <div class="col s12 m8 l8 thoughts-box"><p class="thoughts-text">${quoteIt}</p></div>
            <div class="col s12 m2 l2 card-image zen-box">
            <img class="zen-pic materialboxed" id='second-zen' src="./assets/images/lotus.png" >
            </div>
        </div>
            <div class="col s12 divider"></div>
            <div class="row status">
              <div class="col s4 feeling-text sleep-text">${sleepText}</div>
              <div class="col s4 status-emoticon"><p class="feeling-text exercise-text">${exerciseText}</p></div>
              <div class="col s4 feeling-text diet-text">${dietText}</div>
            </div>
    </div>
  </section>`;
}

function createSideNavLinks(post) {
  let statusIcon;
  if (post.mood <= 1) {
    statusIcon =
      '<i class="material-icons red-text">sentiment_very_dissatisfied</i>';
  } else if ((post.mood > 1) & (post.mood < 4)) {
    statusIcon =
      '<i class="material-icons orange-text">sentiment_dissatisfied</i>';
  } else if ((post.mood > 3) & (post.mood < 6)) {
    statusIcon =
      '<i class="material-icons yellow-text accent-3">sentiment_neutral</i>';
  } else if ((post.mood > 5) & (post.mood < 8)) {
    statusIcon = '<i class="material-icons lime-text">sentiment_satisfied</i>';
  } else if ((post.mood > 7) & (post.mood < 10)) {
    statusIcon =
      '<i class="material-icons light-green-text">sentiment_very_satisfied</i>';
  } else {
    statusIcon =
      '<i class="material-icons green-text">sentiment_very_satisfied</i>';
  }
  navTemplate += `<li><a class="sidenav-close" href="#${post.time}">"${statusIcon}${post.navTime}"</a></li>`;
}

function dayCheck() {
  const currentDay = parseInt(moment().format("DDD"));
  const referenceDay = parseInt(localStorage.getItem("refDay"));
  if (referenceDay && currentDay == referenceDay) {
    return true;
  } else {
    localStorage.setItem("refDay", currentDay);
    return false;
  }
}

// checks to see if checkbox is checked, then disables the other
function ckCheckbox(ckType) {
  const checked = document.getElementById(ckType.id);

  if (checked.checked) {
    for (let i = 0; i < checkBox.length; i++) {
      if (!checkBox[i].checked) {
        checkBox[i].disabled = true;
      } else {
        checkBox[i].disabled = false;
      }
    }
  } else {
    for (let i = 0; i < checkBox.length; i++) {
      checkBox[i].disabled = false;
    }
  }
}

// begins breathing exercise
boxBtn.on("click", function () {
  $("#stopBtn").show();
  boxBtn.hide();
  let i = 0;
  $(".boxText").html(boxTextArray[i]);
  breatheBox.toggleClass("movingBox");
  boxTimer = setInterval(function () {
    i++;
    if (i >= boxTextArray.length) {
      i = 0;
    }
    $(".boxText").html(boxTextArray[i]);
  }, 4 * 1000);
});

// ends breathing exercise
$("#stopBtn").on("click", function () {
  boxBtn.show();
  $("#stopBtn").hide();
  i = 0;
  clearInterval(boxTimer);
  breatheBox.toggleClass("movingBox");
  $(".boxText").empty();
  return;
});
