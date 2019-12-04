let playerID;
let playerActivity;
let playerStatus;
let playerLeague;
let avgCheck;
let hrCheck;
let rbiCheck;
let obpCheck;
let soCheck;

//helps clear checked boxes when starting a new search.
function handleUnselect() {
  Array.from($('input[type="checkbox"]')).forEach(el => {
    if(el.checked) {
      el.checked = false
    }
  });
}

//oes through all displayed data and clears them.
function clearAll() {
  const playerInfo = document.getElementById('player-info');
  const playerData = playerInfo.getElementsByClassName('player-stat-info');
  for (let i = 0; i < playerData.length; i++) {
    playerData[i].innerHTML = "";
  }
  playerID = null;
};

//used to display normally hidden image of what team the player plays for.
function showImage() {
  document.getElementById('image1').style.visibility='visible';
  document.getElementById('image2').style.visibility='visible';
}

//hides the image (mostly for when search is bad).
function hideImage() {
  document.getElementById('image1').style.visibility='hidden';
  document.getElementById('image2').style.visibility='hidden';
}

//font's for team and league name normally match. This resets to black for bad searches.
function resetFontColor() {
  document.getElementById("player-league").style.color = "black";
}

//if player plays for American league, then this will be used to change to red.
function americanLeague() {
  document.getElementById("player-league").style.color = "red";
}

//if player plays for National league, then this will be used to change to blue.
function nationalLeague() {
  document.getElementById("player-league").style.color = "blue";
}

//toggles stat perimeter and resubmits form.
document.getElementById('check-avg').addEventListener("click", (checkAvg) => {
  if(!playerID) {
    return
  };
  avgCheck = $("input[name='check-avg']:checked").val();
  $('form').submit();
})

document.getElementById('check-hr').addEventListener("click", (checkhr) => {
  if(!playerID) {
    return
  };
  hrCheck = $("input[name='check-hr']:checked").val();
  $('form').submit();
})

document.getElementById('check-rbi').addEventListener("click", (checkrbi) => {
  if(!playerID) {
    return
  };
  rbiCheck = $("input[name='check-rbi']:checked").val();
  $('form').submit();
})

document.getElementById('check-obp').addEventListener("click", (checkobp) => {
  if(!playerID) {
    return
  };
  obpCheck = $("input[name='check-obp']:checked").val();
  $('form').submit();
})

document.getElementById('check-so').addEventListener("click", (checkso) => {
  if(!playerID) {
    return
  };
  soCheck = $("input[name='check-so']:checked").val();
  $('form').submit();
})

//radio button allows faster search if user knows player's active status (not necessary to work).
$(document).ready(function(){
  $("input[type='radio']").click(function(){
      playerActivity = $("input[name='activity']:checked").val();
      if(playerActivity === 'undefined') {playerStatus = ''}
      else if(playerActivity === 'Active') {playerStatus = `&active_sw='Y'`}
      else if (playerActivity === 'Inactive') {playerStatus = `&active_sw='N'`};
      console.log(playerActivity);
  });
});

