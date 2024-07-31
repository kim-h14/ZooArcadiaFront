// Function to sanitize HTML content
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

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
        <td>${review.review_id}</td>
        <td>${review.client_name}</td>
        <td>${review.city}</td>
        <td>${review.email}</td>
        <td>${review.review_text}</td>
        <td>
          <button onclick="approveReview(this)" class="btn btn-primary">Approuver</button>
          <button onclick="deleteReview(this)" class="btn btn-danger">Rejeter</button>
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
  const row = $(button).closest('tr');
  // Extract the review ID from the first <td> of the row
  const reviewId = sanitizeHTML($(row).find('td:first').text().trim());
  console.log(reviewId);


  console.log('Review ID:', reviewId);

  // Send a PUT request to your backend with the review ID
  $.ajax({
    url: `/approveReview/${reviewId}`,
    type: 'PUT',
    data: { id: reviewId }, // Include the review ID in the request data
    success: function(response) {
      console.log('Review approved successfully');
      // Reload the page after the review has been approved
      location.reload();
    },
    error: function(xhr, status, error) {
      console.error('Error approving review:', error);
    }
  });
}


// ======================== Function to reject review =================
function deleteReview(button) {
  // Get the row containing the review
  const row = $(button).closest('tr');
  // Extract the review ID from the first <td> of the row
  const reviewId = sanitizeHTML($(row).find('td:first').text().trim());
  console.log(reviewId);

  // Send a DELETE request to your backend with the review ID
  $.ajax({
    url: `/deleteReview/${reviewId}`, // Include the review ID in the URL
    type: 'DELETE',
    success: function(response) {
      console.log('Review deleted successfully');
      // Remove the row from the table after the review has been deleted
      row.remove();
    },
    error: function(xhr, status, error) {
      console.error('Error deleting review:', error);
    }
  });
}

// ======================== Function to fetch services =================
function fetchServices() {
  $.get('/service', function(data) {
    // Clear existing rows
    $('#serviceTable tbody').empty();

    // Iterate through each service and append a row to the table
    data.forEach(function(service) {
      const row = $(`
        <tr data-service-id="${sanitizeHTML(service.service_id)}">
          <td>${sanitizeHTML(service.service_name)}</td>
          <td>${sanitizeHTML(service.service_description)}</td>
          <td>
            <button onclick="editService(${service.service_id})" class="btn btn-primary">Modifier</button>
            <button onclick="deleteService(${service.service_id})" class="btn btn-danger">Supprimer</button>
          </td>
        </tr>
      `);

      // Append the row to the table
      $('#serviceTable tbody').append(row);
    });
  }).fail(function(xhr, status, error) {
    console.error('Error fetching services:', error);
  });
}

// Call fetchServices() when the document is ready
$(document).ready(function() {
  fetchServices();
});

// =================== Function to handle modifications of services ===================
function editService(serviceId) {
  // Get the row of the service being edited
  const row = $(`#serviceTable tbody tr[data-service-id="${serviceId}"]`);
  const serviceName = sanitizeHTML(row.find("td:eq(0)").text()); // Get service name from the first column
  const serviceDescription = sanitizeHTML(row.find("td:eq(1)").text()); // Get service description from the second column

  // Replace text with input fields for editing
  row.find("td:eq(0)").html(`<input type="text" class="form-control" value="${serviceName}">`);
  row.find("td:eq(1)").html(`<input type="text" class="form-control" value="${serviceDescription}">`);

  // Replace "Modifier" button with "Save" and "Cancel" buttons
  row.find("td:eq(2)").html(`
    <button onclick="saveService(${serviceId})" class="btn btn-success">Sauvegarder</button>
    <button onclick="cancelEdit(${serviceId})" class="btn btn-secondary">Annuler</button>
  `);
}

// Function to save the edited service
function saveService(serviceId) {
  const row = $(`#serviceTable tbody tr[data-service-id="${serviceId}"]`);
  const serviceName = sanitizeHTML(row.find("td:eq(0) input").val()); // Get edited service name
  const serviceDescription = sanitizeHTML(row.find("td:eq(1) input").val()); // Get edited service description

  // Perform AJAX request to update the service
  $.ajax({
    url: `/updateService/${serviceId}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      serviceName: serviceName,
      serviceDescription: serviceDescription
    }),
    success: function(response) {
      console.log("Service updated successfully:", response);
      // Refresh services table after update
      fetchServices();
    },
    error: function(xhr, status, error) {
      console.error("Error updating service:", error);
    }
  });
}

// Function to cancel editing and revert changes
function cancelEdit(serviceId) {
  fetchServices(); // Refresh services table to revert changes
}

// =============== Function to delete service ===============
function deleteService(serviceId) {
  // Show confirmation dialog
  if (confirm("Êtes-vous sûr de vouloir supprimer ce service ? Cette action ne peut être annulée.")) {
    // Proceed with deletion
    $.ajax({
      url: '/delete_service/' + serviceId,
      method: 'DELETE',
      success: function(response) {
        // Refresh the table after deleting the service
        fetchServices();  
      },
      error: function(xhr, status, error) {
        console.error('Error deleting service:', error);
      }
    });
  }
}


// Function to fetch and populate animal select dropdown
function populateAnimalSelect() {
  fetch('/animal_names')
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('filterAnimal');
      select.innerHTML = '<option value="">Tous les animaux</option>';
      data.forEach(animalName => {
        const option = document.createElement('option');
        option.value = sanitizeHTML(animalName);
        option.textContent = sanitizeHTML(animalName);
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching animal data:', error);
    });
}

// Populate animal select dropdown on page load
populateAnimalSelect();



// Function to fetch and populate the employee select dropdown
async function populateEmployeeSelect() {
  try {
    const response = await fetch('/employee_names');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Employee data:', data);
    
    if (Array.isArray(data)) {
      const select = document.getElementById('filterEmployee');
      select.innerHTML = '<option value="">Selectionnez votre nom</option>';
      data.forEach(employee => {
        const option = document.createElement('option');
        option.value = sanitizeHTML(employee.name);
        option.textContent = sanitizeHTML(employee.name);
        select.appendChild(option);
      });
    } else {
      console.error('Unexpected data format:', data);
    }
  } catch (error) {
    console.error('Error fetching employee data:', error);
  }
}

// Call the function to populate the employee select dropdown on page load
populateEmployeeSelect();
