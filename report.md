# Midterm assignment
## Databases and Advanced Data Techniques

## 1. Finding and analysing the dataset

### Where the data came from
    
- open
- a normalized, rel. model doesnt exist on the web

The chosen dataset is part of the "Classical Archives Corpus" from Yale University [1].
This project cataloged harmonic and rhythmic information of Western European classical music using midi files as the source [2].
Along with this information we have metadata containing data such as composer, composition date, musical genre, instruments and other fields. 
This metadata is what I will be using in this assigment.

### Analysing the dataset
- questions I would like to ask
- criteria used in discussion 1.104: quality, level of detail, documentation, interrelation, use, discoverability
- assess terms of use (discussion 1.206)

This dataset is available in CSV format and contains 17 columns with rich information about each classical musical composition that is part of the archive.

#### Issues with the data and how to address the problem

Despite the rich data, we have some problems like blank fields,
duplicated information and columns with data that could be split into multiple columns.

**Blank fields** :
The `category_number` column has many rows with missing values.
This issue can be addressed by creating columns in the MySQL database
**without** the constraint `NOT NULL`. This is also semantic appropriate because
catalogue number doesn't exist for all music pieces.

**Multiple columns representing the same entity**: We have 3 columns
representing the same entity "instrument": `inst1`, `inst2`, `inst3`.
This make sense in the real world as we can have a music with many instrument parts.
However, this can cause problems when implementing a relational databases.
For example if we create 3 columns as it is in the CSV files we will
not be able to add a fourth instrument without changing the table 
structure. We could create one single field with a list of instruments
but we would be violation the First Normal Form.
The solution I chose, as seen further ahead, was to create a junction 
table to allow for a many-to-many relationship between the music 
entity and the instrument entity.

#### Quality
This dataset is **reliable** as the collection and preparation process has been well documented and supported by a renowned research institution.
The data is also quite complete, although we have blank fields.
The `category_number` column, for example, has many rows with missing values
but this is correct because the catalogue number doesn't exist for all music pieces [4].
Most importantly, the data is **consistent**. 
Dates, for example, are always represented in the same format, with just the year.
Columns containing repeated text do not contain variations between repetitions.
For example the column genre displays each genre in the same way.
This will facilitate data normalization.
Since this data represents songs from previous centuries,
we don't need to worry that the data is up-to-date, 
unless we have some historical discovery that invalidates it.

#### Level of detail
The data is quite detailed considering its scope of representing only
the songs' metadata. There is a larger dataset which this one is part
of which contains MIDI files and audio files but these would not be 
interesting to do relational modeling here.

#### Documentation
The method of collection and preparation that were made on this data
are accurately documented in the Yale-Classical Archives Corpus (YCAC) article [2].

#### Interrelation
This dataset could be connected, for example, with another dataset about where and
when those piece of music where performed. This relation between these
two dataset could be done by using a composite foreign key referencing
both the music title and composer name to avoid more generic titles like "Violin Concerto No. 1"
to be referenced incorrecly.
#### Use

This dataset could be useful in any context where we have users listening
or playing those music pieces by complementing the information about
the music. 

#### Discoverability
It wasn't hard to find this dataset. There are many initiatives that try to catalog and record pertinent information about classical musical pieces.

#### License / terms of use
The article about the dataset [2] was published under "Creative Commons Attribution-NonCommercial 4.0 International License".
This article contains links to download the dataset that does not provide any additional licenses.
This license (CC BY-NC 4.0) allows us to distribute and adapt the content for non-commercial purposes when attributing credit to the authors [3].


### Why this data
- what's interesting about this data
- questions I could ask by using a database for this dataset

These data are particularly interesting to me as I work in the field 
of digital sheet music publishing.
Although the CSV has a relatively good structure, 
we have in these data many opportunities for normalization
Converting this CSV file into a relational database I hope to be possible:
- Make queries efficiently and allow for scalability
- Avoid data inconsistency by reducing the number of duplicate values
- Allow efficient aggregation of data and application of statistical analysis

## 2. Modeling the data
- draw complete ER model
- Add cardinality
- List tables and fields
- Evaluate against normal forms

### Normal forms evaluation

#### Original table (as it is in the CSV file)
**Music Table**
- title
- composer
- category_number
- date
- range
- inst1
- inst2
- inst3
- genre
- subgenre
- nationality
- key
- modulation

#### 1NF
The column `range` represents a date range where the music was composed, and it is
represented in the original CSV file as a string combining two years, e.g. "1740-1770".
This violates the first normal form because the range can be split into two scalar values: the range start date and the range end date.

**Music Table**
- title
- composer
- category_number
- date
- range_start
- range_end
- inst1
- inst2
- inst3
- genre
- subgenre
- nationality
- key
- modulation

#### 2NF
There is no column combination that provide us unique values to identify each music.
We could try a composite key composed by the "Title" and "Composer" but we would still 
have rows with repeated pairs of values with different "CatNo". We could then include
"CatNo" in the composite key but there are rows that are missing this column.
Therefore, we need to create a new column to be the music table key, e.g. "music_id".
When using a single column as key, we automatically have the music table in second normal form
because we can't have partial dependency with keys that are not composite.

**Music Table**
- music_id
- title
- composer
- category_number
- date
- range_start
- range_end
- inst1
- inst2
- inst3
- genre
- subgenre
- nationality
- key
- modulation

#### 3NF
The column "Nationality", representing the country where the composer was born,
depends exclusively on the column "Composer".
In this case we have a transitive dependency between "music_id" and "nationality"
in the form "music_id" -> "composer" -> "nationality"
For this reason we have to move the columns "Composer" and "Nationality" to a separate table.