//Accepts text to search for player. Accentuations not required.
$('form').on('submit', (event) => {
    event.preventDefault();
    handleUnselect();
    const userInput = $('input[type="text"]').val();

//Player status as well as search input are injected here.
     $.ajax({
       url:`https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'` + playerStatus + `&name_part='` + userInput +`%25%27`
    }).then(

//Looks up the number of results and if less than 0, resets displayed data.
      (playerInfo) => {
        const playerExists = playerInfo.search_player_all.queryResults.totalSize;
        if(playerExists <1) {
//reset functions from earlier are called here
          clearAll();
          hideImage();
          resetFontColor();
          $('#player-league').html("No players found!");
          playerExists = 0;
          document.getElementById('check-avg').checked=false;
          document.getElementById('check-avg').textContent = '';
          document.getElementById('check-hr').checked=false;
          document.getElementById('check-hr').textContent = '';
          document.getElementById('check-rbi').checked=false;
          document.getElementById('check-rbi').textContent = '';
          document.getElementById('check-obp').checked=false;
          document.getElementById('check-obp').textContent = '';
          document.getElementById('check-so').checked=false;
          document.getElementById('check-so').textContent = '';
          document.getElementById('active-button').checked=false;
          document.getElementById('inactive-button').checked=false;
          return;
        }

//if active/inactive was not selected by user, radio buttons are updated accordingly.    
        let activeCheck = playerInfo.search_player_all.queryResults.row.active_sw;
        if(activeCheck === "Y") {document.getElementById('active-button').checked=true}
        else {document.getElementById('inactive-button').checked=true};

//api showed league as either AL or NL. This changes it to the full spellings.
        let league = playerInfo.search_player_all.queryResults.row.league;
        if(league === 'AL') {
          playerLeague = 'American League';

//league logos are now approriately displayed as well as changing the team name's to the appropriate but darker color.
          document.getElementById("image1").src = "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/American_League_logo.svg/125px-American_League_logo.svg.png";
          document.getElementById("image2").src = "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/American_League_logo.svg/125px-American_League_logo.svg.png";
          americanLeague();
          document.getElementById("player-team").style.color = "darkred"
          showImage();
        } else if (league === 'NL') {
          playerLeague = 'National League'
          document.getElementById("image1").src = "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/MLB_National_League_logo.svg/200px-MLB_National_League_logo.svg.png";
          document.getElementById("image2").src = "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/MLB_National_League_logo.svg/200px-MLB_National_League_logo.svg.png";
          nationalLeague();
          document.getElementById("player-team").style.color = "darkblue"
          showImage();
        };

//Player ID is stored to get info from a new ajax regarding what kind of stats are looked for (in this case only hitting stats)        
        playerID = playerInfo.search_player_all.queryResults.row.player_id;

//displays player's name, which league they're in, and what team they're with. This is the very minimum assuming no stat perimeters were checked.       
        let currentTeam = playerInfo.search_player_all.queryResults.row.team_full
        $('#name').html("Player's Name")
        $('#player-name').html(playerInfo.search_player_all.queryResults.row.name_display_first_last);
        $('#player-league').html(playerLeague);
        $('#player-team').html(currentTeam);

//player ID is now called to find hitting stats
        return $.ajax({
          url: `https://lookup-service-prod.mlb.com/json/named.sport_career_hitting.bam?league_list_id='mlb'&game_type='R'&player_id='`+ playerID + `'`
        });
        
      },
      (error) => {
      console.log('bad request: ', error);
    }

  ).then(
    (playerStats) => {

//Booleans were used to make sure only information that the user selected would be displayed. If perimeters were checked then the function would fill in '' into the info.
      if(avgCheck === "on"){
        if(!playerID) {
          return
        };
      $('#avg').html("Hitting Average")
      $('#hitting-average').html(playerStats.sport_career_hitting.queryResults.row.avg);
      } else {
        $('#avg').html('')
      $('#hitting-average').html('');
      };

      if(hrCheck === "on") {
        if(!playerID) {
          return
        };
      $('#hr').html("Homeruns")
      $('#hitting-homeruns').html(playerStats.sport_career_hitting.queryResults.row.hr);
      } else {
        $('#hr').html('')
      $('#hitting-homeruns').html('');
      };

      if(rbiCheck === "on") {
        if(!playerID) {
          return
        };
      $('#rbi').html("Runs Batted In")
      $('#hitting-rbi').html(playerStats.sport_career_hitting.queryResults.row.rbi);
      } else {
        $('#rbi').html('')
      $('#hitting-rbi').html('');
      };

      if(obpCheck === "on") {
        if(!playerID) {
          return
        };
      $('#obp').html("On Base Percentage")
      $('#hitting-obp').html(playerStats.sport_career_hitting.queryResults.row.obp);
      } else {
        $('#obp').html('')
      $('#hitting-obp').html('');
      };

      if(soCheck === "on") {
        if(!playerID) {
          return
        };
      $('#so').html("Strike Outs")
      $('#hitting-so').html(playerStats.sport_career_hitting.queryResults.row.so);
      } else {
        $('#so').html('')
      $('#hitting-so').html('');
      };

    }
  );
})
