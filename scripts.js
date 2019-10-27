const userTemplate = Handlebars.compile($('#template_user').html());
const pictureTemplate = Handlebars.compile($('#template_picture').html());
const textTemplate = Handlebars.compile($('#template_text').html());
const quoteTemplate = Handlebars.compile($('#template_quote').html());

let categories = ['picture', 'user', 'quote', 'fact'];
let rands = [];

// variables for quotes api
let quotes = [];
let index = 0;

let inputs = [];
let numCompleted = 0;
const TOTAL_QUESTIONS = 5;

$(document).ready(async function() {

  // click begin button
  $('#begin_button').click(function() {
    // hide 1, show 2
    $('#part1').hide();
    $('#part2').show();

    loadRandomBlocks();
  });

  // press enter on input
  $('#input_form').submit(function() {
    event.preventDefault();

    // fetch value from input
    let $input = $(this).children('input');
    let input = $input.val();
    $input.val('');
    inputs.push(input);

    numCompleted++;
    if(numCompleted < TOTAL_QUESTIONS) {
      // refresh for new pair
      loadRandomBlocks()
    }
    else {
      loadPart3();
    }
  });
});

function loadPart3() {
  // fill in data
  $(inputs).each(function(index, input) {
    $('#user_result').append(`<div>${input}</div>`);
  });

  // hide 2, show 3
  $('#part2').hide();
  $('#part3').show();
}

function getRandomNumbers() {
  rands = [
    parseInt(Math.random() * categories.length),
    parseInt(Math.random() * categories.length)
  ];
  while(rands[0] === rands[1]) {
    rands[1] = parseInt(Math.random() * categories.length);
  }
}

function loadRandomBlocks() {
  getRandomNumbers();
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
  parent.html(pictureTemplate({
    type: 'Image',
    id: parseInt(Math.random() * 1085)
  }));

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
      type: 'Fake User',
      address1,
      address2,
      address3,
      name,
      thumbnail: result.picture.large
    }

    parent.html(userTemplate(user));
  }).fail(function(error) {
    console.log('AJAX fail');
  });
}

function getRandomUselessFact(parent) {
  $.ajax({
    method: 'GET',
    url: 'https://uselessfacts.jsph.pl/random.json?language=en',
  }).done(function(results) {
    parent.html(textTemplate({
      type: 'Useless Fact',
      text: results.text
    }))
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
        quotes.push({
          author: quoteInfo.author,
          quote: quoteInfo.body
        });
      });
      index = 0;

      parent.html(quoteTemplate({
        type: 'Quote',
        quote: quotes[index].quote,
        author: quotes[index].author
      }));
    }).fail(function(error) {
      console.log('AJAX fail');
    });
  }
  else {
    parent.html(textTemplate({
      text: quotes[index]
    }));
  }

}
