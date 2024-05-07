// ===================== Function to fetch animals from the database =====================
function populateAnimalSelect() {
  // /!/ TO BE MODIFIED ONCE DATABASE IS SET UP

  fetch('/animals')
        .then(response => response.json())
        .then(data => {
            // Get the select element
            var select = document.getElementById('animalSelect');
            
            // Clear existing options
            select.innerHTML = '<option value="">Tous les animaux</option>';
            
            // Add options for each animal from the fetched data
            data.forEach(animal => {
                var option = document.createElement('option');
                option.value = animal.name;
                option.textContent = animal.name;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching animal data:', error);
        });
}

// ===================== Function to filter the table by selected animal =====================
function filterByAnimal() {
  const selectedAnimal = document.getElementById('animalSelect').value;
  const table = document.getElementById('foodRecordTable');
  const rows = table.getElementsByTagName('tr');

  // Loop through all table rows, and hide those who don't match the search query
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var animalCell = row.getElementsByTagName('td')[1];

  // If the animal cell exists and its value does not match the selected animal, hide the row
    if (animalCell) {
        var animalName = animalCell.textContent || animalCell.innerText;
        if (selectedAnimal === '' || animalName === selectedAnimal) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
  } 
}

// ===================== Function to fetch food records from the database =====================
function fetchFoodRecords() {
  fetch('/food_records')
    .then(response => response.json())
    .then(data => {
      // Get the table body element
      const tbody = document.querySelector('#foodRecordTable tbody');

      // Clear existing rows
      tbody.innerHTML = '';

      // Iterate over the fetched data and create table rows
      data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${record.date}</td>
          <td>${record.animalName}</td>
          <td>${record.foodType}</td>
          <td>${record.foodQuantity}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching food records:', error);
    });
}

// Call the function to fetch food records when the page loads
fetchFoodRecords();
