let playerID;

$('form').on('submit', (event) => {
    event.preventDefault();
    const userInput = $('input[type="text"]').val();
     $.ajax({
       url:`http://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='N'&name_part='` + userInput +`%25%27`
    })
    .then(
      (data) => {
      playerID = data.search_player_all.queryResults.row.player_id
      $('#player-name').html(data.search_player_all.queryResults.row.name_display_first_last);
      return $.ajax({
        url: `http://lookup-service-prod.mlb.com/json/named.sport_career_hitting.bam?league_list_id='mlb'&game_type='R'&player_id='`+ playerID + `'`
        });
        
      },
      (error) => {
      console.log('bad request: ', error);
    }
  ).then(
    (data2) => {
      $('#hitting-average').html(data2.sport_career_hitting.queryResults.row.avg);
      $('#hitting-homeruns').html(data2.sport_career_hitting.queryResults.row.hr);
      $('#hitting-rbi').html(data2.sport_career_hitting.queryResults.row.rbi);
      $('#hitting-obp').html(data2.sport_career_hitting.queryResults.row.obp);
      $('#hitting-so').html(data2.sport_career_hitting.queryResults.row.so);
    }
  );
})

$(document).ready(function(){
  $("input[type='radio']").click(function(){
      var playerActivity = $("input[name='activity']:checked").val();
      console.log(playerActivity);
  });
});