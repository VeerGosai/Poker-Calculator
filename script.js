// Card constants
const suits = ['h', 'd', 'c', 's'];  // hearts, diamonds, clubs, spades
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

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

// Calculate Odds (dummy simulation for now)
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
    ];

    // Perform poker odds calculation (dummy values for now)
    const results = simulatePokerOdds(player1Cards, player2Cards, communityCards);
    
    document.getElementById('player1-win').textContent = results.player1 + '%';
    document.getElementById('player2-win').textContent = results.player2 + '%';
    document.getElementById('tie-win').textContent = results.tie + '%';
}

// Dummy poker odds simulation (You can implement actual logic here)
function simulatePokerOdds(player1, player2, community) {
    // Randomly assigning win percentages for demo
    const player1Win = Math.random() * 50 + 25;  // between 25 and 75%
    const player2Win = Math.random() * (100 - player1Win);  // balance the percentages
    const tie = 100 - (player1Win + player2Win);
    
    return {
        player1: player1Win.toFixed(2),
        player2: player2Win.toFixed(2),
        tie: tie.toFixed(2)
    };
}

// Event listener for calculating odds
document.getElementById('calculate-odds-btn').addEventListener('click', calculateOdds);

// Populate dropdowns with cards
populateCardDropdowns();
