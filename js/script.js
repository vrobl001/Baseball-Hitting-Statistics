let playerID;
let playerActivity;
let playerStatus;
let playerLeague;
let avgCheck;
let hrCheck;
let rbiCheck;
let obpCheck;
let soCheck;

function clearAll() {
  const playerInfo = document.getElementById('player-info');
  const playerData = playerInfo.getElementsByClassName('player-stat-info');
  for (let i = 0; i < playerData.length; i++) {
    playerData[i].innerHTML = "";
  }
};

function showImage() {
  document.getElementById('image1').style.visibility='visible';
  document.getElementById('image2').style.visibility='visible';
}

function hideImage() {
  document.getElementById('image1').style.visibility='hidden';
  document.getElementById('image2').style.visibility='hidden';
}

function resetFontColor() {
  document.getElementById("player-league").style.color = "black";
}

function americanLeague() {
  document.getElementById("player-league").style.color = "red";
}

function nationalLeague() {
  document.getElementById("player-league").style.color = "blue";
}

document.getElementById('check-avg').addEventListener("click", (checkAvg) => {
  avgCheck = $("input[name='check-avg']:checked").val();
  $('form').submit();
})

document.getElementById('check-hr').addEventListener("click", (checkhr) => {
  hrCheck = $("input[name='check-hr']:checked").val();
  $('form').submit();
})

document.getElementById('check-rbi').addEventListener("click", (checkrbi) => {
  rbiCheck = $("input[name='check-rbi']:checked").val();
  $('form').submit();
})

document.getElementById('check-obp').addEventListener("click", (checkobp) => {
  obpCheck = $("input[name='check-obp']:checked").val();
  $('form').submit();
})

document.getElementById('check-so').addEventListener("click", (checkso) => {
  soCheck = $("input[name='check-so']:checked").val();
  $('form').submit();
})

$(document).ready(function(){
  $("input[type='radio']").click(function(){
      playerActivity = $("input[name='activity']:checked").val();
      if(playerActivity === 'undefined') {playerStatus = ''}
      else if(playerActivity === 'Active') {playerStatus = `&active_sw='Y'`}
      else if (playerActivity === 'Inactive') {playerStatus = `&active_sw='N'`};
      console.log(playerActivity);
  });
});

$('form').on('submit', (event) => {
    event.preventDefault();
    const userInput = $('input[type="text"]').val();

     $.ajax({
       url:`https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'` + playerStatus + `&name_part='` + userInput +`%25%27`
    }).then(
      (playerInfo) => {
        const playerExists =playerInfo.search_player_all.queryResults.totalSize;
        if(playerExists < 1) {
          clearAll();
          hideImage();
          resetFontColor();
          $('#player-league').html("No players found!");
          document.getElementById('check-avg').checked=false;
          document.getElementById('check-hr').checked=false;
          document.getElementById('check-rbi').checked=false;
          document.getElementById('check-obp').checked=false;
          document.getElementById('check-so').checked=false;
          document.getElementById('active-button').checked=false;
          document.getElementById('inactive-button').checked=false;
          return;
        }

        let activeCheck = playerInfo.search_player_all.queryResults.row.active_sw;

        
        if(activeCheck === "Y") {document.getElementById('active-button').checked=true}
        else {document.getElementById('inactive-button').checked=true};

        let league = playerInfo.search_player_all.queryResults.row.league;
        if(league === 'AL') {
          playerLeague = 'American League';
          document.getElementById("image1").src = "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/American_League_logo.svg/125px-American_League_logo.svg.png";
          document.getElementById("image2").src = "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/American_League_logo.svg/125px-American_League_logo.svg.png";
          americanLeague();
          showImage();
        } else if (league === 'NL') {
          playerLeague = 'National League'
          document.getElementById("image1").src = "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/MLB_National_League_logo.svg/200px-MLB_National_League_logo.svg.png";
          document.getElementById("image2").src = "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/MLB_National_League_logo.svg/200px-MLB_National_League_logo.svg.png";
          nationalLeague();
          showImage();
        };

        playerID = playerInfo.search_player_all.queryResults.row.player_id;
        $('#name').html("Player's Name")
        $('#player-name').html(playerInfo.search_player_all.queryResults.row.name_display_first_last);
        $('#player-league').html(playerLeague);
        $('#player-team').html(playerInfo.search_player_all.queryResults.row.team_full);
        console.log(playerInfo);
        return $.ajax({
          url: `https://lookup-service-prod.mlb.com/json/named.sport_career_hitting.bam?league_list_id='mlb'&game_type='R'&player_id='`+ playerID + `'`
        });
        
      },
      (error) => {
      console.log('bad request: ', error);
    }

  ).then(
    (playerStats) => {
      console.log(playerStats);

      if(avgCheck === "on"){
      $('#avg').html("Hitting Average")
      $('#hitting-average').html(playerStats.sport_career_hitting.queryResults.row.avg);
      } else {
        $('#avg').html('')
      $('#hitting-average').html('');
      };

      if(hrCheck === "on") {
      $('#hr').html("Homeruns")
      $('#hitting-homeruns').html(playerStats.sport_career_hitting.queryResults.row.hr);
      } else {
        $('#hr').html('')
      $('#hitting-homeruns').html('');
      };

      if(rbiCheck === "on") {
      $('#rbi').html("Runs Batted In")
      $('#hitting-rbi').html(playerStats.sport_career_hitting.queryResults.row.rbi);
      } else {
        $('#rbi').html('')
      $('#hitting-rbi').html('');
      };

      if(obpCheck === "on") {
      $('#obp').html("On Base Percentage")
      $('#hitting-obp').html(playerStats.sport_career_hitting.queryResults.row.obp);
      } else {
        $('#obp').html('')
      $('#hitting-obp').html('');
      };

      if(soCheck === "on") {
      $('#so').html("Strike Outs")
      $('#hitting-so').html(playerStats.sport_career_hitting.queryResults.row.so);
      } else {
        $('#so').html('')
      $('#hitting-so').html('');
      };

    }
  );
})
