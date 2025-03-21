// Seat data structure
const seatData = {
    rows: 5,
    seatsPerRow: 6,
    // Pre-defined occupied seats for demonstration
    occupiedSeats: ['A2', 'B4', 'C1', 'D3', 'E5'],
    prices: {
        'regular': 50,
        'premium': 75
    }
};

// Track total price
let totalPrice = 0;

// Generate seat ID (e.g., A1, B2, etc.)
const generateSeatId = (row, seat) => {
    return `${String.fromCharCode(65 + row)}${seat + 1}`;
};

// Initialize selected seats array
let selectedSeats = [];

// Show message function
const showMessage = (message, type = 'error') => {
    const errorContainer = document.getElementById('error-message');
    const successContainer = document.getElementById('success-message');
    
    if (type === 'error') {
        errorContainer.querySelector('span').innerHTML = message;
        errorContainer.classList.remove('hidden');
        successContainer.classList.add('hidden');
        setTimeout(() => errorContainer.classList.add('hidden'), 3000);
    } else {
        successContainer.querySelector('span').innerHTML = message;
        successContainer.classList.remove('hidden');
        errorContainer.classList.add('hidden');
        if (message.includes('Booking Confirmed')) {
            setTimeout(() => successContainer.classList.add('hidden'), 5000); // Longer display for booking confirmation
        } else {
            setTimeout(() => successContainer.classList.add('hidden'), 3000);
        }
    }
};

// Create seat element
const createSeatElement = (seatId) => {
    const seat = document.createElement('div');
    const isOccupied = seatData.occupiedSeats.includes(seatId);
    
    const isPremium = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].includes(seatId);
    const price = isPremium ? seatData.prices.premium : seatData.prices.regular;
    
    seat.className = `seat w-full aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 ${
        isOccupied 
            ? 'bg-gray-200 border-gray-400 cursor-not-allowed' 
            : isPremium
                ? 'bg-purple-100 border-purple-500 hover:bg-purple-200'
                : 'bg-emerald-100 border-emerald-500 hover:bg-emerald-200'
    }`;
    
    seat.setAttribute('data-seat-id', seatId);
    seat.innerHTML = `
        <div class="flex flex-col items-center">
            <span class="font-medium text-lg">${seatId}</span>
            <span class="text-sm mt-1">$${price}</span>
        </div>
    `;

    // Add click event listener
    seat.addEventListener('click', () => handleSeatClick(seat, seatId, isOccupied));

    return seat;
};

// Handle seat click
const handleSeatClick = (seatElement, seatId, isOccupied) => {
    const isPremium = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].includes(seatId);
    const price = isPremium ? seatData.prices.premium : seatData.prices.regular;

    if (isOccupied) {
        showMessage(`Seat ${seatId} is already occupied.`, 'error');
        return;
    }

    const seatIndex = selectedSeats.indexOf(seatId);
    if (seatIndex === -1) {
        // Select seat
        selectedSeats.push(seatId);
        totalPrice += price;
        
        // Update visual feedback
        seatElement.classList.remove(
            isPremium ? 'bg-purple-100' : 'bg-emerald-100',
            isPremium ? 'border-purple-500' : 'border-emerald-500',
            'hover:bg-purple-200',
            'hover:bg-emerald-200'
        );
        seatElement.classList.add(
            'bg-blue-100',
            'border-blue-500',
            'hover:bg-blue-200'
        );
        
        // Update message with seat type
        const seatType = isPremium ? 'Premium' : 'Regular';
        showMessage(
            `${seatType} seat ${seatId} selected for $${price}. Total: $${totalPrice}`,
            'success'
        );
    } else {
        // Deselect seat
        selectedSeats.splice(seatIndex, 1);
        totalPrice -= price;
        
        // Update visual feedback
        seatElement.classList.remove(
            'bg-blue-100',
            'border-blue-500',
            'hover:bg-blue-200'
        );
        seatElement.classList.add(
            isPremium ? 'bg-purple-100' : 'bg-emerald-100',
            isPremium ? 'border-purple-500' : 'border-emerald-500',
            isPremium ? 'hover:bg-purple-200' : 'hover:bg-emerald-200'
        );
        
        // Update message
        showMessage(
            `Seat ${seatId} deselected. New total: $${totalPrice}`,
            'success'
        );
    }

    // Update all selected seats summary
    updateSelectedSeatsSummary();
};

