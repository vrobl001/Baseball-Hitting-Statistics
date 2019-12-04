let playerID;
let playerActivity;
let playerStatus;
let playerLeague;

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
      $('#hitting-average').html(playerStats.sport_career_hitting.queryResults.row.avg);
      $('#hitting-homeruns').html(playerStats.sport_career_hitting.queryResults.row.hr);
      $('#hitting-rbi').html(playerStats.sport_career_hitting.queryResults.row.rbi);
      $('#hitting-obp').html(playerStats.sport_career_hitting.queryResults.row.obp);
      $('#hitting-so').html(playerStats.sport_career_hitting.queryResults.row.so);
    }
  );
})
