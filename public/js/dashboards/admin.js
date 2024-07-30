// Function to sanitize HTML content
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// ============== Function to fetch accounts from the server and populate the table ===============
function fetchAccounts() {
  $.get('/accounts', function(data) {
    // Clear existing rows
    $('#userTable tbody').empty();

    // Iterate through each account and append a row to the table
    data.forEach(function(account) {
      $('#userTable tbody').append(`
        <tr>
          <td>${sanitizeHTML(account.username)}</td>
          <td>${sanitizeHTML(account.email)}</td>
          <td>${sanitizeHTML(account.role)}</td>
          <td>
          <button onclick="editStaff(this, ${account.user_id})" class="btn btn-primary">Modifier</button>
          <button onclick="deleteStaff(${account.user_id})" class="btn btn-danger delete_staff">Supprimer</button>
          </td>
        </tr>
      `);
    });
  });
}


// ============= Function to handle staff modifications =============
function editStaff(button, userId) {
  const row = $(button).closest('tr');
  const username = sanitizeHTML(row.find('td').eq(0).text());
  const email = sanitizeHTML(row.find('td').eq(1).text());
  const role = sanitizeHTML(row.find('td').eq(2).text());

  // Populate the edit form with the current values
  $('#editUserId').val(userId);
  $('#editUsername').val(username);
  $('#editEmail').val(email);
  $('#editRole').val(role);

  // Show the edit form
  $('#editForm').show();
  $('html, body').animate({
    scrollTop: $("#editForm").offset().top
  }, 1000);
}

function cancelEdit() {
  $('#editForm').hide();
  $('#editUserForm')[0].reset();
}

$('#editUserForm').on('submit', function(event) {
  event.preventDefault();

  const userId = $('#editUserId').val();
  const username = sanitizeHTML($('#editUsername').val());
  const email = sanitizeHTML($('#editEmail').val());
  const password = sanitizeHTML($('#editPassword').val());
  const role = sanitizeHTML($('#editRole').val());  

  $.ajax({
    url: '/update_user/:id',
    method: 'PUT',
    data: {
      userId: userId,
      username: username,
      email: email,
      password: password,
      role: role
    },
    success: function(response) {
      // Refresh the table after updating the user
      fetchAccounts();  
      cancelEdit();     
    },
    error: function(xhr, status, error) {
      console.error('Error updating user:', error);
    }
  });
});

// Call fetchAccounts() when the document is ready
$(document).ready(function() {
  fetchAccounts();
});

// ============= Function to handle staff deletions ===============
function deleteStaff(userId) {
  // Show confirmation dialog
  if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.")) {
    // Proceed with deletion
    $.ajax({
      url: '/delete_user',
      method: 'DELETE',
      data: {
        userId: userId
      },
      success: function(response) {
        // Refresh the table after deleting the user
        fetchAccounts();  
      },
      error: function(xhr, status, error) {
        console.error('Error deleting user:', error);
      }
    });
  }
}