// Update selected seats summary
const updateSelectedSeatsSummary = () => {
    const summaryElement = document.createElement('div');
    summaryElement.className = 'mt-4 p-4 bg-gray-50 rounded-lg';
    
    if (selectedSeats.length > 0) {
        const premiumSeats = selectedSeats.filter(seat => 
            ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].includes(seat)
        );
        const regularSeats = selectedSeats.filter(seat => 
            !['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].includes(seat)
        );
        
        summaryElement.innerHTML = `
            <h3 class="font-semibold mb-2">Selected Seats Summary:</h3>
            ${premiumSeats.length ? `<p>Premium Seats: ${premiumSeats.join(', ')} ($${premiumSeats.length * seatData.prices.premium})</p>` : ''}
            ${regularSeats.length ? `<p>Regular Seats: ${regularSeats.join(', ')} ($${regularSeats.length * seatData.prices.regular})</p>` : ''}
            <p class="mt-2 font-semibold">Total: $${totalPrice}</p>
        `;
    } else {
        summaryElement.innerHTML = '<p>No seats selected</p>';
    }

    // Update or add summary to the page
    const existingSummary = document.querySelector('.seats-summary');
    if (existingSummary) {
        existingSummary.replaceWith(summaryElement);
    } else {
        document.getElementById('seat-map').after(summaryElement);
    }
    summaryElement.classList.add('seats-summary');
};

// Initialize seat map
const initializeSeatMap = () => {
    const seatMap = document.getElementById('seat-map');
    
    // Create seats
    for (let row = 0; row < seatData.rows; row++) {
        for (let seat = 0; seat < seatData.seatsPerRow; seat++) {
            const seatId = generateSeatId(row, seat);
            const seatElement = createSeatElement(seatId);
            seatMap.appendChild(seatElement);
        }
    }
};

// Reset selection
const resetSelection = () => {
    selectedSeats = [];
    totalPrice = 0;
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        const seatId = seat.getAttribute('data-seat-id');
        const isPremium = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].includes(seatId);
        
        if (!seatData.occupiedSeats.includes(seatId)) {
            seat.classList.remove('bg-blue-100', 'border-blue-500');
            seat.classList.add(
                isPremium ? 'bg-purple-100' : 'bg-emerald-100',
                isPremium ? 'border-purple-500' : 'border-emerald-500'
            );
        }
    });
    showMessage('Selection reset. Total: $0', 'success');
};

// Confirm selection
const confirmSelection = () => {
    if (selectedSeats.length === 0) {
        showMessage('Please select at least one seat.', 'error');
        return;
    }
    
    const premiumSeats = selectedSeats.filter(seat => 
        ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].includes(seat)
    );
    const regularSeats = selectedSeats.filter(seat => 
        !['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].includes(seat)
    );
    
    const confirmMessage = `
        <div class="text-center">
            <h3 class="text-lg font-bold mb-2">🎉 Booking Confirmed! 🎉</h3>
            ${premiumSeats.length ? `<p class="mb-1">Premium Seats: ${premiumSeats.join(', ')} ($${premiumSeats.length * seatData.prices.premium})</p>` : ''}
            ${regularSeats.length ? `<p class="mb-1">Regular Seats: ${regularSeats.join(', ')} ($${regularSeats.length * seatData.prices.regular})</p>` : ''}
            <p class="text-lg font-semibold mt-2">Total amount: $${totalPrice}</p>
        </div>
    `;
    
    showMessage(confirmMessage, 'success');
    
    // Reset after confirmation
    setTimeout(() => {
        resetSelection();
        updateSelectedSeatsSummary();
    }, 3000);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSeatMap();
    
    // Add event listeners to buttons
    document.getElementById('reset-btn').addEventListener('click', resetSelection);
    document.getElementById('confirm-btn').addEventListener('click', confirmSelection);
});