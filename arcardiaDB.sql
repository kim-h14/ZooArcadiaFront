-- User table
CREATE TYPE staff_role AS ENUM ('admin', 'employee', 'vet');

CREATE TABLE staff (
	id_staff SERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	current_staff staff_role NOT NULL
);


-- Services table
CREATE TABLE services (
	id_services SERIAL PRIMARY KEY,
	services_name VARCHAR(255) NOT NULL,
	services_description VARCHAR(255) NOT NULL,
	image_services_url VARCHAR(255) NOT NULL
);


-- Habitat table
CREATE TABLE habitats (
	id_habitats SERIAL PRIMARY KEY,
	habitats_name VARCHAR(255) NOT NULL,
	habitats_description VARCHAR(255) NOT NULL,
	image_habitats_url VARCHAR(255) NOT NULL
);

-- Animal table
CREATE TABLE animals (
	id_animals SERIAL PRIMARY KEY,
	animal_name VARCHAR(255) NOT NULL,
	animal_species VARCHAR(255) NOT NULL,
	animal_habitat INT REFERENCES habitats(id_habitats),
	image_animal_url VARCHAR(255) NOT NULL
);

-- Vet report table
CREATE TYPE animal_state AS ENUM ('good', 'bad', 'critical');

CREATE TABLE vet_report (
	id_report SERIAL PRIMARY KEY,
	vet_id INT REFERENCES staff(id_staff) NOT NULL,
	animal_id INT REFERENCES animals(id_animals) NOT NULL,
	animal_feeling animal_state NOT NULL,
	food_served VARCHAR(255) NOT NULL,
	food_quantity INT NOT NULL,
	date_passage DATE NOT NULL,
	report_description TEXT
);

-- Client reviews table
CREATE TABLE client_reviews (
	id_review SERIAL PRIMARY KEY,
	client_pseudo VARCHAR(255) NOT NULL,
	review TEXT NOT NULL,
	valid BOOLEAN NOT NULL
);
