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
  console.log(avgCheck);
})

document.getElementById('check-hr').addEventListener("click", (checkhr) => {
  hrCheck = $("input[name='check-hr']:checked").val();
  console.log(hrCheck);
})

document.getElementById('check-rbi').addEventListener("click", (checkrbi) => {
  rbiCheck = $("input[name='check-rbi']:checked").val();
  console.log(rbiCheck);
})

document.getElementById('check-obp').addEventListener("click", (checkobp) => {
  obpCheck = $("input[name='check-obp']:checked").val();
  console.log(obpCheck);
})

document.getElementById('check-so').addEventListener("click", (checkso) => {
  soCheck = $("input[name='check-so']:checked").val();
  console.log(soCheck);
})

$(document).ready(function(){
  $("input[type='radio']").click(function(){
      playerActivity = $("input[name='activity']:checked").val();
      if(playerActivity === 'Active') {playerStatus = 'Y'}
      else if (playerActivity === 'Inactive') {playerStatus = 'N'};
  });
});

$('form').on('submit', (event) => {
    event.preventDefault();
    const userInput = $('input[type="text"]').val();
     $.ajax({
       url:`http://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='` + playerStatus + `'&name_part='` + userInput +`%25%27`
    })

    .then(
      (playerInfo) => {
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

// const $tr = $(`
//       <tr>
//         <td><button class="danger">X</button></td>
//         <td class="skillsData">${td.textContent}</td>
//       </tr>`);
//     $('tbody').append($tr);