const userTemplate = Handlebars.compile($('#template_user').html());
const pictureTemplate = Handlebars.compile($('#template_picture').html());
const textTemplate = Handlebars.compile($('#template_text').html());
const quoteTemplate = Handlebars.compile($('#template_quote').html());

// variables for quotes api
let quotes = [];
let index = 0;

$(document).ready(async function() {
  let categories = ['picture', 'user', 'quote', 'fact'];
  let rands = [
    parseInt(Math.random() * categories.length),
    parseInt(Math.random() * categories.length)
  ];

  $('#begin_button').click(function() {
    // hide 1, show 2
    $('#part1').hide();
    $('#part2').show();

    loadRandomBlocks(categories, rands);
  });
});

function loadRandomBlocks(categories, rands) {
  console.log(rands);
  $(rands).each(function(index, randNum) {
    if(categories[randNum] === 'picture') {
      getRandomPicture($(`.random_block:nth-child(${index + 1})`));
    }
    else if(categories[randNum] === 'user') {
      getRandomUser($(`.random_block:nth-child(${index + 1})`));
    }
    else if(categories[randNum] === 'quote') {
      getRandomQuote($(`.random_block:nth-child(${index + 1})`));
    }
    else if(categories[randNum] === 'fact') {
      getRandomUselessFact($(`.random_block:nth-child(${index + 1})`));
    }
    else {
      console.log('ERROR');
    }
  });
}

function getRandomPicture(parent) {
  parent.append(pictureTemplate());
}

function getRandomUser(parent) {
  $.ajax({
    method: 'GET',
    url: 'https://randomuser.me/api/?nat=us,ca,nz,es,fr,gb',
    dataType: 'json',
  }).done(function(results) {
    let result = results.results[0];
    let address1 = `${result.location.street.number} ${result.location.street.name}`;
    let address2 = `${result.location.city}, ${result.location.state} ${result.location.postcode}`;
    let address3 = `${result.location.country}`
    let name = `${result.name.first} ${result.name.last}`;

    let user = {
      address1,
      address2,
      address3,
      name,
      thumbnail: result.picture.large
    }

    parent.append(userTemplate(user));
  }).fail(function(error) {
    console.log('AJAX fail');
  });
}

function getRandomUselessFact(parent) {
  $.ajax({
    method: 'GET',
    url: 'https://uselessfacts.jsph.pl/random.json',
  }).done(function(results) {
    parent.append(textTemplate({text: results.text}))
  }).fail(function(error) {
    console.log('AJAX fail');
  });
}

function getRandomQuote(parent) {
  if(index >= quotes.length) {
    $.ajax({
      method: 'GET',
      url: 'https://favqs.com/api/quotes',
      beforeSend: function(request) {
        request.setRequestHeader('Authorization', 'Token token="9313a2c53feecb17a35185d0b8a1db8c"');
      },
    }).done(function(results) {
      $(results.quotes).each(function(index, quoteInfo) {
        console.log(quoteInfo);
        quotes.push({
          author: quoteInfo.author,
          quote: quoteInfo.body
        });
      });
      index = 0;

      console.log(quotes);
      parent.append(quoteTemplate({
        quote: quotes[index].quote,
        author: quotes[index].author
      }));
    }).fail(function(error) {
      console.log('AJAX fail');
    });
  }
  else {
    parent.append(textTemplate({
      text: quotes[index]
    }));
  }

}
