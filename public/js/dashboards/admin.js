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
            <button onclick="editStaff()" class="btn btn-primary" id="modify-staff">Modifier</button>
            <button onclick="deleteStaff()" class="btn btn-danger">Supprimer</button>
          </td>
        </tr>
      `);
    });
  });
}


// Function to initialize the admin dashboard
function initializeAdminDashboard() {
  // Fetch accounts and populate the table
  fetchAccounts();
}

// Call the initialize function when the document is ready
$(document).ready(function() {
  initializeAdminDashboard();
});


// =========== Function to handle staff modifications =========
function editStaff(button) {
  // Get the table row by its index
  const row = document.getElementById("userTable").rows[rowIndex];

  // Extract the staff information from the row
  const user_id = row.cells[0].textContent;
  const username = row.cells[1].textContent;
  const email = row.cells[2].textContent;
  const role = row.cells[3].textContent;

  // Prompt the admin to enter the updated information
  const newUsername = prompt("Enter the new username:", username);
  const newEmail = prompt("Enter the new email:", email);
  const newRole = prompt("Enter the new role:", role);

  // If the admin clicked "Cancel", exit the function
  if (newUsername === null || newEmail === null || newRole === null) {
    return;
  }

  // Create an object to store the updated staff information
  const updatedStaff = {
    user_id: user_id,
    username: newUsername,
    email: newEmail,
    role: newRole
  };

  // Send the updated staff information to the server
  fetch("/update_staff", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedStaff),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error updating user.");
    }
    return response.json();
  })
  .then((data) => {
    console.log("User updated successfully.", data);
    // Refresh the page to display the updated information
    location.reload();
  })
  .catch((error) => {
    console.error("Error updating user:", error);
    alert("Error updating user.");
  });
}

// Add event listeners to "Modifier" buttons after DOM content has loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners to "Modifier" buttons
  document.querySelectorAll('.modify_staff').forEach(button => {
      button.addEventListener('click', () => {
          // Extract the row ID from the button's data-id attribute
          const rowId = button.dataset.id;
          editStaff(rowId);
      });
  });
});

// Function to handle staff modifications
function editStaff(rowIndex) {
  // Get the editForm element
  const editForm = document.getElementById("editForm");

  // Set its display property to "block" to make it visible
  editForm.style.display = "block";

  // Get the table row by its index
  const row = document.getElementById("userTable").rows[rowIndex];

  // Extract the staff information from the row
  const username = row.cells[0].textContent;
  const email = row.cells[1].textContent;
  const role = row.cells[2].textContent;

  // Populate the editUserForm fields with the extracted information
  document.getElementById("editUsername").value = username;
  document.getElementById("editEmail").value = email;
  document.getElementById("editRole").value = role;
}

// ============= Function to handle staff deletions ===============
function deleteStaff() {
  // Get the row containing the clicked "Delete" button
  let row = addEventListener.target.closest("tr");

  // Extract the staff ID from the row
  let idStaff = row.cells[0].textContent;

  // Prompt the admin to confirm the deletion
  let confirmation = confirm("Voulez-vous vraiment supprimer ce membre du staff ?");

  // If the admin clicked "Cancel", exit the function
  if (!confirmation) {
    return;
  }

  // Send the staff ID to the server
  fetch("delete_staff", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idStaff }),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du membre du staff.");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Le membre du staff a été supprimé correctement.", data);
    // Refresh the page to remove the deleted staff member
    location.reload();
  })
  .catch((error) => {
    console.error("Il y a eu une erreur lors de la suppression du membre du staff.", error);
    alert("Il y a eu une erreur lors de la suppression du membre du staff.");
  });
}


// ============== Handle the modifiction of services in the zoo ===============
document.addEventListener('DOMContentLoaded', () => { 
  document.getElementById("serviceForm").addEventListener("submit", function(event){
  event.preventDefault();

  // Get the form data
  const formData = new FormData(this);

  // Convert the form to JSON
  const jsonDatat = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  // Send a POST request to the server
  fetch("/add_service", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout du service.");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Le service a été ajouté correctement.", data);
    // Refresh the page to display the new service
    location.reload();
  })
  .catch((error) => {
    console.error("Il y a eu une erreur lors de l'ajout du service.", error);
    alert("Il y a eu une erreur lors de l'ajout du service.");
  });
}
  );
});


// =============== Function to handle modifications of services =============== 
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


// ============== Function to handle habitat modification ===============
function editHabitat() {
  // Get the habitat data from the table row
  const row = document.getElementById(`habitat-${id}`);
  const habitatName = row.cells[0].textContent;
  const habitatDescription = row.cells[1].textContent;

  // Prompt the admin to enter the updated information
  const newHabitatName = prompt("Entré le nouveau nom de l'habitat:", habitatName);
  const newHabitatDescription = prompt("Entré la nouvelle description de l'habitat:", habitatDescription);

  // Create an object to store the updated habitat information
  const updatedHabitat = {
    habitatName: newHabitatName,
    habitatDescription: newHabitatDescription
  };

  // Send the updated habitat information to the server
  fetch(`/update_habitat/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedHabitat),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de l'habitat.");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Les informations ont été mises à jour correctement.", data);
    // Refresh the page to display the updated information
    location.reload();
  })
  .catch((error) => {
    console.error("Il y a eu une erreur lors de la mise à jour de l'habitat.", error);
    alert("Il y a eu une erreur lors de la mise à jour de l'habitat.");
  });
}

