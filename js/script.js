let playerID;
let playerActivity;
let playerStatus;
let playerLeague;
let avgCheck;
let hrCheck;
let rbiCheck;
let obpCheck;
let soCheck;
let playerExists;
var americanLeagueLogo = "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/American_League_logo.svg/125px-American_League_logo.svg.png";
var nationalLeagueLogo = "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/MLB_National_League_logo.svg/200px-MLB_National_League_logo.svg.png";

function clearInfo() {
  const playerData = document.getElementsByClassName('player-stat-info');
  for(let i = 0; i < playerData.length; i++) playerData[i].textContent = "";
};

function noResults() {
    clearInfo();
    hideImage();
    resetFontColor();
    document.getElementById('active-button').checked=false;
    document.getElementById('inactive-button').checked=false;
    playerStatus = undefined;
    playerExists = undefined;
    if(playerActivity === 'Active') {
      $('#player-league').html("No active player with that name found!");
      playerActivity = undefined;
    }
    else if (playerActivity === 'Inactive') {
      $('#player-league').html("No inactive player with that name found!");
      playerActivity = undefined;
    }
    else {
      $('#player-league').html("No players found!");
      playerActivity = undefined;
    };
    return;
}

function showImage() {
  const images = document.getElementsByClassName('images');
  for(let i = 0; i < images.length; i++) images[i].style.visibility='visible';};

function hideImage() {
  const images = document.getElementsByClassName('images');
  for(let i = 0; i < images.length; i++) images[i].style.visibility='hidden';};

function resetFontColor() {document.getElementById("player-league").style.color = "black";};

function americanLeague() {
  playerLeague = 'American League';
  const images = document.getElementsByClassName("images")
  for(let i = 0; i < images.length; i++) images[i].src = americanLeagueLogo;
  document.getElementById("player-league").style.color = "red";
  document.getElementById("player-team").style.color = "darkred";
  showImage();
};

function nationalLeague() {
  playerLeague = 'National League';
  const images = document.getElementsByClassName("images")
  for(let i = 0; i < images.length; i++) images[i].src = nationalLeagueLogo;
  document.getElementById("player-league").style.color = "blue";
  document.getElementById("player-team").style.color = "darkblue";
  showImage();
};

function toggleStats() {if(playerExists == 1) $('form').submit();};

document.getElementById('check-avg').addEventListener("click", (checkAvg) => {
  avgCheck = $("input[id='check-avg']:checked").val();
  toggleStats();
});

document.getElementById('check-hr').addEventListener("click", (checkHr) => {
  hrCheck = $("input[id='check-hr']:checked").val();
  toggleStats();
});

document.getElementById('check-rbi').addEventListener("click", (checkRbi) => {
  rbiCheck = $("input[id='check-rbi']:checked").val();
  toggleStats();
});

document.getElementById('check-obp').addEventListener("click", (checkObp) => {
  obpCheck = $("input[id='check-obp']:checked").val();
  toggleStats();
});

document.getElementById('check-so').addEventListener("click", (checkSo) => {
  soCheck = $("input[id='check-so']:checked").val();
  toggleStats();
});

$(document).ready(radioListen => {
  $("input[type='radio']").click(checkPlayerActivity => {
      playerActivity = $("input[name='activity']:checked").val();
      if(playerActivity === 'undefined') {playerStatus = ''}
      else if(playerActivity === 'Active') {playerStatus = `&active_sw='Y'`}
      else if (playerActivity === 'Inactive') {playerStatus = `&active_sw='N'`};
  });
});

$('form').on('submit', (event) => {
    event.preventDefault();
    const userInput = $('input[type="text"]').val();
     $.ajax({
       url:`https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'` + playerStatus + `&name_part='` + userInput +`'`
    }).then(
      (playerInfo) => {
        playerExists = playerInfo.search_player_all.queryResults.totalSize;
        if(playerExists < 1) noResults();

        let activeCheck = playerInfo.search_player_all.queryResults.row.active_sw;
        if(activeCheck === "Y") {document.getElementById('active-button').checked=true}
        else {document.getElementById('inactive-button').checked=true};

        let league = playerInfo.search_player_all.queryResults.row.league;
        if(league === 'AL') americanLeague();
        else if(league === 'NL') nationalLeague();
    
        playerID = playerInfo.search_player_all.queryResults.row.player_id; 
        $('#name').html("Player's Name")
        $('#player-name').html(playerInfo.search_player_all.queryResults.row.name_display_first_last);
        $('#player-league').html(playerLeague);
        $('#player-team').html(playerInfo.search_player_all.queryResults.row.team_full);

        return $.ajax({
          url: `https://lookup-service-prod.mlb.com/json/named.sport_career_hitting.bam?league_list_id='mlb'&game_type='R'&player_id='`+ playerID + `'`
        });

      },
      (error) => {
      console.log('bad request: ', error);
    }

  ).then(
    (playerStatsInfo) => {

      if(avgCheck === "on"){
      $('#avg').html("Hitting Average")
      $('#hitting-average').html(playerStatsInfo.sport_career_hitting.queryResults.row.avg);
      } else {
        $('#avg').html('')
      $('#hitting-average').html('');
      };

      if(hrCheck === "on") {
      $('#hr').html("Homeruns")
      $('#hitting-homeruns').html(playerStatsInfo.sport_career_hitting.queryResults.row.hr);
      } else {
        $('#hr').html('')
      $('#hitting-homeruns').html('');
      };

      if(rbiCheck === "on") {
      $('#rbi').html("Runs Batted In")
      $('#hitting-rbi').html(playerStatsInfo.sport_career_hitting.queryResults.row.rbi);
      } else {
        $('#rbi').html('')
      $('#hitting-rbi').html('');
      };

      if(obpCheck === "on") {
      $('#obp').html("On Base Percentage")
      $('#hitting-obp').html(playerStatsInfo.sport_career_hitting.queryResults.row.obp);
      } else {
        $('#obp').html('')
      $('#hitting-obp').html('');
      };

      if(soCheck === "on") {
      $('#so').html("Strike Outs")
      $('#hitting-so').html(playerStatsInfo.sport_career_hitting.queryResults.row.so);
      } else {
        $('#so').html('')
      $('#hitting-so').html('');
      };

    }
  );
})