// ================== Function to fetch services and populate the table ==================
function fetchServices() {
  $.get('/service', function(data) {
    // Clear existing rows
    $('#serviceTable tbody').empty();

    // Iterate through each service and append a row to the table
    data.forEach(function(service) {
      const row = $(`
        <tr data-service-id="${service.service_id}">
          <td>${sanitizeHTML(service.service_name)}</td>
          <td>${sanitizeHTML(service.service_description)}</td>
          <td>
            <button class="btn btn-primary modify-service">Modifier</button>
            <button onclick="deleteService(${service.service_id})" class="btn btn-danger delete-service">Supprimer</button>
            </td>
        </tr>
      `);
      
      // Attach event listeners to the buttons in this row
      row.find('.modify-service').click(function() {
        editService($(this)); // Pass the clicked button to editService function
      });

      row.find('.delete-service').click(deleteService); // Attach deleteService directly

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


// =============== Function to handle modifications of services =============== 
function editService(button) {
  const row = $(button).closest("tr"); // Get the parent row of the clicked button
  const serviceName = sanitizeHTML(row.find("td:eq(0)").text()); // Get service name from the first column
  const serviceDescription = sanitizeHTML(row.find("td:eq(1)").text()); // Get service description from the second column

  // Replace text with input fields for editing
  row.find("td:eq(0)").html(`<input type="text" class="form-control" value="${serviceName}">`);
  row.find("td:eq(1)").html(`<input type="text" class="form-control" value="${serviceDescription}">`);

  // Replace "Modifier" button with "Save" and "Cancel" buttons
  row.find("td:eq(2)").html(`
      <button onclick="saveService(this)" class="btn btn-success">Sauvegarder</button>
      <button onclick="cancelEdit(this)" class="btn btn-secondary">Annuler</button>
  `);
}

// Function to save the edited service
function saveService(button) {
  const row = $(button).closest("tr"); // Get the parent row of the clicked button
  const serviceId = row.data("service-id");
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
function cancelEdit(button) {
  const row = $(button).closest("tr"); // Get the parent row of the clicked button
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

// ================== Function to fetch habitats and populate the table ==================
function fetchHabitat() {
  $.get('/habitat', function(data) {
    // Clear existing rows
    $('#habitatTable tbody').empty();

    // Iterate through each habitat and append a row to the table
    data.forEach(function(habitat) {
      $('#habitatTable tbody').append(`
      <tr data-habitat-id="${habitat.habitat_id}">
          <td>${sanitizeHTML(habitat.habitat_name)}</td>
          <td>${sanitizeHTML(habitat.habitat_description)}</td>
          <td>
            <button onclick="editHabitat(this)" class="btn btn-primary" id="modify-staff">Modifier</button>
            <button onclick="deleteHabitat(${habitat.habitat_id})" class="btn btn-danger delete-habitat">Supprimer</button>
            </td>
        </tr>
      `);
    });
  });
}

// Fetch habitats and populate the table
$(document).ready(function() {
  fetchHabitat();
});


// ============== Function to handle habitat modification ===============
// Function to handle modifications of habitats
function editHabitat(button) {
  const row = $(button).closest("tr"); // Get the parent row of the clicked button
  const habitatName = sanitizeHTML(row.find("td:eq(0)").text()); // Get habitat name from the first column
  const habitatDescription = sanitizeHTML(row.find("td:eq(1)").text()); // Get habitat description from the second column

  // Replace text with input fields for editing
  row.find("td:eq(0)").html(`<input type="text" class="form-control" value="${habitatName}">`);
  row.find("td:eq(1)").html(`<input type="text" class="form-control" value="${habitatDescription}">`);

  // Replace "Modifier" button with "Save" and "Cancel" buttons
  row.find("td:eq(2)").html(`
    <button onclick="saveHabitat(this)" class="btn btn-success">Sauvegarder</button>
    <button onclick="cancelEditHabitat(this)" class="btn btn-secondary">Annuler</button>
  `);
}

// Function to save the edited habitat
function saveHabitat(button) {
  const row = $(button).closest("tr"); // Get the parent row of the clicked button
  const habitatId = row.data("habitat-id");
  const habitatName = sanitizeHTML(row.find("td:eq(0) input").val()); // Get edited habitat name
  const habitatDescription = sanitizeHTML(row.find("td:eq(1) input").val()); // Get edited habitat description

  // Perform AJAX request to update the habitat
  $.ajax({
    url: `/updateHabitat/${habitatId}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      habitatName: habitatName,
      habitatDescription: habitatDescription
    }),
    success: function(response) {
      console.log("Habitat updated successfully:", response);
      // Refresh habitats table after update
      fetchHabitat();
    },
    error: function(xhr, status, error) {
      console.error("Error updating habitat:", error);
    }
  });
}

// Function to cancel editing and revert changes
function cancelEditHabitat(button) {
  const row = $(button).closest("tr"); // Get the parent row of the clicked button
  fetchHabitat(); // Refresh habitats table to revert changes
}

// ============== Function to delete habitat ===============
function deleteHabitat(habitatId) {
  // Show confirmation dialog
  if (confirm("Êtes-vous sûr de vouloir supprimer cet habitat ? Cette action ne peut être annulée.")) {
    // Proceed with deletion
    $.ajax({
      url: '/delete_habitat/' + habitatId,
      method: 'DELETE',
      success: function(response) {
        // Refresh the table after deleting the habitat
        fetchHabitat();  
      },
      error: function(xhr, status, error) {
        console.error('Error deleting habitat:', error);
      }
    });
  }
}

// ============== Function to fetch animals and populate the table ===============
function fetchAnimals() {
  $.get('/animal', function(data) {
    // Clear existing rows
    $('#animalTable tbody').empty();

    // Iterate through each animal and append a row to the table
    data.forEach(function(animal) {
      $('#animalTable tbody').append(`
      <tr data-animal-id="${animal.animal_id}">
          <td class="animal-name">${sanitizeHTML(animal.animal_name)}</td>
          <td class="animal-species">${sanitizeHTML(animal.animal_species)}</td>
          <td class="animal-habitat">${sanitizeHTML(animal.habitat_name)}</td>
          <td>
            <button class="btn btn-primary" onclick="editAnimal(this)">Modifier</button>
            <button onclick="deleteAnimal(${animal.animal_id})" class="btn btn-danger">Supprimer</button>
            </td>
        </tr>
      `);
    });
  }).fail(function(xhr, status, error) {
    console.error('Error fetching animals:', error);  });
}

// ============== Function to modify an animal ===============
function editAnimal(button) {
  const row = $(button).closest('tr');
  const animalId = row.data('animal-id');
 
  // Extracting text content from jQuery objects and sanitizing them
  const name = sanitizeHTML(row.find('.animal-name').text());
  const species = sanitizeHTML(row.find('.animal-species').text());
  const habitat = sanitizeHTML(row.find('.animal-habitat').text());

  // Replace cell contents with input fields for editing
  row.find('.animal-name').html(`<input type="text" value="${name}" class="form-control" />`);
  row.find('.animal-species').html(`<input type="text" value="${species}" class="form-control" />`);
  row.find('.animal-habitat').html(`
    <select class="form-control">
      <option value="Jungle" ${habitat === 'Jungle' ? 'selected' : ''}>Jungle</option>
      <option value="Savane" ${habitat === 'Savane' ? 'selected' : ''}>Savane</option>
      <option value="Marais" ${habitat === 'Marais' ? 'selected' : ''}>Marais</option>
    </select>
  `);

  $(button).replaceWith(`<button class="btn btn-success" onclick="updateAnimal(this, ${animalId})">Confirmer</button>`);
}


// Function to update an animal
function updateAnimal(button, animalId) {
  const row = $(button).closest('tr');
  const name = sanitizeHTML(row.find('input').eq(0).val());
  const species = sanitizeHTML(row.find('input').eq(1).val());
  const habitat = row.find('select').val();

  $.ajax({
    url: '/update_animal',
    method: 'PUT',
    data: {
      animalId: animalId,
      animalName: name,
      animalSpecies: species,
      animalHabitat: habitat
    },
    success: function(response) {
      fetchAnimals();  // Refresh the table after updating
    },
    error: function(xhr, status, error) {
      console.error('Error updating animal:', error);
    }
  });
}

// Call fetchAnimals() when the document is ready
$(document).ready(function() {
  fetchAnimals();
});

// ============== Function to delete animal ===============
function deleteAnimal(animalId) {
  // Show confirmation dialog
  if (confirm("Êtes-vous sûr de vouloir supprimer cet animal ? Cette action ne peut être annulée.")) {
    // Proceed with deletion
    $.ajax({
      url: '/delete_animal/' + animalId,
      method: 'DELETE',
      success: function(response) {
        // Refresh the table after deleting the animal
        fetchAnimals();  
      },
      error: function(xhr, status, error) {
        console.error('Error deleting animal:', error);
      }
    });
  }
}

// ============== Function to fetch vet reports and populate the table ===============
function fetchVetReports() {
  $.get('/vet_reports', function(data) {
    // Clear existing rows
    $('#vetReportTable tbody').empty();

    // Iterate through each vet report and append a row to the table
    data.forEach(function(vetReport) {
      // Parse the timestamp to get the date string
      const date = new Date(vetReport.date);
      const formattedDate = date.toLocaleDateString('fr-FR');

       // Sanitize dynamic content before inserting into HTML
       const sanitizedDate = sanitizeHTML(formattedDate);
       const sanitizedUsername = sanitizeHTML(vetReport.username);
       const sanitizedAnimalName = sanitizeHTML(vetReport.animal_name);
       const sanitizedAnimalState = sanitizeHTML(vetReport.animal_state);
       const sanitizedDetailAnimalState = sanitizeHTML(vetReport.detail_animal_state);

      $('#vetReportTable tbody').append(`
        <tr>
          <td>${sanitizedDate}</td>
          <td>${sanitizedUsername}</td>
          <td>${sanitizedAnimalName}</td>
          <td>${sanitizedAnimalState}</td>
          <td>${sanitizedDetailAnimalState}</td>
        </tr>
      `);
    });
  }).fail(function(xhr, status, error) {
    console.error('Error fetching vet reports:', error);
  });
}

$(document).ready(function() {
  fetchVetReports();
});


// ======================== Functions for filters inside vet report table =========
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

// Function to fetch and populate vet select dropdown
function populateVeterinarianSelect() {
  fetch('/vet_names')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Veterinarian data:', data);
    if (Array.isArray(data)) {
      const select = document.getElementById('filterVeterinarian');
      select.innerHTML = '<option value="">Tous les vétérinaires</option>';
      data.forEach(vet => {
        const option = document.createElement('option');
        option.value = sanitizeHTML(vet.name);
        option.textContent = sanitizeHTML(vet.name);
        select.appendChild(option);
      });
    } else {
      console.error('Unexpected data format:', data);
    }
  })
  .catch(error => {
    console.error('Error fetching veterinarian data:', error);
  });
}

// Populate veterinarian select dropdown on page load
populateVeterinarianSelect();

// Function to apply date filter
function applyDateFilter() {
  const date = document.getElementById('filterDate').value;
  const rows = document.querySelectorAll('#vetReportTable tbody tr');

  rows.forEach(row => {
    const rowDate = sanitizeHTML(row.querySelector('td:first-child').textContent);
    if (date && rowDate !== date) {
      row.style.display = 'none';
    } else {
      row.style.display = '';
    }
  });
}

// Function to apply vet filter
function applyVetFilter() {
  const selectedVet = sanitizeHTML(document.getElementById('filterVeterinarian').value);
  const rows = document.querySelectorAll('#vetReportTable tbody tr');

  rows.forEach(row => {
    const rowVet = sanitizeHTML(row.querySelector('td:nth-child(2)').textContent);
    if (selectedVet && rowVet !== selectedVet) {
      row.style.display = 'none';
    } else {
      row.style.display = '';
    }
  });
}

// Function to apply animal filter
function applyAnimalFilter() {
  const selectedAnimal = sanitizeHTML(document.getElementById('filterAnimal').value);
  const rows = document.querySelectorAll('#vetReportTable tbody tr');

  rows.forEach(row => {
    const rowAnimal = sanitizeHTML(row.querySelector('td:nth-child(3)').textContent);
    if (selectedAnimal && rowAnimal !== selectedAnimal) {
      row.style.display = 'none';
    } else {
      row.style.display = '';
    }
  });
}

// Function to apply all filters
function applyFilters() {
  applyDateFilter();
  applyVetFilter();
  applyAnimalFilter();
}



// ============== Function to fetch animal consultations and populate the graph ===============
// Fetch data from MongoDB and render the graph
async function fetchAnimalConsultationData() {
  try {
    const response = await fetch('/animal-consultations');
    const data = await response.json();

    const animals = [];
    const consultationCounts = [];

    // Extract animal names and consultation counts from the response
    data.forEach(consultation => {
      animals.push(consultation.animal);
      consultationCounts.push(consultation.consultationCount);
    });

    // Render the graph using Chart.js
    const ctx = document.getElementById('animalStatisticsChart').getContext('2d');
    const animalStatisticsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: animals,
        datasets: [{
          label: 'Nombre de consultations',
          data: consultationCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  } catch (error) {
    console.error('Error fetching animal consultation data:', error);
  }
}


// Call the function to fetch data and render the graph when the page loads
window.onload = fetchAnimalConsultationData;