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
 - be careful on multi table joins, inner joins on a next step table basically cancel out outer joins on previous joins

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
### Aggs | grouping

 - After a group by, the only operation you can perform on other columns are aggregates of other columns (sum, avg, etc) because all of the rows are essentially squashed into a single row
 - having = where for groups
 
 #### Case in aggregate/group by
 
 You can use cases to group, the cases groups must match exactly or do something like group by (1)
 
 ```
 select 
   case
     when length < 60 then 'short'
     when length between 60 and 120 'medium'
     when length > 120 then 'long'
     else 'short
   end,
   count(*)
 from film
 group by 1;
 -- or group by ...fully repeat case statement.
 ```

You can also do case statements in aggregates

```
select
  sum(case when rating in ('R', 'NC-17') then 1 end) as adult_films,
  count(*) as total_films
  100.0 * sum(case when rating in ('R', 'NC-17') then 1 end) / count(*) as percentage
from film

-- psql gives us something specific called a filter we can use
select
  count(*) filter(where rating in ('R', 'NC-17')) as adult_films
```
 
Other Neat Queries

```
-- Return a list of customer where all payments they’ve made have been over $2
select customer_id
from payment
group  by 1
having every(amount >= 2.00) -- alias for bool_and

-- generate a histogram
select rating, repeat('+', (count(*) / 10)::int) as "count/10"
from film
where rating is not null
group by rating;
```

### Data Types

- pg_typeof(X) -> return the type of something
- cast with 
  - `int '33'`
  - ansi cast('33' as int)
  - '33'::int

#### String
- char(n) is legacy and right pads with 0 when saving
- || characters that are null results in the whole set being null 'foo' || 'bar' || null is null
 - use concat string function instaed
 
#### Numbers
- ints are generally 2, 4 or 8 bytes, they are whole.  count(*) returns a big int (8 bytes)
- numerics are fixed/floating
- ciel, floor, round, be aware of the type (numeric, precision, int, etc)

```
List percentage of total for NC-17, G, PG, PG-13, NC-17, and R

select
    ceil(sum(case when rating in ('NC-17') then 1 end)/cast(count(*) as numeric) * 100) as "NC-17",
    ceil(sum(case when rating in ('R') then 1 end)/cast(count(*) as numeric) * 100) as "R",
    ceil(sum(case when rating in ('G') then 1 end)/cast(count(*) as numeric) * 100) as "G",
    ceil(sum(case when rating in ('PG-13') then 1 end)/cast(count(*) as numeric) * 100) as "PG-13",
    ceil(sum(case when rating in ('PG') then 1 end)/cast(count(*) as numeric) * 100) as "PG"
    -- or with pg filter: round(100.0 * count(*) filter(where rating = 'NC-17') / count(*)) as "% NC-17",
from film;

% NC-17|% PG|% G|% R|% PG-13|
-------|----|---|---|-------|
     21|  19| 18| 20|     22|

select int '33'; -- int4 33
select int '33.3'; -- invalid input for integer
select cast(33.3 as int); -- int4 33
select cast(33.8 as int); -- int4 34
select 33::text; -- text 33
select 'hello'::varchar(2); -- varchar he
select cast(35000 as smallint); -- smalling out of range error
select 12.1::numeric(1,1); -- numeric field overflow
```
#### Dates
- date: use iso 'yyyy-mm-dd'
- time: 'HH:MM:DD'
- timestamp
- timestamptz: note: the results of times are relative to the locally set time
  - '2018-01-1 3:00 Australia/Brisbane'::timestamptz
  - '2018-01-1 3:00 +10'::timestamptz
  - '2018-01-1 3:00 AEST'::timestamptz
  - show timezone
- intervals
  - select timestamptz '2018-01-01 08:35 + 8' - timestamptz '2018-01-10 08:35 EST'
- date_part('hour', '2018-01-01 12:23') will return the minute value, not the total minutes (here 23 instead of much higher)
  - use date_part('epoch') to get seconds between them
- date_trunc('hour', ...) great for doing group by for a specific month/year 
- current_date, current_time, current_timestamp

```
--Get rental duration (which is an int) and print as interval of days

select title,
       extract(day from make_interval(days := rental_duration)) || ' days',
       extract(day from make_interval(days := rental_duration)) + 1 || ' days'
from film;

select
  title,
  cast(rental_duration || ' days' as interval)  as duration,
  cast(rental_duration || ' days' as interval) + interval '1 day'  as "duration + 1"
from film;

Group sales by hour of day
select extract(hour from rental_date) as part, count(*)
from rental
group by extract(hour from rental_date)
order by part asc;

-- Rentals where they occurred on last day of month
select count(*)
from payment
where date_part('day', (payment_date + INTERVAL '1 days')) = 1

select count(*) as "total # EOM rentals"
from rental
where date_trunc('month', rental_date) + interval '1 month' - interval '1 day'
        = date_trunc('day', rental_date);

-- series of every first day of month
select generate_series('2018-01-01'::timestamp, '2018-12-12'::timestamp, '1 month')

-- count number of letters in first name
select
       first_name,
       (CHAR_LENGTH(first_name) - CHAR_LENGTH(REPLACE(first_name, 'A', '')))
from customer
order by 2;

-- Sum money from weekends

select sum(amount)
from payment
where  EXTRACT(ISODOW FROM payment_date) IN (6, 7)
```

### Joins

The cartesian product of 2 tables is all permutations of combinations between them

The Cross Join is the Cartesian Product of two tables

|Table A|Table B|(Cross Join) Cartesian Product TA*TB|
|---|---|---|
|1,2,3|A,B,C|1A,1B,1C,2A,2B,2C,3A,3B,3C|


