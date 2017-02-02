var poker = require('../poker.js');
var expect    = require("chai").expect;
var nock    = require("nock");
var lib = require("../lib");
var request = require("request");

var cardResp = [
    {
      "suit": "DIAMONDS",
      "image": "http://deckofcardsapi.com/static/img/0D.png",
      "images": {
        "svg": "http://deckofcardsapi.com/static/img/0D.svg",
        "png": "http://deckofcardsapi.com/static/img/0D.png"
      },
      "code": "0D",
      "value": "10"
    },
    {
      "suit": "SPADES",
      "image": "http://deckofcardsapi.com/static/img/6S.png",
      "images": {
        "svg": "http://deckofcardsapi.com/static/img/6S.svg",
        "png": "http://deckofcardsapi.com/static/img/6S.png"
      },
      "code": "6S",
      "value": "6"
    },
    {
      "suit": "HEARTS",
      "image": "http://deckofcardsapi.com/static/img/JH.png",
      "images": {
        "svg": "http://deckofcardsapi.com/static/img/JH.svg",
        "png": "http://deckofcardsapi.com/static/img/JH.png"
      },
      "code": "JH",
      "value": "JACK"
    },
    {
      "suit": "DIAMONDS",
      "image": "http://deckofcardsapi.com/static/img/2D.png",
      "images": {
        "svg": "http://deckofcardsapi.com/static/img/2D.svg",
        "png": "http://deckofcardsapi.com/static/img/2D.png"
      },
      "code": "2D",
      "value": "2"
    },
    {
      "suit": "CLUBS",
      "image": "http://deckofcardsapi.com/static/img/6C.png",
      "images": {
        "svg": "http://deckofcardsapi.com/static/img/6C.svg",
        "png": "http://deckofcardsapi.com/static/img/6C.png"
      },
      "code": "6C",
      "value": "6"
    }
  ];
  

describe('Poker Rank', function() {
    it('return Ruyal Flush hand', function() {
      expect(poker.hasFlush('AD KD JD 9D TD')).equal("D");
    });
    
    it('return Straight Flush hand', function() {
      expect(poker.hasStraightFlush('4H 3H 6H 5H 7H')).equal("7");
    });
    
    it('return Four Of A Kind hand', function() {
      expect(poker.hasFourOfAKind('9D 9S KH 9H 9C')).equal("9");
    });
    
    it('return Full House hand', function() {
      expect(poker.hasFullHouse('2H 2D 4C 4D 4S')).equal("4");
    });
    
    it('return Flush hand', function() {
      expect(poker.hasFlush('2H 5H 4H 7H 9H')).equal("H");
    });
    
    it('return Straight hand', function() {
      expect(poker.hasStraight('8S 4D 5S 7H 6S')).equal("8");
    });
    
    it('return ThreeOf A Kind hand', function() {
      expect(poker.hasThreeOfAKind('3H 9C 9S 2D 9D')).equal("9");
    });
    
    it('return Two Pairs hand', function() {
      expect(poker.hasTwoPairs('3H 9C 9S 2D 3D')).include('9');
    });
    
    it('return One Pair hand', function() {
      expect(poker.hasPair('5H 5C 6S 7S KD')).equal("5");
    });

    it('return Highest Card hand', function() {
      expect(poker.getHighestCard('5D AC JS 8C 9S')).include("A");
    });
});

describe('Deck API Request', function() {
  var deckRep =   {
      "remaining": 52,
      "success": true,
      "deck_id": "ndtpm3249dd3",
      "shuffled": true
    };
    
    it('return deck id', function() {
      nock('https://deckofcardsapi.com')
       .get('/api/deck/new/shuffle')
       .query({deck_count: '1'})
      .reply(200, deckRep);
      request.get('https://deckofcardsapi.com/api/deck/new/shuffle', function (_,_,resp) {
       expect(resp.deck_id).equal("ndtpm3249dd3");
      });
  });

  it('draw five cards', function() {
    nock('https://deckofcardsapi.com')
     .get('/api/deck/djwv01e7h6k5/draw')
     .query({count: '5'})
     .reply(200, cardResp);
    request.get('https://deckofcardsapi.com/api/deck/djwv01e7h6k5/draw', function (a,b,resp) { 
     expect(resp.length).equal(5);
     expect(resp[0].code).equal("10");
     expect(resp).to.be.instanceof(Array);
    });
  });
});
