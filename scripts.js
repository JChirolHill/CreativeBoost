$(document).ready(function() {
  console.log('hi');
  getRandomUser();
});

function getRandomUser() {
  $.ajax({
    method: 'GET',
    url: 'https://randomuser.me/api/',
    dataType: 'json',
  }).done(function(result) {
    console.log(result);
  }).fail(function(error) {
    console.log('AJAX fail ' + error);
  })
}
