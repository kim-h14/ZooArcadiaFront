// ===================== Function to fetch animals from the database =====================
function populateAnimalSelect() {
  fetch('/animal_names') 
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('animalSelect');
      select.innerHTML = '<option value="">Tous les animaux</option>';
      data.forEach(animalName => {
        const option = document.createElement('option');
        option.value = animalName;
        option.textContent = animalName;
        select.appendChild(option);
      });
      // Once the select is populated, filter the table based on the selected animal
      filterByAnimal();
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
// Function to fetch and populate animal select dropdown
function populateAnimalSelect() {
  fetch('/animal_names')
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('animalSelect');
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

// Function to fetch and display food records
async function fetchFoodRecords(animal = '') {
  try {
    // Fetch food consumption records from the server
    const response = await fetch(`/vet_food_records?animal=${encodeURIComponent(animal)}`);
    const records = await response.json();

    // Reference to the table body element
    const tbody = document.querySelector('#foodRecordTable tbody');

    // Clear existing table rows
    tbody.innerHTML = '';

    // Populate the table with fetched records
    records.forEach(record => {
      // Extracting only the date portion from the fetched date string
      const formattedDate = new Date(record.date).toLocaleDateString();

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${record.animal_name}</td>
        <td>${record.food_type}</td>
        <td>${record.food_quantity}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching food records:', error);
  }
}

// Function to filter records by selected animal
function filterByAnimal() {
  const selectedAnimal = document.getElementById('animalSelect').value;
  fetchFoodRecords(selectedAnimal);
}

// Populate animal select dropdown on page load
populateAnimalSelect();

// Fetch all food records on page load
fetchFoodRecords();

// Add event listener to filter records when animal is selected
document.getElementById('animalSelect').addEventListener('change', filterByAnimal);