// ============== Function to delete habitat ===============
function deleteHabitat() {
  // Confirm with the user before deleting
  if(confirm("Voulez-vous vraiment supprimer cet habitat ?")) {
    const habitatRow = addEventListener.target.closest("tr");

    // Send a DELETE request to the server
    fetch('/delete_habitat', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ habitatId })
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'habitat.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("L'habitat a été supprimé correctement.", data);
      // Refresh the page to remove the deleted habitat
      location.reload();
    })
    .catch((error) => {
      console.error("Il y a eu une erreur lors de la suppression de l'habitat.", error);
      alert("Il y a eu une erreur lors de la suppression de l'habitat.");
    });
  }
}

// ============== Function to modify an animal ===============
function editAnimal() {
  // Get the animal data from the table row
  const row = event.target.closest("tr");

  // Extract the animal information from the row
  const animalName = row.cells[0].textContent;
  const animalSpecies = row.cells[1].textContent;
  const animalHabitat = row.cells[2].textContent;

  // Prompt the admin to enter the updated information
  const newAnimalName = prompt("Entrez le nouveau nom de l'animal:", animalName);
  const newAnimalSpecies = prompt("Entrez la nouvelle espèce de l'animal:", animalSpecies);
  const newAnimalHabitat = prompt("Entrez le nouvel habitat de l'animal:", animalHabitat);

  // Create an object to store the updated animal information
  const updatedAnimal = {
    animalName: newAnimalName,
    animalSpecies: newAnimalSpecies,
    animalHabitat: newAnimalHabitat
  };

  // Send PUT request to the server to update the animal
  fetch(`/update_animal/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedAnimal),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de l'animal.");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Les informations ont été mises à jour correctement.", data);
    // Refresh the page to display the updated information
    location.reload();
  })
  .catch((error) => {
    console.error("Il y a eu une erreur lors de la mise à jour de l'animal.", error);
    alert("Il y a eu une erreur lors de la mise à jour de l'animal.");
  });
}

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

// ======== Functions for filters inside vet report table =========
// Function to apply filters
function applyFilters() {
  // Get filter values
  const filterDate = document.getElementById('filterDate').value;
  const filterVeterinarian = document.getElementById('filterVeterinarian').value;
  const filterAnimal = document.getElementById('filterAnimal').value;

  // Get table rows
  const rows = document.querySelectorAll('#vetReportTable tbody tr');

  // Loop through each row
  rows.forEach(row => {
      const date = row.cells[0].textContent;
      const veterinarian = row.cells[2].textContent;
      const animal = row.cells[3].textContent;

      // Check if the row matches the filters
      const dateMatch = filterDate === '' || date === filterDate;
      const veterinarianMatch = filterVeterinarian === '' || veterinarian === filterVeterinarian;
      const animalMatch = filterAnimal === '' || animal === filterAnimal;

      // Show or hide the row based on filter matches
      if (dateMatch && veterinarianMatch && animalMatch) {
          row.style.display = 'table-row'; // Show row
      } else {
          row.style.display = 'none'; // Hide row
      }
  });
}

// Function to reset filters and show all rows
function resetFilters() {
  // Reset filter values
  document.getElementById('filterDate').value = '';
  document.getElementById('filterVeterinarian').value = '';
  document.getElementById('filterAnimal').value = '';

  // Get all rows and show them
  const rows = document.querySelectorAll('#vetReportTable tbody tr');
  rows.forEach(row => {
      row.style.display = 'table-row'; // Show row
  });
}