```
select * from a
cross join b on a.foo = b.foo

-- older style cross join syntax
select * from a, b
where a.foo = b.foo

-- fancier using style
select * from a
cross join b using(foo)
```

Inner Joins are a Cross Join + a Filter
 - When inner joining, output does not show up if there is not a matching row in both sides of join
 - shorthand for join is using
 
|Table A|Table B|(Cross Join) Cartesian Product TA*TB|
|---|---|---|
|1,2,3|A,B,C|1A,1B,1C,2A,2B,2C,3A,3B,3C| 
 
```
select * from a
inner join b on a.foo = b.foo
-- inner join b using (foo)
```

Outer Joins are Inner Join + adding rows back from one of the joined tables
 - left outer adds rows back from left table
 - right outer adds from the right side
 - full outer adds back from both side
 
Self Joins are easy until we only want unique items

```
C  1  2  3
1 11 12 13
2 21 22 23
3 31 32 33

select * from c as c1
inner join c as c2 
 where c1.id != c2.id

-- Would only eliminate self paired row down center (11, 22, 33)

To eliminate the duplicates of 21 with 12, you would need to do <
select * from c as c1
inner join c as c2 
 where c1.id < c2.id

-- would only select 12, 13, 23, which is what we want here
 
```
 
 

Say we were wanting to se

#### Full Summary

For example 

create table users (
  user_id int primary key,
  first_name varchar(20)
);

create table beverages (
  beverage_id int primary key,
  name varchar(20),
  user_id int not null
--   FOREIGN KEY (user_id) REFERENCES users (user_id)
--   removing foreign key so that we can see nulls in cross joins
);

insert into users (user_id, first_name) values (1, 'jim');
insert into users (user_id, first_name) values (2, 'jane');

insert into beverages (beverage_id, name, user_id) values (97, 'beer', 1);
insert into beverages (beverage_id, name, user_id) values (98, 'water', 2);
insert into beverages (beverage_id, name, user_id) values (99, 'vinegar', 55);

users table
|user_id|first_name|
|---|---|
|1|jim|
|2|jane|

beverages table
|beverage_id|user_id|item|
|---|---|
|97|1|'beer'|
|98|2|'water'|
|99|55|'vinegar'|
```

select * from users
cross join beverages;

```
|users.user_id|users.first_name|beverages.beverage_id|beverages.user_id|beverages.item|
|---|---|---|---|---|
|1	|jim	|97	|beer	|1    |
|1	|jim	|98	|water	|2    |
|1	|jim	|99	|vinegar|	55|
|2	|jane	|97	|beer	|1    |
|2	|jane	|98	|water	|2    |
|2	|jane	|99	|vinegar|	55|

```
select * from users
inner join beverages using (user_id);
```

|users.user_id|users.first_name|beverages.beverage_id|beverages.item|
|---|---|---|---|---|
|1|	jim	|97	|beer |
|2|	jane|98	|water|

```
select * from users
left outer join beverages using (user_id);

```

|users.user_id|users.first_name|beverages.beverage_id|beverages.item|
|---|---|---|---|
|1|	jim	|97	|beer |
|2|	jane|98	|water|

```
select * from users
right outer join beverages using (user_id);
```

|users.user_id|users.first_name|beverages.beverage_id|beverages.item|
|---|---|---|---|
|1|	jim	|97	|beer |
|2|	jane|98	|water|
|55|<null>|99|vinegar|
```
-- find the beverages that don't have a user
select * from beverages
left outer join users using (user_id)
where users.first_name is null;

```

|users.user_id|users.first_name|beverages.beverage_id|beverages.item|
|---|---|---|---|
|55|99|venegar|<null>|

#### Join Exercises

```
Write a query to show for each customer
-- how many different (unique) films they've rented and
-- how many different (unique) actors they've seen in films they've rented
select c.customer_id, count(distinct(f.film_id)), count(distinct(fa.actor_id)) from customer c
join rental r on c.customer_id = r.customer_id
join inventory i on r.inventory_id = i.inventory_id
join film f on i.film_id = f.film_id
join film_actor fa on f.film_id = fa.film_id
group by c.customer_id;

--  Write a query to return a count of how many of each film we have in our inventory (include all films).
--  Order the output showing the lowest in-stock first so we know to buy more!

-- notice that we count on the right joined table column so that we do not count null values as 1 row in the count result
--   Not doing this step would cause our values to be 1 when there were no films in inventory
select film.title, count(inventory_id) from film
left outer join inventory using (film_id)
group by film_id
order by 2 asc;


-- Write a query to return how many copies of each film are available in each store, including zero counts if there are none.
-- Order by count so we can easily see first which films need to be restocked in each store

-- notice how we first create the set of data we will need with the cross join first (all film/store combos) before jumping into other tables
select film.title, film.film_id, store.store_id, count(inventory.inventory_id) as stock from film
  cross join store
left join inventory on film.film_id = inventory.film_id and store.store_id = inventory.store_id
group by film.film_id, store.store_id
order by 2,3,4;

-- find the rentals that were made each month of 2005
select m.t, count(inventory_id)
from generate_series('2005-01-01'::timestamp, '2005-12-01'::timestamp, '1 month') as m(t)
  left outer join rental on m.t = date_trunc('month', rental.rental_date)
  group by m.t;

-- Write a query to list the customers who rented out the film with ID 97 and then at some later date rented out the film with ID 841
select r2.customer_id as "Very Specific Order History People" from rental r1
  join inventory as i1 on r1.inventory_id = i1.inventory_id AND i1.film_id = 97
  cross join (
      select * from rental
      join inventory on rental.inventory_id = inventory.inventory_id AND inventory.film_id = 841) as r2
  where r1.customer_id = r2.customer_id
    and r1.rental_date < r2.rental_date;
```



