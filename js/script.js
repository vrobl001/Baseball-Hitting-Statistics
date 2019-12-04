let playerID;
let playerActivity;
let playerStatus;
let playerLeague;
let avgCheck;
let hrCheck;
let rbiCheck;
let obpCheck;
let soCheck;

document.getElementById('check-avg').addEventListener("click", (checkAvg) => {
  avgCheck = $("input[name='check-avg']:checked").val();
})

document.getElementById('check-hr').addEventListener("click", (checkhr) => {
  hrCheck = $("input[name='check-hr']:checked").val();
})

document.getElementById('check-rbi').addEventListener("click", (checkrbi) => {
  rbiCheck = $("input[name='check-rbi']:checked").val();
})

document.getElementById('check-obp').addEventListener("click", (checkobp) => {
  obpCheck = $("input[name='check-obp']:checked").val();
})

document.getElementById('check-so').addEventListener("click", (checkso) => {
  soCheck = $("input[name='check-so']:checked").val();
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
       url:`http://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'` + playerStatus + `&name_part='` + userInput +`%25%27`
    })

    .then(
      (playerInfo) => {
      let activeCheck = playerInfo.search_player_all.queryResults.row.active_sw;
      if(activeCheck === "Y") {document.getElementById('active-button').checked=true}
      else {document.getElementById('inactive-button').checked=true}
      
      let league = playerInfo.search_player_all.queryResults.row.league;
      if(league === 'AL') {
        playerLeague = 'American League'
      } else if (league === 'NL') {
        playerLeague = 'National League'
      }
      playerID = playerInfo.search_player_all.queryResults.row.player_id;
      $('#name').html("Player's Name")
      $('#player-name').html(playerInfo.search_player_all.queryResults.row.name_display_first_last);
      $('#player-league').html(playerLeague);
      $('#player-team').html(playerInfo.search_player_all.queryResults.row.team_full);
      console.log(playerInfo)
      return $.ajax({
        url: `http://lookup-service-prod.mlb.com/json/named.sport_career_hitting.bam?league_list_id='mlb'&game_type='R'&player_id='`+ playerID + `'`
        });
        
      },

      (error) => {
      console.log('bad request: ', error);
    }

  ).then(
    (playerStats) => {
      console.log(playerStats)
      if(avgCheck === "on"){
      $('#avg').html("Hitting Average")
      $('#hitting-average').html(playerStats.sport_career_hitting.queryResults.row.avg);
      };
      if(hrCheck === "on") {
      $('#hr').html("Homeruns")
      $('#hitting-homeruns').html(playerStats.sport_career_hitting.queryResults.row.hr);
      };
      if(rbiCheck === "on") {
      $('#rbi').html("Runs Batted In")
      $('#hitting-rbi').html(playerStats.sport_career_hitting.queryResults.row.rbi);
      };
      if(obpCheck === "on") {
      $('#obp').html("On Base Percentage")
      $('#hitting-obp').html(playerStats.sport_career_hitting.queryResults.row.obp);
      };
      if(soCheck === "on") {
      $('#so').html("Strike Outs")
      $('#hitting-so').html(playerStats.sport_career_hitting.queryResults.row.so);
      };
    }
  );
})