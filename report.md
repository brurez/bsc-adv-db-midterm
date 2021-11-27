# Midterm assignment
## Databases and Advanced Data Techniques

## 1. Finding and analysing the dataset

### Where the data came from
    
- open
- a normalized, rel. model doesnt exist on the web

The chosen dataset is part of the "Classical Archives Corpus" of Yale University [1].
This project cataloged harmonic and rhythmic information of Western European classical music using midi files as the source [2].
Along with this information we have metadata containing data such as composer, composition date, musical genre, instruments and other fields. 
This metadata is what I will be using in this assigment.

### Analysing the dataset
- questions I would like to ask
- criteria used in discussion 1.104: quality, level of detail, documentation, interrelation, use, discoverability
- assess terms of use (discussion 1.206)

This dataset is available in CSV format and contains 17 columns with rich information about each classical musical composition that is part of the archive.
Despite the rich data, we have some problems like blank fields, duplicate information and fields that could be splited.

#### Quality and level of detail
The dataset is reliable as the method of collection and the transformations that were made on this data
are accurately documented in the Yale-Classical Archives Corpus (YCAC) article [2].

#### Dataset terms of use
The article about the dataset [2] was published under "Creative Commons Attribution-NonCommercial 4.0 International License".
This article contains links to download the dataset that does not provide any additional licenses.
This license (CC BY-NC 4.0) allows us to distribute and adapt the content for non-commercial purposes when attributing credit to the authors [3].


### Why this data
- what's interesting about this data
- questions I could ask by using a database for this dataset

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
The column "Nationality" depends exclusively on the column "Composer" because
it represents the country where the composer was born.
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

## 3. Creating a MySQL database
- Build db in lab
- Record all CREATE commands
- Enter instance data and explain how it was done
- How well DB reflects the data? 2 points good our bad
- List SQL commands that answer the previous items

### CREATE commands
`CREATE DATABASE `music_metadata` CHARACTER SET utf8 COLLATE utf8_unicode_ci;`

```
CREATE TABLE `instrument` (
	`instrument_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	UNIQUE KEY `instrument_id_key` (`id`) USING BTREE,
	PRIMARY KEY (`id`)
);
```

```
CREATE TABLE `genre` (
	`genre_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	UNIQUE KEY `genre_id_key` (`id`) USING BTREE,
	PRIMARY KEY (`id`)
);
```

```
CREATE TABLE `country` (
	`country_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	UNIQUE KEY `country_id_key` (`id`) USING BTREE,
	PRIMARY KEY (`id`)
);
```

```
CREATE TABLE `composer` (
	`composer_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`lastname` VARCHAR(255) NOT NULL,
	UNIQUE KEY `composer_id_key` (`id`) USING BTREE,
	PRIMARY KEY (`id`)
);
```

```
CREATE TABLE `music_instrument_join` (
	`instrument_id` BIGINT unsigned NOT NULL,
	`music_id` BIGINT unsigned NOT NULL,
	`order` SMALLINT unsigned NOT NULL DEFAULT '1',
    UNIQUE KEY `music_id_order_key` (`music_id`,`order`),
	PRIMARY KEY (`music_id`,`order`)
);

```

```
CREATE TABLE `music_genre_join` (
	`genre_id` BIGINT unsigned NOT NULL,
	`music_id` BIGINT unsigned NOT NULL,
	`is_subgenre` BOOLEAN unsigned NOT NULL DEFAULT '0',
    UNIQUE KEY `music_id_is_subgenre_key` (`music_id`,`is_subgenre`),
	PRIMARY KEY (`music_id`,`is_subgenre`)
);

```


```
CREATE TABLE `music` (
	`music_id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`date_range_start` DATE,
	`date_range_end` DATE,
	`date_exact` DATE,
	`modulation` VARCHAR(31),
	`key` VARCHAR(31) NOT NULL,
	`catalogue_number` VARCHAR(63),
	`composer_id` BIGINT unsigned NOT NULL,
	UNIQUE KEY `music_id_key` (`id`) USING BTREE,
	PRIMARY KEY (`id`)
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

## Diagram link
https://erdplus.com/edit-diagram/d1c1ad32-cf88-4e52-8be9-9fc7551d04cf
