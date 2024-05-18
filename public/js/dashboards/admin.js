// ============== Function to fetch accounts from the server and populate the table ===============
function fetchAccounts() {
  $.get('/accounts', function(data) {
    // Clear existing rows
    $('#userTable tbody').empty();

    // Iterate through each account and append a row to the table
    data.forEach(function(account) {
      $('#userTable tbody').append(`
        <tr>
          <td>${account.username}</td>
          <td>${account.email}</td>
          <td>${account.role}</td>
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
  const username = row.find('td').eq(0).text();
  const email = row.find('td').eq(1).text();
  const role = row.find('td').eq(2).text();

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
  const username = $('#editUsername').val();
  const email = $('#editEmail').val();
  const password = $('#editPassword').val();
  const role = $('#editRole').val();

  $.ajax({
    url: '/update_user',
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
          <td>${service.service_name}</td>
          <td>${service.service_description}</td>
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
  const serviceName = row.find("td:eq(0)").text(); // Get service name from the first column
  const serviceDescription = row.find("td:eq(1)").text(); // Get service description from the second column

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
  const serviceName = row.find("td:eq(0) input").val(); // Get edited service name
  const serviceDescription = row.find("td:eq(1) input").val(); // Get edited service description

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
          <td>${habitat.habitat_name}</td>
          <td>${habitat.habitat_description}</td>
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
  const habitatName = row.find("td:eq(0)").text(); // Get habitat name from the first column
  const habitatDescription = row.find("td:eq(1)").text(); // Get habitat description from the second column

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
  const habitatName = row.find("td:eq(0) input").val(); // Get edited habitat name
  const habitatDescription = row.find("td:eq(1) input").val(); // Get edited habitat description

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
          <td class="animal-name">${animal.animal_name}</td>
          <td class="animal-species">${animal.animal_species}</td>
          <td class="animal-habitat">${animal.habitat_name}</td>
          <td>
            <button class="btn btn-primary" onclick="editAnimal(this)">Modifier</button>
            <button class="btn btn-danger" onclick="deleteAnimal()">Supprimer</button>
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
  const nameCell = row.find('.animal-name');
  const speciesCell = row.find('.animal-species');
  const habitatCell = row.find('.animal-habitat');

  const name = nameCell.text();
  const species = speciesCell.text();
  const habitat = habitatCell.text();

  nameCell.html(`<input type="text" value="${name}" class="form-control" />`);
  speciesCell.html(`<input type="text" value="${species}" class="form-control" />`);
  habitatCell.html(`
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
  const name = row.find('input').eq(0).val();
  const species = row.find('input').eq(1).val();
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
function deleteAnimal() {
  // Get the table row containing the clicked "Delete" button
  const row = event.target.closest("tr");

  // Confirm with the admin before deleting the animal
  if(confirm("Voulez-vous vraiment supprimer cet animal?")) {
    // Send a DELETE request to delete the animal
    fetch('/delete_animal', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ animalId })
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'animal.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("L'animal a été supprimé correctement.", data);
      // Refresh the page to remove the deleted animal
      location.reload();
    })
    .catch((error) => {
      console.error("Il y a eu une erreur lors de la suppression de l'animal.", error);
      alert("Il y a eu une erreur lors de la suppression de l'animal.");
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

      $('#vetReportTable tbody').append(`
        <tr>
          <td>${formattedDate}</td>
          <td>${vetReport.username}</td>
          <td>${vetReport.animal_name}</td>
          <td>${vetReport.animal_state}</td>
          <td>${vetReport.detail_animal_state}</td>
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
        option.value = animalName;
        option.textContent = animalName;
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
        option.value = vet.name;
        option.textContent = vet.name;
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
    const rowDate = row.querySelector('td:first-child').textContent;
    if (date && rowDate !== date) {
      row.style.display = 'none';
    } else {
      row.style.display = '';
    }
  });
}

// Function to apply vet filter
function applyVetFilter() {
  const selectedVet = document.getElementById('filterVeterinarian').value;
  const rows = document.querySelectorAll('#vetReportTable tbody tr');

  rows.forEach(row => {
    const rowVet = row.querySelector('td:nth-child(2)').textContent;
    if (selectedVet && rowVet !== selectedVet) {
      row.style.display = 'none';
    } else {
      row.style.display = '';
    }
  });
}

// Function to apply animal filter
function applyAnimalFilter() {
  const selectedAnimal = document.getElementById('filterAnimal').value;
  const rows = document.querySelectorAll('#vetReportTable tbody tr');

  rows.forEach(row => {
    const rowAnimal = row.querySelector('td:nth-child(3)').textContent;
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
