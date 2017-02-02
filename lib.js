var request = require("request");
var _ = require("lodash");
var poker = require("./poker.js");

module.exports = {
  getDeckID: getDeckID,
}

function getDeckID() {
  var options = { method: 'GET',
    url: 'https://deckofcardsapi.com/api/deck/new/shuffle/',
    qs: { deck_count: '1' },
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    drawCard(body.deck_id);
  });
}


function drawCard(id) {
  var cards = [];
  var options = { method: 'GET',
    url: 'https://deckofcardsapi.com/api/deck/'+id+'/draw',
    qs: { count: '5' },
    json: true,
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    _.forEach(body.cards, (k) => {
      cards.push(k.code);
    })
    cards = _.join(cards, " ");
    console.log(cards);
    console.log("Player Rank => ", poker.getHandStrength(cards));
  });
}
