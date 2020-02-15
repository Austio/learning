[http://masterywithsql.com/](Mastery With SQL)

### Cool shortcuts in datagrip/dbeaver

 - Ctl+Space - Displays list of columns that you can select from a table when you write out the `select from TABLE` if cursor is in between select and from keywords

### Common Definitions and Basics

Common definitions
 - Constraints: ensure right data goes in. provide Referential integrety (foreign keys, primary keys, not null) make sure validity of data is correct (join table).
 - Normalization: ensures things are mapped correctly, a film with actor_1, actor_2, etc vs an actor_files join table
 
Derived Queries create a new representations of another column or group of columns

```
select 
 3 * 3 as "multiplications",
 film_duration,
 film_duration * 24 as film_duration_hours
from films;

|9|1|24|
|9|3|72|...

select 
  return_date - rental_date as duration_rented
from rentals;
```

Functions can combine with Derived Queries to make results do hula dances
```
select
  first_name, 
  last_name,
  initcap(first_name || " " || last_name) as "Full Name"
from actors;

|JIM|JONES|Jim Jones|
```
