-- User table
CREATE TABLE user (
  id_user INT AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  type ENUM('admin', 'employee', 'vet') NOT NULL
)

-- Services table
CREATE TABLE services (
  id_service INT,
  name_service VARCHAR(255) NOT NULL,
  description_service TEXT NOT NULL
)

-- Habitat table
CREATE TABLE habitat (
  id_habitat INT,
  name_habitat VARCHAR(255) NOT NULL,
  description_habitat TEXT NOT NULL
)

-- Animal table
CREATE TABLE animal (
  id_animal INT,
  name_animal VARCHAR(255) NOT NULL,
  species_animal VARCHAR(255) NOT NULL,
  habitat_id INT REFERENCES habitat(id_habitat) NOT NULL
)

-- Vet report table
CREATE TABLE vet_report (
  id_report INT, 
  vet_id INT REFERENCES user(id_user) NOT NULL,
  id_animal INT REFERENCES animal(id_animal) NOT NULL,
  animal_state ENUM('good', 'bad', 'critical') NOT NULL,
  food_served VARCHAR(255) NOT NULL,
  food_quantity INT NOT NULL,
  date_passage DATE NOT NULL,
  description_report TEXT
) 

-- Client reviews table
CREATE TABLE client_reviews (
  id_review INT,
  pseudo_client VARCHAR(255) NOT NULL,
  review TEXT NOT NULL,
  valid BOOLEAN NOT NULL
)

-- Connextion table
CREATE TABLE connexion (
  id_connexion INT,
  user_id INT REFERENCES user(id_user) NOT NULL,
  date_connexion TIMESTAMP
)


-- Static Consultation table
CREATE TABLE static_consultation (
  id_static_consultation INT AUTO_INCREMENT,
  id_animal INT REFERENCES animal(id_animal) NOT NULL,
  consultation_count INT NOT NULL,
)