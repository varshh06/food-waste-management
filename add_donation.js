// add_donation.js
document.addEventListener('DOMContentLoaded', () => {
    const donationForm = document.querySelector('form');
    const addButton = document.querySelector('button[type="submit"]');

    if (donationForm && addButton) {
        addButton.addEventListener('click', (event) => {
            event.preventDefault();

            const donationName = document.getElementById('donation-name').value.trim();
            const donationLocation = document.getElementById('donation-location').value.trim();
            const donationExpiry = parseInt(document.getElementById('donation-expiry').value);

            if (donationName && donationLocation && donationExpiry > 0) {
                // Package the donation details into an object
                const donationDetails = {
                    name: donationName,
                    location: donationLocation,
                    expiry: donationExpiry
                };

                // Call a function in the other js file and pass the details
                processDonation(donationDetails);

                alert(`You have donated ${donationName}!`);
                alert('Donation added successfully!');

                document.getElementById('donation-name').value = '';
                document.getElementById('donation-location').value = '';
                document.getElementById('donation-expiry').value = '';
            } else {
                alert('Please fill in all donation details correctly.');
            }
        });
    }
});

// This function should be defined in your other js file
function processDonation(donation) {
    console.log('Donation details received in other file:', donation);
    // You can now use the donation object here to do whatever you want with the data
    // For example, send it to a server, update the UI, etc.
}
