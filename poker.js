var _ = require('lodash');
var cardOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];


function countCards(indexToCount, hand) {
  if (Array.isArray(hand)) {
    hand = _.join(hand, " ");
  }
  return _.countBy(hand.split(' '), indexToCount);
}

var countValues = _.curry(countCards)(0);
var countSuits = _.curry(countCards)(1);

var hasPair = _.curry(hasAKind)(2);
var hasThreeOfAKind = _.curry(hasAKind)(3);
var hasFourOfAKind = _.curry(hasAKind)(4);


var bestHands = [
  hasRoyalFlush,    // 0
  hasStraightFlush, // 1
  hasFourOfAKind,   // 2
  hasFullHouse,     // 3
  hasFlush,         // 4
  hasStraight,      // 5
  hasThreeOfAKind,  // 6
  hasTwoPairs,      // 7
  hasPair,          // 8
  getHighestCard    // 9
];

var ranks = [
  "Royal Flush",    // 0
  "Straight Flush", // 1
  "Four Of AKind",   // 2
  "Full House",     // 3
  "Flush",          // 4
  "Straight",       // 5
  "Three Of AKind", // 6
  "Two Pairs",      // 7
  "One Pair",       // 8
  "Highest Card"    // 9
];

function countBy(cards, index) {
  return _.countBy(cards, index);
}

function getValueIndex(value) {
  return cardOrder.indexOf(value);
}

function hasAKind(count, hand) {
  return _.findKey(countValues(hand), _.curry(_.eq)(count));
}

function sortCards(hand) {
  return _.sortBy(Object.keys(countValues(hand)), getValueIndex);
}

function getHighestCard(hand) {
  return sortCards(hand).filter(function (value) {
    return value !== hasPair(hand);
  });
}

function hasStraight(hand) {
  var sortedCards = getHighestCard(hand);
  var isStraight = sortedCards.every(function (card, index, cards) {
    if (index === 4) {return true; }
    return cards[index + 1] === cardOrder[cardOrder.indexOf(card) + 1];
  });
  return isStraight ? sortedCards[0] : false;
}

function hasFlush(hand, index) {
  var tt = _.findKey(countSuits(hand), (v, k) => {
    // return k;
    if (v == 5) {
      return k;
    }
  });
  return tt;
}

function hasStraightFlush(hand) {
  if (hasFlush(hand)) {
    return hasStraight(hand);
  }
}

function hasRoyalFlush(hand) {
  return hasStraightFlush(hand) === 'A';
}

function hasFullHouse(hand) {
  var values = countValues(hand);
  if (_.findKey(values, _.eq.bind(null, 2))) {
    return _.findKey(values, _.eq.bind(null, 3));
  }
}

function hasTwoPairs(hand) {
  var values = countValues(hand);
  var leftPair = _.findKey(values, _.curry(_.eq)(2));
  var rightPair = _.findLastKey(values, _.curry(_.eq)(2));
  if (leftPair && rightPair && leftPair !== rightPair) {
    return sortCards(leftPair + ' ' + rightPair);
  }
}

function getHandStrength(hand) {
  var rankIndex = _.find(_.range(bestHands.length), function (bestHandsIndex) {
    return bestHands[bestHandsIndex](hand);
  });  
  return ranks[rankIndex]; //bestHands[rankIndex];
}


module.exports = {
  hasStraightFlush: hasStraightFlush,
  hasRoyalFlush: hasRoyalFlush,
  hasFlush: hasFlush,
  hasStraight: hasStraight,
  hasFullHouse: hasFullHouse,
  hasTwoPairs: hasTwoPairs,
  hasPair: hasPair,
  hasThreeOfAKind: hasThreeOfAKind,
  hasFourOfAKind: hasFourOfAKind,
  getHighestCard: getHighestCard,
  getHandStrength: getHandStrength,
}