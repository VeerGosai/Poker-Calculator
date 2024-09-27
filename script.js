// Constants for suits and ranks
const suits = ['h', 'd', 'c', 's'];  // hearts, diamonds, clubs, spades
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const handRankings = ["high_card", "one_pair", "two_pair", "three_of_a_kind", "straight", "flush", "full_house", "four_of_a_kind", "straight_flush", "royal_flush"];

// Initialize card dropdowns
function populateCardDropdowns() {
    const selects = document.querySelectorAll('select');
    const deck = createDeck();

    selects.forEach(select => {
        deck.forEach(card => {
            const option = document.createElement('option');
            option.value = card;
            option.textContent = card;
            select.appendChild(option);
        });
    });
}

// Create a deck of cards
function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(rank + suit);
        }
    }
    return deck;
}

// Remove selected cards from the deck
function removeCards(deck, cards) {
    return deck.filter(card => !cards.includes(card));
}

// Count occurrences of each rank or suit in a hand
function countOccurrences(array) {
    const count = {};
    array.forEach(val => count[val] = (count[val] || 0) + 1);
    return count;
}

// Check for flush
function isFlush(suits) {
    return suits.every(suit => suit === suits[0]);
}

// Check for straight
function isStraight(ranks) {
    const sortedRanks = ranks.map(rank => (rank === 'A' ? 14 : '23456789TJQKA'.indexOf(rank) + 2)).sort((a, b) => a - b);
    for (let i = 0; i < sortedRanks.length - 1; i++) {
        if (sortedRanks[i] + 1 !== sortedRanks[i + 1]) return false;
    }
    return true;
}

// Check for royal flush
function isRoyalFlush(hand) {
    const royalRanks = ['A', 'K', 'Q', 'J', 'T'];
    return isFlush(hand.map(card => card[1])) && royalRanks.every(rank => hand.map(card => card[0]).includes(rank));
}

// Evaluate hand
function evaluateHand(hand) {
    const ranks = hand.map(card => card[0]);
    const suits = hand.map(card => card[1]);

    if (isRoyalFlush(hand)) {
        return { ranking: 9, name: "Royal Flush" };
    }

    const isFlushHand = isFlush(suits);
    const isStraightHand = isStraight(ranks);

    if (isFlushHand && isStraightHand) {
        return { ranking: 8, name: "Straight Flush" };
    }

    const rankCount = countOccurrences(ranks);
    const values = Object.values(rankCount).sort((a, b) => b - a);

    if (values[0] === 4) {
        return { ranking: 7, name: "Four of a Kind" };
    }

    if (values[0] === 3 && values[1] === 2) {
        return { ranking: 6, name: "Full House" };
    }

    if (isFlushHand) {
        return { ranking: 5, name: "Flush" };
    }

    if (isStraightHand) {
        return { ranking: 4, name: "Straight" };
    }

    if (values[0] === 3) {
        return { ranking: 3, name: "Three of a Kind" };
    }

    if (values[0] === 2 && values[1] === 2) {
        return { ranking: 2, name: "Two Pair" };
    }

    if (values[0] === 2) {
        return { ranking: 1, name: "One Pair" };
    }

    return { ranking: 0, name: "High Card" };
}

// Compare two hands
function compareHands(hand1, hand2) {
    const hand1Eval = evaluateHand(hand1);
    const hand2Eval = evaluateHand(hand2);

    if (hand1Eval.ranking > hand2Eval.ranking) return 1;
    if (hand1Eval.ranking < hand2Eval.ranking) return -1;

    return 0; // Tie if rankings are equal (add kicker evaluation for improvement)
}

// Simulate poker odds
function simulatePokerOdds(player1, player2, communityCards, simulations = 10000) {
    const deck = createDeck();
    const remainingDeck = removeCards(deck, player1.concat(player2).concat(communityCards));

    let player1Wins = 0;
    let player2Wins = 0;
    let ties = 0;

    for (let i = 0; i < simulations; i++) {
        const community = [...communityCards];

        // Fill in missing community cards
        if (community.length < 5) {
            const remaining = 5 - community.length;
            const drawnCards = drawRandomCards(remainingDeck, remaining);
            community.push(...drawnCards);
        }

        const player1Hand = player1.concat(community);
        const player2Hand = player2.concat(community);

        const result = compareHands(player1Hand, player2Hand);

        if (result === 1) player1Wins++;
        else if (result === -1) player2Wins++;
        else ties++;
    }

    const total = player1Wins + player2Wins + ties;
    return {
        player1: ((player1Wins / total) * 100).toFixed(2),
        player2: ((player2Wins / total) * 100).toFixed(2),
        tie: ((ties / total) * 100).toFixed(2)
    };
}

// Draw random cards from the deck
function drawRandomCards(deck, number) {
    const shuffled = deck.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, number);
}

// Calculate Odds (triggered by button)
function calculateOdds() {
    const player1Cards = [
        document.getElementById('player1-card1').value,
        document.getElementById('player1-card2').value
    ];
    const player2Cards = [
        document.getElementById('player2-card1').value,
        document.getElementById('player2-card2').value
    ];

    const communityCards = [
        document.getElementById('community-card1').value,
        document.getElementById('community-card2').value,
        document.getElementById('community-card3').value,
        document.getElementById('community-card4').value,
        document.getElementById('community-card5').value
    ].filter(card => card !== '');

    const results = simulatePokerOdds(player1Cards, player2Cards, communityCards);

    document.getElementById('player1-win').textContent = results.player1 + '%';
    document.getElementById('player2-win').textContent = results.player2 + '%';
    document.getElementById('tie-win').textContent = results.tie + '%';
}

// Event listener for calculating odds
document.getElementById('calculate-odds-btn').addEventListener('click', calculateOdds);

// Populate dropdowns with cards
populateCardDropdowns();
