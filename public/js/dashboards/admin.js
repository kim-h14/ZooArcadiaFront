// =========== Function to handle staff modifications =========
document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners to "Modify" buttons
  document.querySelectorAll('.modify-staff').forEach(button => {
      button.addEventListener('click', () => {
          // Extract the row ID from the button's data-id attribute
          const rowId = button.dataset.id;
          editStaff(rowId);
      });
  });
});


function editStaff() {
  // Get the row containing the clicked "Modify" button
  let row = document.getElementById("staff_row");

  // Extract the stadd information from the row
  let idStaff = row.cells[0].textContent;
  let email = row.cells[1].textContent;
  let currentStaff = row.cells[3].textContent; 

  // Prompt the admin to enter the updated information
  let newIdStaff = prompt("Enter the new staff ID", idStaff);
  let newEmail = prompt("Enter the new email", email);
  let newRole = prompt("Enter the new role", currentStaff);

  // If the admin clicked "Cancel", exit the function
  if (newIdStaff === null || newEmail === null || newRole === null) {
    // Create an object to store the updated staff information
    const updatedStaff = {
      idStaff: newIdStaff,
      email: newEmail,
      current_staff: newRole
    };
  };
  
// Send the updated staff information to the server
  fetch("update_staff", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedStaff),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du membre du staff.");
    } 
    return response.json();
  })
  .then((data) => {
    console.log("Les informations ont été mises à jour correctement.", data);
    // Refresh the page to display the updated information
    location.reload();
  })
  .catch((error) => {
    console.error("Il y a eu une erreur lors de la mise à jour du membre du staff.", error);
    alert("Il y a eu une erreur lors de la mise à jour du membre du staff.");
  });
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
