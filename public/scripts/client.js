$(document).ready(function() {
 console.log('loaded')

  const loadGames = function() {
    $.ajax({
      method: "GET",
      url: "/",
      datatype: "JSON"
    })
    .then(response => {
      // renderGames(response)
    });
  }
  loadGames();

  const renderGames = function(games) {
    for (let game of games) {
      $("#games-container").prepend(game)
    }
  }
  // renderGames(games)



  // $('.game').click(function(event) {
  //   console.log('clicked')
  //   let id = $(this).attr('id')
  //   console.log(typeof (parseInt(id)))
  //   window.location = `/games/${id}`;
  // })

})
