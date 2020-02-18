[http://masterywithsql.com](Mastery With SQL)

### Cool shortcuts in datagrip/dbeaver

 - Ctl+Space - Displays list of columns that you can select from a table when you write out the `select from TABLE` if cursor is in between select and from keywords
 
### Good to knows
 - '' vs ""  single quotes is for values, double is for table/database identifiers
 - Dates: Always use iso standard that is not ambiguous where updated_at > 'yyyy-mm-dd' so that when cast it will not be wierd
 - equality - sql uses 3 value comparrison, true false and unknowing, comparing anything with null is an unknowing
 - where will only return values that result in true
 - like: % is wildcare *, _ is exactly 1
 - order by: `nulls (first|last)` works on pg!  asc is default ordering
 - distinct vs distinct on: distinct is unique by tuple distinct on is more like a group by and column based

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

#### Order of Execution
famous weasels gave him some overdue love

 1. from: pick tables to be queried
 2. where: filter the rows
 3. group by: aggregate
 4. having: filter aggregates
 5. select: select columns that appear in output
 6. order by: sort rows
 7. limit
 
This order is why you can't use alias table names in a where clause that are defined in a select.

#### Order By / Limit

Always define an order by when doing a limit.  OW it will return any order and is not defined well.

Offset is supported by postgres/mysql ANSI Standard looks like this
```
offset 10
limit 5;

offset 10 rows fetch next 5 rows only;
```

#### Case things

Case columns will return `null` if there are not matches

```
select title, length
  case
    when length <= 60 then 'short'
    when length > 60 and length <= 120 then 'long'
    when length > 120 then 'very long'
    when length is null then 'this film does not have length'
    else 'unknown'
  end as length_description
from film;  

// NOTE: simple form will not handle null
  case length
    when <= 60 then 'short'
    when > 60 and length <= 120 then 'long'
    when > 120 then 'very long'
    else 'unknown'
  end as length_description
  
```
### Aggs

 - After a group by, the only operation you can perform on other columns are aggregates of other columns (sum, avg, etc) because all of the rows are essentially squashed into a single row
 - having = where for groups
 
