$(document).ready(function() {
  // getRandomUser();
  // getRandomUselessFact();
  getRandomQuote();
});

function getRandomPicture(img) {
  img.attr('src', 'https://picsum.photos/200');
}

function getRandomUser() {
  $.ajax({
    method: 'GET',
    url: 'https://randomuser.me/api/',
    dataType: 'json',
  }).done(function(results) {
    // console.log(results);
    let result = results.results[0];
    let address1 = `${result.location.street.number} ${result.location.street.name}`;
    let address2 = `${result.location.city}, ${result.location.state} ${result.location.postcode}`;
    let name = `${result.name.first} ${result.name}`

    let user = {
      address1,
      address2,
      name,
      picture: result.picture.thumbnail
    }

    console.log(user);
  }).fail(function(error) {
    console.log('AJAX fail ' + error);
  });
}

function getRandomUselessFact() {
  $.ajax({
    method: 'GET',
    url: 'https://uselessfacts.jsph.pl/random.json',
  }).done(function(results) {
    console.log(results.text);

  }).fail(function(error) {
    console.log('AJAX fail ' + error);
  });
}

function getRandomQuote() {
  $.ajax({
    method: 'GET',
    url: 'https://favqs.com/api/',
  }).done(function(results) {
    console.log(results);

  }).fail(function(error) {
    console.log('AJAX fail ' + error);
  });
}
