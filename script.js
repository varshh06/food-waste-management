let donations = [
  { id: 1, name: 'Food Donation 1', location: 'City A', expiry: 2 },
  { id: 2, name: 'Food Donation 2', location: 'City B', expiry: 1 },
  { id: 3, name: 'Food Donation 3', location: 'City A', expiry: 3 },
  { id: 4, name: 'Food Donation 4', location: 'City C', expiry: 4 },
  { id: 5, name: 'Food Donation 5', location: 'City D', expiry: 4 },
  { id: 6, name: 'Food Donation 6', location: 'City E', expiry: 2 },
  { id: 7, name: 'Food Donation 7', location: 'City D', expiry: 1 }
];

let acceptedDonations = []; // Array to hold accepted donations
let donationIdCounter = donations.length + 1;
let donationChart = null; // To store chart instance

// Function to display donations on the screen
function displayDonations(donationArray) {
  const donationList = document.getElementById('donation-list');
  donationList.innerHTML = '';
  if (donationArray.length === 0) {
      donationList.innerHTML = '<p>No available donations.</p>';
      return;
  }
  donationArray.forEach(donation => {
      const donationCard = document.createElement('div');
      donationCard.classList.add('donation-card');
      donationCard.innerHTML = `
          <h3>${donation.name}</h3>
          <p>Location: ${donation.location}</p>
          <p>Expiry: ${donation.expiry} Days</p>
          <button onclick="acceptDonation(${donation.id})">Accept Donation</button>
      `;
      donationList.appendChild(donationCard);
  });
}

// Function to display accepted donations
function displayAcceptedDonations(acceptedArray) {
  const acceptedDonationsContainer = document.getElementById('accepted-donations');
  acceptedDonationsContainer.innerHTML = '';
  if (acceptedArray.length === 0) {
      acceptedDonationsContainer.innerHTML = '<p>No accepted donations yet.</p>';
      return;
  }
  acceptedArray.forEach(donation => {
      const card = document.createElement('div');
      card.classList.add('accepted-donation-card');
      card.innerHTML = `
          <p><strong>${donation.name}</strong></p>
          <p>Location: ${donation.location}</p>
          <p>Accepted: ${calculateDaysAgo(donation.acceptedAt)} days ago</p>
      `;
      acceptedDonationsContainer.appendChild(card);
  });
}

// Helper function to calculate days ago
function calculateDaysAgo(date) {
  const now = new Date();
  const acceptedDate = new Date(date);
  const differenceInTime = now.getTime() - acceptedDate.getTime();
  const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays;
}

// Function to accept a donation
function acceptDonation(id) {
  const index = donations.findIndex(d => d.id === id);
  if (index !== -1) {
      const donation = donations[index];
      donations.splice(index, 1);
      donation.acceptedAt = new Date().toISOString(); // Add acceptance timestamp
      acceptedDonations.push(donation);
      alert(`${donation.name} has been accepted!`);
      displayDonations(donations);
      displayAcceptedDonations(acceptedDonations);
      renderChart(); // Re-render chart after donation is accepted
  }
}

// Function to filter donations by location
function filterDonationsByLocation(location) {
  const filtered = donations.filter(d =>
      d.location.toLowerCase().includes(location.toLowerCase())
  );
  displayDonations(filtered);
}

// Function to sort donations by expiry
function sortDonationsByExpiry(order) {
  const sorted = [...donations].sort((a, b) =>
      order === 'ascending' ? a.expiry - b.expiry : b.expiry - a.expiry
  );
  displayDonations(sorted);
}

// Function to render the donation bar chart
function renderChart() {
  const cityCounts = donations.reduce((acc, curr) => {
      acc[curr.location] = (acc[curr.location] || 0) + 1;
      return acc;
  }, {});

  const ctx = document.getElementById('donationChart').getContext('2d');

  // Destroy the old chart if it exists to prevent memory leaks and errors
  if (donationChart) {
      donationChart.destroy();
  }

  donationChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: Object.keys(cityCounts),
          datasets: [{
              label: 'Donations Available',
              data: Object.values(cityCounts),
              backgroundColor: '#3498db',
              borderColor: '#2980b9',
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

// Event listeners for sorting and filtering
document.getElementById('expiry').addEventListener('change', function () {
  sortDonationsByExpiry(this.value);
});

document.getElementById('location').addEventListener('input', function () {
  filterDonationsByLocation(this.value);
});

// Initial display of donations and chart
document.addEventListener('DOMContentLoaded', () => {
  // Create containers in the HTML dynamically
  const mainContent = document.querySelector('.main-content');

  const donationContainers = document.createElement('div');
  donationContainers.classList.add('donation-containers');

  const donationListContainer = document.createElement('div');
  donationListContainer.id = 'donation-list-container';
  donationListContainer.innerHTML = '<h3>Available Donations</h3><div id="donation-list"></div>';

  const acceptedDonationsContainer = document.createElement('div');
  acceptedDonationsContainer.id = 'accepted-donations-container';
  acceptedDonationsContainer.innerHTML = '<h3>Accepted Donations</h3><div id="accepted-donations"></div>'; // Changed ID here

  donationContainers.appendChild(donationListContainer);
  donationContainers.appendChild(acceptedDonationsContainer);

  // Insert the donation containers before the chart
  const chartCanvas = document.getElementById('donationChart');
  mainContent.insertBefore(donationContainers, chartCanvas);

  displayDonations(donations);
  displayAcceptedDonations(acceptedDonations);
  renderChart(); // Render the chart when the page loads
});

// Handle form submission for adding new donations
document.addEventListener('DOMContentLoaded', () => {
  const addDonationForm = document.getElementById('add-donation-form');
  if (addDonationForm) {
      addDonationForm.addEventListener('submit', function (event) {
          event.preventDefault();
          const nameInput = document.getElementById('donation-name');
          const locationInput = document.getElementById('donation-location');
          const expiryInput = document.getElementById('donation-expiry');

          if (nameInput.value && locationInput.value && expiryInput.value) {
              const newDonation = {
                  id: donationIdCounter++,
                  name: nameInput.value,
                  location: locationInput.value,
                  expiry: parseInt(expiryInput.value)
              };
              donations.push(newDonation);
              displayDonations(donations);
              renderChart();
              // Clear the form
              nameInput.value = '';
              locationInput.value = '';
              expiryInput.value = '';
          } else {
              alert('Please fill in all donation details.');
          }
      });
  }
});
// other_file.js
function processDonation(donation) {
  console.log('Donation details received in other file:', donation);
  //  Use the donation object here
  //  e.g., send to server:
  //  fetch('/api/donations', {
  //      method: 'POST',
  //      body: JSON.stringify(donation)
  //  });
}