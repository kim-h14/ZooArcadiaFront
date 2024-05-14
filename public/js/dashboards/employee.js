// ===================== function to fetch reviews and populate table =================
async function fetchPendingReviews() {
  try {
    // Make a GET request to fetch pending reviews
    const response = await fetch('/pending_reviews');
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch pending reviews');
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Get the tbody element where we will append the rows
    const tbody = document.querySelector('table tbody');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Iterate over the data and create table rows
    data.forEach(review => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${review.client_name}</td>
        <td>${review.city}</td>
        <td>${review.email}</td>
        <td>${review.review_text}</td>
        <td>
          <button onclick="approveReview()" class="btn btn-primary">Approuver</button>
          <button onclick="rejectReview(${review.review_id})" class="btn btn-danger">Rejeter</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
  }
}

$(document).ready(function() {
  fetchPendingReviews();
});
// ================= Function to approve review =================
function approveReview(button) {
  // Get the row containing the review
  const row = this.closest('tr');
  // Extract the review ID from the row's data attribute
  const reviewId = row.dataset.reviewId;

  // Send a POST request to your backend with the review ID
  fetch(`/approveReview/${reviewId}`, {
      method: 'POST',
  }).then(response => {
      if (response.ok) {
          // Handle success (maybe update UI)
      } else {
          // Handle error
      }
  }).catch(error => {
      // Handle network error
  });
}

// ======================== Function to reject review =================
function rejectReview() {
  // Assuming your API endpoint for rejecting reviews is /reject_review
  const endpoint = '/reject_review';
  
  // Send the ID as Data
    // /!/ TO BE MODIFIED WHEN DATABASE IS IMPLEMENTED
  const reviewId = document.getElementById('reviewID').value;
  
  // Fetch POST request
  fetch(endpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reviewId: reviewId }) // Send review ID as JSON data
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      console.log('Review rejected!');
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });
}

// ===================== function to fetch services and populate table =================
function fetchServices() {
    $.get('/service', function(data) {
      // Clear existing rows
      $('#serviceTable tbody').empty();
  
      // Iterate through each service and append a row to the table
      data.forEach(function(service) {
        $('#serviceTable tbody').append(`
          <tr>
            <td>${service.service_name}</td>
            <td>${service.service_description}</td>
            <td>
              <button onclick="editService()" class="btn btn-primary" id="modify-service">Modifier</button>
              <button onclick="deleteService()" class="btn btn-danger">Supprimer</button>
            </td>
          </tr>
        `);
      });
    }).fail(function(xhr, status, error) {
      console.error('Error fetching services:', error);
    });
  }
  
  // Call fetchServices() when the document is ready
  $(document).ready(function() {
    fetchServices();
  });

// ======================== Function to edit service =================
function editService(serviceId) {
  // Prompt the admin to enter new information for the service
  const newServiceName = prompt("Entrer le nom du nouveau service:");
  const newServiceDescription = prompt("Entrer la description du nouveau service:");

  // Create an object with the updated service information
  const updatedService = {
      serviceName: newServiceName,
      serviceDescription: newServiceDescription
  };

  // Send a PUT request to the server to update the service
  fetch(`/update-service/${serviceId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedService)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('La mise à jour du service a échoué.');
      }
      return response.json();
  })
  .then(data => {
      console.log('Le service a été mis à jour:', data);
      // Optionally, display a success message or update the UI
  })
  .catch(error => {
      console.error('Il y a eu une erreur lors de la mise à jour:', error);
      // Optionally, display an error message to the user
  });
}

// =============== Function to delete service ===============
// Function to delete a service
function deleteService() {
  // Confirm with the user before deleting
  if (confirm("Voulez-vous vraiment supprimer ce service ?")) {
      // Send a DELETE request to the server
      fetch('/delete_service', {
          method: "DELETE",
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error("Erreur lors de la suppression du service.");
          }
          return response.json();
      })
      .then((data) => {
          console.log("Le service a été supprimé correctement.", data);
          // Remove the service row from the table
          const row = document.getElementById(`serviceRow_${serviceId}`);
          if (row) {
              row.remove();
          }
      })
      .catch((error) => {
          console.error("Il y a eu une erreur lors de la suppression du service.", error);
          alert("Il y a eu une erreur lors de la suppression du service.");
      });
  }
}