**Music Table**
- music_id
- title
- category_number
- date
- range_start
- range_end
- inst1
- inst2
- inst3
- genre
- subgenre
- key
- modulation

**Composers Table**
- name
- nationality

#### 4NF

#### Final tables

**Music Table**
- music_id (primary key)
- title
- category_number
- date
- range_start
- range_end
- inst1
- inst2
- inst3
- genre
- subgenre
- key
- modulation
- composer_id (foreign key)

**Genre / Music Join Table**

**Genre Table**
- genre_id (primary key)
- name

**Instruments Table**
- instrument_id (primary key)
- name

The information about the composers was extracted to its own table.
I added the column `composer_id` as a primary unique key because the
column `lastname` cannot be used and many composers can have the same
lastname.

**Composers Table**
- composer_id (primary key)
- lastname
- nationality

## 3. Creating a MySQL database
- Build db in lab
- Record all CREATE commands
- Enter instance data and explain how it was done
- How well DB reflects the data? 2 points good our bad
- List SQL commands that answer the previous items

### Entering instance data

I created a script `server/db/factory.js` to iterate over
all rows and create the appropriate tables for each entry.
The script try to insert every row and rely on the 
UNIQUE KEY constraint to not have duplicated entities.
The only exception is when the script insert data for the composer table.
In this table we are allowing to have many rows with the same lastname because
there is different composers with the same lastname.
Because there is no UNIQUE KEY constraint for the `lastname` column,
we first check if already exist a record with same lastname
before insert.

### CREATE commands

#### Database creation
```
CREATE DATABASE `music_metadata` CHARACTER SET utf8 COLLATE utf8_unicode_ci;

```

#### User creation
I created a new user with restricted privileges to be used in the
web application. This user can only read data and not write.
As the data has already been inserted into the database by the root user,
the database user used in the web application does not need to have 
write permission. 
This restricts the possibilities of exploiting the system and finding 
vulnerabilities.

```
CREATE USER 'readuser'@'localhost' IDENTIFIED BY 'strong-password';
GRANT SELECT ON music_metadata.* TO 'readuser'@'localhost';
```
#### Tables creation
```
CREATE TABLE IF NOT EXISTS `instrument` (
	`instrument_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	UNIQUE KEY `instrument_id_key` (`instrument_id`),
	PRIMARY KEY (`instrument_id`)
);

CREATE TABLE IF NOT EXISTS `genre` (
	`genre_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	UNIQUE KEY `genre_id_key` (`genre_id`),
	PRIMARY KEY (`genre_id`)
);

CREATE TABLE IF NOT EXISTS `country` (
	`country_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	UNIQUE KEY `country_id_key` (`country_id`),
	PRIMARY KEY (`country_id`)
);

CREATE TABLE IF NOT EXISTS `composer` (
	`composer_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`lastname` VARCHAR(255) NOT NULL,
    `country_id` BIGINT unsigned NOT NULL,
    UNIQUE KEY `composer_id_key` (`composer_id`),
	PRIMARY KEY (`composer_id`),
	FOREIGN KEY (`country_id`) REFERENCES country(`country_id`)
);

CREATE TABLE IF NOT EXISTS `music_instrument_join` (
	`instrument_id` BIGINT unsigned NOT NULL,
	`music_id` BIGINT unsigned NOT NULL,
	`order` SMALLINT unsigned NOT NULL DEFAULT '1',
    UNIQUE KEY `music_id_order_key` (`music_id`,`order`),
	PRIMARY KEY (`music_id`,`order`)
    FOREIGN KEY (`instrument_id`) REFERENCES instrument(`instrument_id`)
    FOREIGN KEY (`music_id`) REFERENCES music(`music_id`)
);

CREATE TABLE IF NOT EXISTS `music_genre_join` (
	`genre_id` BIGINT unsigned NOT NULL,
	`music_id` BIGINT unsigned NOT NULL,
	`is_subgenre` BOOLEAN NOT NULL DEFAULT 0,
    UNIQUE KEY `music_id_is_subgenre_key` (`music_id`,`is_subgenre`),
	PRIMARY KEY (`music_id`,`is_subgenre`),
    FOREIGN KEY (`genre_id`) REFERENCES genre(`genre_id`)
    FOREIGN KEY (`music_id`) REFERENCES music(`music_id`)
);

CREATE TABLE IF NOT EXISTS `music` (
	`music_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`date_range_start` DATE,
	`date_range_end` DATE,
	`date_exact` DATE,
	`modulation` VARCHAR(31),
	`key` VARCHAR(31) NOT NULL,
	`catalogue_number` VARCHAR(63),
	`composer_id` BIGINT unsigned NOT NULL,
	UNIQUE KEY `music_id_key` (`music_id`),
	PRIMARY KEY (`music_id`),
    FOREIGN KEY (`composer_id`) REFERENCES composer(`composer_id`)
);
```


## 4. Building a web application
- Simple
- Address motivations and questions from previous item
- Use fewer db privileges as possible

## Reference
[1] Yale–Classical Archives Corpus. Available at: https://ycac.yale.edu/. (Accessed: 27th November 2021)
[2] White, C. W. & Quinn, I. The Yale-Classical Archives Corpus. Empirical Musicology Review 11, 50 (2016). 
[3] Creative Commons License Deed. Creative Commons - Attribution-NonCommercial 4.0 International - CC BY-NC 4.0 Available at: https://creativecommons.org/licenses/by-nc/4.0/. (Accessed: 27th November 2021)
[4] Catalogues of classical compositions. Wikipedia (2021). Available at: https://en.wikipedia.org/wiki/Catalogues_of_classical_compositions. (Accessed: 29th November 2021)

## Diagram link
https://erdplus.com/edit-diagram/d1c1ad32-cf88-4e52-8be9-9fc7551d04cf
