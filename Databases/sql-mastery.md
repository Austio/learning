[http://masterywithsql.com](Mastery With SQL)

### Setup
 - https://github.com/neilwithdata/mastery-with-sql

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
 - CTE: Common Table Expression.  Extract table from query
 
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

### Subqueries

#### Uncorrelated Subqueries
Queries that contain other queries that could completely stand on their own.

```
-- 7.1 Write a query to return all the customers who made a rental on the first day of rentals
-- (without hardcoding the date for the first day of rentals in your query)
select * from rental
  where date_trunc('day', rental_date) = (select date_trunc('day', min(rental_date))
  from rental);

select email, rental_date from customer
join rental using (customer_id)
where date_trunc('day', rental.rental_date) =  (select date_trunc('day', min(rental.rental_date)) from rental);

-- 7.2 Using a subquery, return the films that don't have any actors.
-- Now write the same query using a left join. Which solution do you think is better? Easier to read?

select * from film
 left join film_actor using (film_id) where film_actor.actor_id is null;

select * from film
  where film.film_id not in (select distinct film_id from film_actor)

-- 7.3 You intend to write a humorous email to congratulate some customers on their poor taste in films.
-- To that end, write a query to return the customers who rented out the least popular film (that is,
-- the film least rented out - if there is more than one, pick the one with the lowest film ID)

select film.title, customer.email from film
join inventory using (film_id)
join rental using (inventory_id)
join customer using (customer_id)
where film.film_id = (select film_id from film
    left join inventory using (film_id)
    left join rental using (inventory_id)
    group by film_id
    having count(rental_id)  > 0
    order by count(rental_id), film_id
    limit 1);
```

#### Correlated Subqueries 
A subquery that references something in an outer table and cannot stand on its own

```
-- 7.4 Write a query to return the countries in our database that have more than 15 cities
select country.country from country
where (
    select count(*)
    from city
    where city.country_id = country.country_id
    ) > 15

-- 7.5 Write a query to return for each customer the store they most commonly rent from

select c.email, (
    select store.store_id from customer
    join rental using (customer_id)
    join inventory using (inventory_id)
    join store on store.store_id = inventory.store_id
    where customer.email = c.email
    group by store.store_id
    order by count(rental_id) desc
    limit 1
) from customer as c

-- Solution
select
  c.customer_id,
  c.first_name,
  c.last_name,
  (select i.store_id
   from rental as r
     inner join inventory as i using (inventory_id)
   where r.customer_id = c.customer_id
   group by i.store_id
   order by count(*) desc
   limit 1) as "Favourite Store"
from customer as c;

-- 7.6 In the customer table, each customer has a store ID which is the store they originally registered at.
-- Write a query to list for each customer whether they have ever rented from a different store than that one they registered at.
-- Return 'Y' if they have, and 'N' if they haven't.

select c.email, (
    select
      case count(*)
      when 0 then 'N'
      else 'Y'
      end
    from customer
    join rental using (customer_id)
    join inventory using (inventory_id)
    join store on inventory.store_id = store.store_id
    where c.customer_id = customer.customer_id
      and store.store_id != c.store_id
    ) from customer as c

-- solution
select c.first_name, c.last_name,
  case
    when exists
      (select *
       from rental as r
         inner join inventory as i using (inventory_id)
       where r.customer_id = c.customer_id
         and i.store_id != c.store_id) then 'Y'
    else 'N'
  end as "HasRentedOtherStore"
from customer as c;
```

#### Table Subqueries
Where you create a table you select from as a subquery and you can rename columns as needed form it

```
select *
from (select customer_id, count(*) from rental group by customer_id) as t

-- You can reference the tables indirectly
select customer_id, count
from (select customer_id, count(*) from rental group by customer_id) as t

-- You can also rename the returned queries from the subquery
select t.the_id, t.the_count
from (select customer_id, count(*) from rental group by customer_id) as t(the_id, the_count)
```

You can also create tables with values inline.

```
select *
from
(values
        ('short', 0, 60),
        ('medium', 60, 120),
        ('long', 120, 10000)) as t("desc", "min", "max")
        
-- useful when replacing a case statement

select t.desc, film.*
from
(values
        ('short', 0, 60),
        ('medium', 60, 120),
        ('long', 120, 10000)) as t("desc", "min", "max")
join film on film.length >= t.min and film.length < t.max;
```


-- 7.7 Write a query to return each customer 4 times

```
select first_name, last_name from customer
cross join (values (1),(2),(3),(4)) as t("times_to_repeat_this");;
```

-- 7.8 Write a query to return how many rentals the business gets on average on each day of the week.
-- Order the results to show the days of the week with the highest average number of rentals first
-- (use the round function to round the average so it's a nice whole number).
-- Have a look at the to_char function to obtain the day name given a timestamp.
-- For simplicity, don't worry about days in which there were no rentals.

```
select (rent_totals.total_rentals / day_count.total_days) as average_per_day, rent_totals.day_of_week from
(select
  count(rental_id) as total_rentals,
  to_char(rental_date, 'Day') as day_of_week from rental
group by 2) as rent_totals
join (select count(*) as total_days, day_of_week
from (
         select distinct(to_char(rental_date, 'J')) as julian_date, to_char(rental_date, 'Day') as day_of_week
         from rental
     ) as dates
group by 2) as day_count
on day_count.day_of_week = rent_totals.day_of_week
order by 1 desc;

select to_char(t.day, 'Day'), round(avg(count)) from (select date_trunc('day', rental.rental_date), count(*) from rental
group by 1) as t("day", "count")
group by 1
order by 2 desc;

-- Solution 
select
  to_char(rent_day, 'Day') as day_name,
  round(avg(num_rentals)) as average
from
  (select date_trunc('day', rental_date) as rent_day, count(*) as num_rentals
   from rental
   group by rent_day) as T
group by day_name
order by average desc;
```

#### Lateral subqueries

These allow you to do a join on a correlated subquery.  Notice in the example below that we are able to use outer_customer in the inner joined table

```
-- 7.9 Write a query to return for each customer the first 'PG' film that they rented (include customers who have never rented a 'PG' film as well)

select outer_customer.email, t.title, t.rental_date from customer as outer_customer
left outer join lateral (
  select rental.customer_id, film.title, rental.rental_date from rental
  join inventory using (inventory_id)
  join film using (film_id)
  where rental.customer_id = outer_customer.customer_id
    and film.rating = 'PG'
  order by rental_date desc
  limit 1
    ) as t on outer_customer.customer_id = t.customer_id;
```

#### Common Table Expressions (CTE)

These allow us to pull out tables: Syntax in postgres is as follows

```
with TABLE__NAME(column_names*) as (SQL_QUERY)


-- 7.10 Write a query to list the customers who rented out the film with title "BRIDE INTRIGUE" and then at some later date rented out the film with title "STAR OPERATION".
-- Use a CTE to simplify your code if possible.

with min_bride_query(customer_id, rental_date) as (select customer.customer_id, min(rental.rental_date) from customer
  join rental using(customer_id)
  join inventory using (inventory_id)
  join film using (film_id)
  where film.title = 'BRIDE INTRIGUE'
  group by customer.customer_id )

select * from customer
join rental using(customer_id)
join inventory using (inventory_id)
join film using (film_id)
join min_bride_query on min_bride_query.customer_id = customer.customer_id
where film.title = 'STAR OPERATION'
  and rental.rental_date > min_bride_query.rental_date;

-- Solution
  
with rental_detail as
(
  select r.customer_id, r.rental_date, f.title
  from rental as r
    inner join inventory as i using (inventory_id)
    inner join film as f using (film_id)
)
select r1.customer_id
from rental_detail as r1
  inner join rental_detail as r2
    on r1.customer_id = r2.customer_id
    and r2.rental_date > r1.rental_date
    and r1.title = 'BRIDE INTRIGUE' and r2.title = 'STAR OPERATION';
    
-- second time through
with film_join(date,title,customer_id) as (select rental.rental_date, title, rental.customer_id from rental
join inventory i on rental.inventory_id = i.inventory_id
join film f on i.film_id = f.film_id)

select * from film_join f1
join film_join f2 on f1.customer_id = f2.customer_id
where f1.title = 'STAR OPERATION'
  and f2.title = 'BRIDE INTRIGUE'
  and f1.date > f2.date
  
-- 7.11 Write a query to calculate the amount of income received each month and compare that against the previous month's income, showing the change.

with month(month, total) as (
    select date_trunc('month', rental_date), sum(payment.amount) from rental
    join payment using (rental_id)
    group by date_trunc('month', rental_date)
    order by 1 asc
)

select * from month
cross join lateral (
    select sum(payment.amount) from rental
    join payment using (rental_id)
    where date_trunc('month', rental.rental_date) = (month.month - interval '1 month')
) as t;

-- Solution

with monthly_amounts as
(
  select
    date_trunc('month', payment_date) as month,
    sum(amount) as total
  from payment
  group by month
)
select
  curr.month,
  curr.total as "income",
  prev.total as "prev month income",
  curr.total - prev.total as "change"
from monthly_amounts as curr
  left join monthly_amounts as prev
    on curr.month = prev.month + interval '1 month'

-- second attempt

with months(month, amount) as (
    select date_trunc('month', payment_date), sum(amount) from payment
    group by 1
    order by 1)
select * from months as current_month
  left join months previous_month on current_month.month = (previous_month.month + interval '1 month');
```

#### Subquery Challenges

```
-- 7.12 Write a query to return the customers who rented a film in 2005 but none in 2006
with r2005(customer_id_05) as (
    select distinct(customer_id) from rental as r
    where date_part('year', r.rental_date) = 2005
), r2006(customer_id_06) as (
    select distinct(customer_id) from rental as r
    where date_part('year', r.rental_date) = 2006
)
select customer_id_05 from r2005
left outer join r2006 on r2005.customer_id_05 = r2006.customer_id_06
where customer_id_06 is null;

-- Solution (more simple)
select distinct customer_id
from rental
where date_part('year', rental_date) = 2005
  and customer_id not in
    (select customer_id
     from rental
     where date_part('year', rental_date) = 2006);

-- 7.13 What are the top 3 countries the customers are from.
-- Show both the number of customers from each country and percentage (round the percentage to the nearest whole number)

with totals(country_id, total, name) as (
    select c2.country_id, count(*), c2.country from customer
  join address a on customer.address_id = a.address_id
  join city c on a.city_id = c.city_id
  join country c2 on c.country_id = c2.country_id
  group by 1
  order by 2 desc
), sums(s) as (
    select sum(total)
    from totals
)

select name, round((round(total/s, 3) * 100)), s, total from totals cross join sums
limit 3

-- or 
  select c2.country, c2.country_id, count(*) as num_customers, (count(*) * 1.0 / (select count(*) from customer)) from customer
  join address a on customer.address_id = a.address_id
  join city c on a.city_id = c.city_id
  join country c2 on c.country_id = c2.country_id
  group by 2
  order by 3 desc
  limit 3

-- pass 3
select c3.country,
       count(*) as total,
       round((count(*) * 1.0/ (select count(*) from customer)) * 100, 0)
  from customer c
  join address a on c.address_id = a.address_id
  join city c2 on a.city_id = c2.city_id
  join country c3 on c2.country_id = c3.country_id
  group by 1
  order by 2 desc;

-- 7.14 Write a query to perform a running total of payments received, grouping by month
-- (ie. for each month return the amount of money received that month and also the total amount of money received up to (and including)
-- that month - this is a useful view to have if you wanted to produce a cumulative chart). Hint - Re-use the monthly_amounts CTE from exercise 7.11

with months(month_date) as (
    select distinct date_trunc('month', rental_date) from rental
    order by 1
  )
select * from months as m
cross join lateral (
    select sum(amount) from rental as r
    join payment p on r.rental_id = p.rental_id
    where date_trunc('month', rental_date) <= m.month_date
) as cumulative

-- pass 2
with dates(month,total) as (
    select date_trunc('month', payment.payment_date), sum(amount) from payment
    group by 1
    order by 1 asc
    )
select * from dates d1
cross join lateral (
    select sum(d2.total) from dates d2
    where d1.month >= date_trunc('month', d2.month)
) as cumulative;


-- 7.15 The rental table has 16,044 rows but the maximum rental ID is 16,049.
-- This suggests that some rental IDs have been skipped over. Write a query to find the missing rental IDs.
-- The generate_series function may come in handy

select all_ids as "Missing IDS" from generate_series(1, 16049) as all_ids
  left outer join (
      select rental_id from rental
    ) as rental_id
   on all_ids = rental_id
   where rental_id is null;


-- 7.16 In an earlier exercise I asked you to see if you could find a way to return the last 3 payments made in Jan, 2007
-- but ordered ascending. You've got the tools now to accomplish this - see if you can figure it out!

select * from (
    select * from payment
    where date_trunc('day', payment.payment_date) = '2007-01-31'
    order by payment_date desc
    limit 3
    ) as dates
  order by payment_date asc;
```

### Window Functions

Kind of like correlated subqueries but different.  

|function|what it does|example result|
|---|---|---|
|row_number|order sequential similar to regular numeric primary key|1,2,3,4,5,6,7|
|rank|ordered sequentially by row_number but with all equal having same number|1,2,3,3,3,6,7|
|dense_rank|ordered sequentially by rank but with all equal having same number|1,2,3,3,3,4,5|

example query
```
select 
 rating, 
 title,
 row_number() over (order by length),
 rank() over (order by length),
 dense_rank() over (order by length),
 dense_rank() over (group by rating order by length)
from film
```

The window for the function is easy to consider if you think of the partition as the actual window of data we are looking at.
Think of the window as being the restriction that is being applied by the partition.

```
select 
  title,
  avg(length) over (partition by rating)
from film

// for a film that has a a given rating of 'G'
avg(length) over (partition by rating)

// partitiion window expands on this
select rating, avg(length)
from film
group by rating
having rating = 'G';
```

When you add a "window frame" using an order by, aggregate functions will show a running total of the aggregate of the partition.
This is a default of how things work using a final 'rows between unbounded preceding current row'

You could adjust this and set it so that you could get something like a moving average of the last couple of days

```
select customer_id, payment_date, amount 
  avg(amount) over (partition by customer_id 
                    order by payment date
                    // implied
                    rows between unbounded preceding current row)

// To remove this behavior of having a running average you would change the 'rows between to be
rows between unbounded preceding and unbounded following

// to get a running average of last 3 days
rows between 2 preceding rows and current row
```

As additional aggregate functions (sum, avg, etc) there is also 
 - lag: used to get back n value 
 - lead: used to get forward n value
 - ntile: percentile the current record is relative to window
 - cume_dist: distribution
 - first_value, nth_value and last_value: relative to the window *UP TO THE CURRENT ROW OF THE WINDOW BY DEFAULT*
 
#### Query Examples

```
-- 8.1 Write a query to return the 3 most recent rentals for each customer.
   -- Earlier you did this with a lateral join - this time do it with window functions
   
   select * from (select
          customer_id,
          rental_id,
           row_number() over (partition by customer_id order by rental_date desc),
           inventory_id
         from rental) as t(c,r,n,i)
   where n <= 3;

-- 8.2 We want to re-do exercise 7.3, where we wrote a query to return the customers who rented out the least popular film
-- (that is, the film least rented out). This time though we want to be able to handle if there is more than
-- one film that is least popular. So if several films are each equally unpopular, return the customers who rented out any of those films.

with counts as  (
    select f.title, f.film_id, count(f.film_id) from rental
    join inventory i on rental.inventory_id = i.inventory_id
    join film f on i.film_id = f.film_id
    group by f.film_id
), ranks as (
    select film_id,
           title,
           rank() over (order by counts.count) as rank
    from counts
)
select c.customer_id, c.email, ranks.title, rental.rental_date from ranks
join inventory using(film_id)
join rental using(inventory_id)
join customer c on rental.customer_id = c.customer_id
where rank = 1;

// -- Solution
with rent_counts as
(
  select
     film_id,
     count(*),
     rank() over (order by count(*))
   from rental
     inner join inventory using (inventory_id)
   group by film_id
)
select distinct customer_id
from rental as r
  inner join inventory as i using (inventory_id)
where i.film_id in
  (select film_id
   from rent_counts
   where rank = 1);

-- 8.3 Write a query to return all the distinct film ratings without using the DISTINCT keyword
select rating from (
select
rating,
row_number() over (partition by rating order by film_id)
from film
    ) as t
where t.row_number = 1 and t.rating is not null;

-- 8.4 Write a query to show for each rental both the rental duration and also the average rental duration from the same customer

with durations(rental_duration, customer_id, rental_date) as (
    select
           (return_date - rental_date),
           customer_id,
           rental_date
from rental)
select rental_duration, customer_id, avg(rental_duration) over (partition by customer_id)
from durations;


-- 8.5 Write a query to calculate a running total of payments received, grouped by month
-- (ie. for each month show the total amount of money received that month and also the total amount of money received
-- up to and including that month)

with monthly_amounts as
(
  select
    date_trunc('month', payment_date) as month,
    sum(amount) as amount
  from payment
  group by month
)
select
  month,
  amount,
  sum(amount) over (order by month) as running_total
from monthly_amounts;

-- 8.6 Write a query to return the top 3 earning films in each rating category.
-- Include ties. To calculate the earnings for a film, multiply the rental rate for the film by the number of times it was rented out

with earnings(film_id, title, total) as (
    select
       film.film_id,
       film.title,
       sum(p.amount) as total
from film
join inventory i on film.film_id = i.film_id
join rental r on i.inventory_id = r.inventory_id
join payment p on r.rental_id = p.rental_id
group by 1), rank(title, total, rank, category) as (
    select earnings.title,
           earnings.total,
           rank() over (partition by film.rating order by total desc),
           film.rating
    from earnings
        join film using (film_id)
)
select * from rank
where rank <= 3;

-- SOLUTION
with film_incomes as
(
  select
    f.film_id,
    f.title,
    f.rating,
    f.rental_rate * count(*) as income
  from rental as r
    inner join inventory as i using (inventory_id)
    inner join film as f using (film_id)
  group by f.film_id
),
film_rankings as
(
  select
    film_id,
    title,
    rating,
    income,
    rank() over(partition by rating order by income desc)
  from film_incomes
  where rating is not null
)
select title, rating, income
from film_rankings
where rank <= 3
order by rating, rank;

-- second go 

with history as (select f.film_id, f.title, f.rating, (rental_rate * count(rental_id)) as total from rental
join inventory i on rental.inventory_id = i.inventory_id
join film f on i.film_id = f.film_id
group by f.film_id),
rank as (select *, rank() over (partition by rating order by total desc) as rank from history)
select * from rank where rank.rank <= 3;

-- 8.7 The rental table has 16,044 rows but the maximum rental ID is 16,049. This suggests that some rental IDs have been skipped over.
-- Write a query to find the missing rental IDs (you previously did this using the generate_series function.
-- Now do it using only window functions). Note you don't have to have your output formatted the same.

with lagging(rental_id, lagging_id) as (
        select rental_id,
        lag(rental_id) over (order by rental_id)
        from rental
)
select * from lagging
where (rental_id - lagging_id != 1)

with lags as (select
  rental_id,
  lag(rental_id) over (order by rental_id)
from rental)
select * from lags where lag is null or rental_id - lag != 1;

-- 8.8 Calculate for each customer the longest amount of time they've gone between renting a film

select * from rental;

-- My solution, inaccurate
with ordered_rentals(customer_id, return_date, row) as (
    select customer_id, return_date,
    row_number() over (partition by customer_id order by return_date desc)
    from rental
), ordered_lagging(customer_id, return_date, previous_date) as (
    select customer_id, return_date,
    lag(return_date) over (partition by customer_id order by return_date desc)
    from ordered_rentals
), differenced_lagging(customer_id, return_date, previous_date, difference) as (
    select customer_id, return_date, previous_date,
    (previous_date - return_date) as difference
    from ordered_lagging
    where previous_date is not null
), largest_difference as (
    select *,
           first_value(difference) over (partition by customer_id order by difference desc)
    from differenced_lagging
)
select * from largest_difference
where difference = first_value
group by customer_id;

-- Solution (jc)
with days_between as
(
  select customer_id, rental_date,
    lead(rental_date) over (partition by customer_id order by rental_date) - rental_date as diff
  from rental
)
select customer_id, max(diff) as "longest break"
from days_between
group by customer_id
order by customer_id;

Next try;
with times as (select
  customer_id,
  rental_date as current_rental,
  lag(rental_date) over (partition by customer_id order by rental_date desc) as next_rental
  from rental
)
select
  customer_id,
  max(next_rental - current_rental) over (partition by customer_id)
from times
where next_rental is not null;
```

### Working With Sets

Sets: Queries must return same number and data type of columns

For the most part, use parens to help on these

```
(...SQL) 
UNION 
(...OTHER_SQL)
```

Order / Group do not work on the result of a set, you have to wrap in a table subquery.

 - Union - All Unique Rows combined - put two sets together (a union b includes all in a and all in b) - Excluding Duplicates
 - Union All - All Rows combined - put two sets together (a union b includes all in a and all in b) - Keeping Duplicates
 - Intersect - find where both meet (a interesect b includes only those in a and b)
 - Intersect All - Return intersection where the rows in each result are the same
```
(select n from (values (1), (1), (3)) as v(n))
intersect
(select n from (values (1), (3), (4)) as v(n))
-- 1, 3

(select n from (values (1), (1), (3)) as v(n))
intersect
(select n from (values (1), (3), (4)) as v(n))
-- 1 (because the 1 only aligns in the first result row in both
``` 
 
 - Except - difference of two sets, order matters (a except b is the stuff that is in a that is NOT in b)
 - Except All - A 1 to 1 comparrison for the rows removing the ones that are the same
 
```
( select n from (values (1), (2), (3)) as v(n) )
except all
( select n from (values (1), (7), (8)) as v(n) )
-- 2, 3


( select n from (values (1), (1), (3)) as v(n) )
except all
( select n from (values (1), (7), (8)) as v(n) )
-- 1, 3


( select n from (values (1), (1), (1)) as v(n) )
except all
( select n from (values (1), (7), (8)) as v(n) )
-- 1, 1
``` 

#### Query Examples

--- 9.1 Write a query to list out all the distinct dates there was some sort of customer interaction (a rental or a payment) and order by output date

```
-- Mine
(select rental_date as interaction_date, customer_id  from rental)
UNION
(select payment_date as interaction_date, customer_id from payment)
order by 1;

-- Solution, notice the cast
(
  select cast(rental_date as date) as interaction_date
  from rental
)
union
(
  select cast(payment_date as date) as interaction_date
  from payment
)
order by interaction_date;
```

-- 9.2 Write a query to find the actors that are also customers (assuming same name = same person)

```
(select first_name, last_name from actor)
intersect
(select first_name, last_name from customer)
```


-- 9.3 Have the actors with IDs 49 (Anne Cronyn), 152 (Ben Harris), and 180 (Jeff Silverstone) ever appeared in any films together? Which ones?

```
select title from film where film_id in (select film_id from film_actor where actor_id = 49
intersect
select film_id from film_actor where actor_id = 152
intersect
select film_id from film_actor where actor_id = 180);
```

-- 9.4 The missing rental IDs problem that we've encountered several times now is the perfect place to use EXCEPT.
-- Write a query using the generate_series function and EXCEPT to find missing rental IDs (The rental table has 16,044
-- rows but the maximum rental ID is 16,049 - some IDs are missing)

```
-- mine
select * from generate_series(1, 16049)
except
select rental_id from rental;

-- solution, uses table to define bounds of generate series
(
  select t.id
  from generate_series(
    (select min(rental_id) from rental),
    (select max(rental_id) from rental)) as t(id)
)
except
(
  select rental_id
  from rental
);
```

-- 9.5 Write a query to list all the customers who have rented out a film on a Saturday but never on a Sunday. Order the customers by first name.

```
-- mine
(select distinct customer_id from rental where EXTRACT(ISODOW FROM rental_date) = 6)
except
(select distinct customer_id from rental where EXTRACT(ISODOW FROM rental_date) = 0)

-- solution, actually works
(
  select first_name, last_name
  from rental
    inner join customer using (customer_id)
  where date_part('isodow', rental_date) = 6
)
except
(
  select first_name, last_name
  from rental
    inner join customer using (customer_id)
  where date_part('isodow', rental_date) = 7
)
order by first_name;
```

-- 9.6 Write a query to list out all the distinct dates there was some sort of customer interaction (a rental or a
-- payment) and order by output date. Include only one row in the output for each type of interaction

```
-- mine
select distinct date from (
    select date_trunc('day', rental_date) from rental
    union
    select date_trunc('day', payment_date) from payment) as all_dates(date)
order by 1 asc;

-- solution, note: adds a column to results so you can identify the source
(
  select cast(rental_date as date) as interaction_date, 'rental' as type
  from rental
)
union
(
  select cast(payment_date as date) as interaction_date, 'payment' as type
  from payment
)
order by interaction_date;
```

-- 9.7 Write a query to return the countries in which there are both customers and staff. Use a CTE to help simplify your code.

```
-- mine
(select country_id, country from customer
join address using(address_id)
join city using(city_id)
join country using(country_id))
intersect
(select country_id, country from staff
join store using(store_id)
join address on store.address_id = address.address_id
join city using(city_id)
join country using(country_id));

-- Soluetion, note the use of a CTE to make this more managable

with address_country as
(
  select address_id, country
  from address
    inner join city using (city_id)
    inner join country using (country_id)
)
(
  select country
  from staff
    inner join address_country using (address_id)
)
intersect
(
  select country
  from customer
    inner join address_country using (address_id)
);
```

-- 9.8 Imagine you had two queries - let's call them A and B. 
-- Can you figure out how you would use set operators to return the rows in either A or B, but not both.

(A INTERSECT B)
EXCEPT
(A UNION B)

### Tables and Constraints

Faces of SQL 
 - DDL (Data Definition Language) - Create, Alter, Drop
 - DML (Date Manipulation) - Insert, Update, Delete Select
 - DCL (Data Control) - Grant Revoke
 - TCL (Transaction Control) - Begin, Commit, Rollback
 
Good Touchups
 - Create Table `IF NOT EXISTS`
 - Drop Schema x `cascade` -> cascade purges all nested

```

-- 10.1 In this and the following exercises in this chapter, we're going to be doing some lightweight database
-- modelling work for a fictional beach equipment rental business.
-- Your answers may deviate a little from mine as we go, and that's fine -
-- database design is a quite subjective topic.
-- To kick things off, we'll keep working with our existing database
-- but we want to create all our tables within a schema called 'beach'. Write a SQL statement to create the 'beach' schema.

create schema beach;

-- 10.2 Create a table to store customers.
-- For each customer we want to capture their first name, last name, email address, phone number, and the date the account was created.
-- Don't worry about primary keys and constraints for now - just focus on the create statement
-- and choosing what you think are appropriate data types for the listed attributes.

create table beach.customers (
    first_name varchar(100),
    last_name varchar(100),
    email_address varchar(100),
    phone_number varchar(20),
    created_at date
)

-- 10.3 Create a table to store details about the equipment to be rented out.
-- For each item, we want to store the type ('surf board', 'kayak', etc.),
-- a general ad-hoc description of the item (color, brand, condition, etc),
-- and replacement cost so we know what to charge customers if they lose the item.

create table beach.equipment (
    type varchar(100) not null,
    description text,
    cost_in_cents integer
)

-- 10.4 After running the business for a while, we notice that customers sometimes lose equipment.
-- Write a SQL statement to alter the equipment table (assume it already has data in it we don't want to lose)
-- to add a column to track whether the item is missing.

alter table beach.equipment
  add column is_missing boolean default true;
```

### Primary Keys

surrogate and natural primary keys
 - surrogate -> Something that is artificial that will identify uniquely.  For instance `id`
 - natural -> Something that is inherently unique, vin number for cars, SSN for people
 
Syntax for declaring this will vary, can add `primary` or actually name it with something like
  `constraint YOUR_NAME_FOR_THIS_PK primary key (column)`
  
Composite Primary Keys -> Multiple Columns act as PK
  
Two ways to create an incremented pk in "modern syntax"
 - column_name type GENERATED { ALWAYS | BY DEFAULT } as IDENTITY
 - always = do this all the time
 - by default = do this if one is not provided
 
```

-- 10.5 Add a surrogate primary key for the customers table using the GENERATED AS IDENTITY syntax
-- (we assume not all customers will provide an email address or phone number ruling
-- them out as potential natural keys). Note you may drop the schema/table and re-create it
-- from scratch.

create table beach.customers (
    id bigint generated always as identity primary key,
    first_name varchar(100),
    last_name varchar(100),
    email_address varchar(100),
    phone_number varchar(20),
    created_at date
)

-- 10.6 Add a surrogate primary key for the equipment table using one of the serial types.
-- Also add in to the table definition the 'missing' column from exercise 10.4.
-- Note you may drop the schema/table and re-create it from scratch.

alter table beach.equipment
  add column id bigint generated always as identity primary key;

-- 10.7 Create a new table to store information about each rental with an appropriate primary key.
-- For each rental, store the customer, the item that was rented, the rental date, and the return date.

create table beach.rentals (
  id bigint generated always as identity primary key,
  equipment_id bigint not null,
  customer_id bigint not null,
  rental_date timestamp not null,
  return_date timestamp
``` 
=======

### Working with Sets
 
- union - combine two groups together removing duplicates (names of actors, customers and people)
- union all - union but do not remove duplicates
- intersect - distinct values that are in both groups are returned
- intersect all - intersect but keep duplicates that align exactly in position of results

#### Union
Data types on all columns selected must be the same, names do not

###

#TODO - need to do constraints, intersect and except, may ar

## Create Table and Constraints

### Foreign Keys

Protect referential integrity in systems.  Ensure that you are not going to create bad or invalid data.

You can tell postgres to cascade the delete/update to prevent having to do a whole lot of ordered deletes by appending to the references

    user_email varchar(100) references playground.users (email)
      on update cascade
      on delete cascade

```
// Our setup
create schema playground;
create table if not exists playground.users (
    email varchar(100),
    first_name varchar(100),
    last_name varchar(100),
    is_active boolean,
    constraint pk_users primary key (email)
);

create table playground.notes (
    note_id bigint generated by default as identity primary key,
    note text,
    user_email varchar(100) references playground.users (email)
);

create table playground.note_tags (
    note_id bigint,
    tag varchar(20),
    primary key (note_id, tag),
    foreign key (note_id) references playground.notes (note_id)
);

// Insert a user into the system
insert into playground.users(email, first_name, last_name, is_active)
  values ('me@example.com', 'me', 'example', true);
```

#### Foreign key prevents inserting invalid data

Through inserts
```
insert into playground.notes(note, user_email)
  values ('foobarbar', 'someoneelse@example.com')

// Failes because of the database foreign key constraint that a exer_email references the users.email and there is no 'someoneelse@example.com'
 - user_email varchar(100) references playground.users (email)
```

Through updates
```
insert into playground.notes(note, user_email)
  values ('foobarbar', 'me@example.com');

update playground.notes
  set user_email = 'somethingelse@example.com'
  where user_email = 'me@example.com';
```

```
-- 10.8 Add appropriate foreign keys to the rentals table. Setup the foreign keys such that if the referenced customer or equipment is deleted,
-- the related entries in the rentals table will also be deleted. Note you may drop the schema/table and re-create it from scratch

alter table beach.rentals
 add foreign key (equipment_id) references beach.equipment (id) on delete cascade;

alter table beach.rentals
  add foreign key (customer_id) references beach.customers (id) on delete cascade;
```

### Check, Unique, Not Null 

These constraints do what they say
- Not null requires data
- Unique requires no duplicates
- Check will run the statement on save and fail if it doesn't pass

```
10.9 Add appropriate check, unique, not null, and default constraints to the customers table to capture the following requirements: a) A customer must provide both a first name and last name b) A customer must provide at least one contact detail - a phone number or email address c) The create date should be the date the new customer record is inserted in the table d) No two customers should have the same email address or phone number
create table beach.customers (
  customer_id bigint generated always as identity primary key,
  email text unique,
  first_name text not null,
  last_name text not null,
  phone text unique,
  create_date date not null default current_date,
  check (email is not null or phone is not null)
);

10.10 Add appropriate check, unique, not null, and default constraints to the equipment table to capture the following requirements: a) A newly added item should not be missing! b) Each item must have a type c) The replacement cost can be NULL. But if provided, it must be a positive number

You might be wondering about the check constraint for replacement_cost and why you didn't have to explicitly permit null. It's always important to keep in mind the '3 valued' logic employed by SQL where an expression can evaluate to true, false, or unknown. On inserting a replacement cost of NULL, the comparison "Is NULL >= 0" evaluates to unknown. Check constraints reject values that evaluate to false, but unknown is fair game. Which in this case, is exactly what we want.

create table beach.equipment (
  equipment_id bigserial primary key,
  item_type text not null,
  description text,
  replacement_cost numeric(7, 2) check (replacement_cost >= 0),
  missing boolean not null default false
);
```

## Transactions

 - errors in a transaction cause an aborted state, you have to rollback from to continue
 - commit; saves, rollback; takes back
 
CREATE TABLE public.actor (
    actor_id serial NOT NULL,
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    last_update timestamp NOT NULL DEFAULT now(),
    CONSTRAINT actor_pkey PRIMARY KEY (actor_id)
);

CREATE INDEX idx_actor_last_name on public.actor USING btree (last_name);

```
begin;

insert into actor(first_name, last_name)
values
 ('Keanu', 'Reeves'),
 ('Tom', 'Cruise'),
 ('Winona', 'Ryder');

select *
from actor
returning *; // returns the rows that were changed, useful in scripts to see values and such

rollback; || commit;
```

```
11.4 Write an insert statement to insert a new customer in to the customer table with any details of your choosing. 
Use the returning clause to return the inserted row. For this and all upcoming exercises, 
remember to do this inside a transaction block and rollback the change afterwards!

begin;

insert into public.customers(last_name)
values ("foo")
returning *;

rollback;
```

### Updating Data

You can update columns with a correlated subquery

// Sync values across tables
update payment
set payment_date = 
  (select rental_date 
   from rental
   where payment.rental_id = rental.rental_id);
   
// update the activebool for users
update customer
set activebool = true
where exists 
  (select *
   from rental
   where ental_date >= '2006-01-01'
     and rental.customer_id = customer.cutomer_id)
returning *;     

```   
-- 11.6 All customers should have an email address of the form [first_name].[last_name]@sakilacustomer.org 
   (all in lower case). Write an update statement so that all customers have an email address in this format.

// My solution
update beach.customers
set email =
    (select concat(b.first_name, '.', b.last_name, '@sakilacustomer.org'
     from beach.customers b
     where b.id = beach.customers.id)

// Their solution
update customer
set email = lower(first_name || '.' || last_name || '@sakilacustomer.org');
```


```

-- 11.7 Write an update statement to update the rental rate of the 20 most rented films by 10%

begin;

with top_titles as (
  select film.title as title, count(film.title) from film
  join inventory on inventory.film_id = film.film_id
  join rental on rental.inventory_id = inventory.inventory_id
  group by film.title
  order by count desc
  limit 20)

select rental_rate, title
from film
where title in (select title from top_titles);

update film
set rental_rate = (film.rental_rate * 1.1)
where film.title in (select title from top_titles);

select rental_rate, title
from film
where title in (select title from top_titles);

rollback;

-- their solution

update film
set rental_rate = rental_rate * 1.1
where film_id in
  (
    select
      i.film_id
    from rental as r
      inner join inventory as i using (inventory_id)
    group by i.film_id
    order by count(*) desc
    limit 20
  );
```

```
-- 11.8 Write a script to add a new column to the films table to hold the length of each film in hours (have a look at some of the examples for the ALTER TABLE command) and then populate this new column with the correct values

alter table film
add column length_in_hours smallint;

update film
set length_in_hours = round(film.length / 60);

-- their solution used a numeric to allow for 1.2 hours and similar

alter table film
  add column length_hrs numeric(2, 1);

update film
set length_hrs = length / 60.0
returning *;
```

#### Deleting

delete from and truncate are your main things here

```
-- 11.9 Delete all the payments where the payment amount was zero, returning the deleted rows
begin;

delete from payment
where amount = 0
returning *;

rollback;

-- 11.10 Delete all the unused languages from the language table

select * from language
where not exists (
    select * from film where film.language_id = language.language_id
    )
```

Exercises

```
-- 11.11 Write a single update statement to update the activebool column for customers to be true if they made a
-- rental in 2006 or later, and false otherwise.

update customer
set activebool = true
    where exists (
    select * from rental
    where rental.customer_id = customer.customer_id and rental_date >= date('2006-01-01'));

-- Solution, i missed the "and false" part

update customer
set activebool =
  case
    when exists
      (select *
       from rental
       where rental.customer_id = customer.customer_id
         and rental_date >= '2006-01-01')
       then true
    else false
  end;


-- 11.12 Create a new table, with appropriate primary keys and foreign keys, to hold the amount of inventory of each
-- film in each store (store_id, film_id, stock_count). In this table we want to store the stock level for every
-- film in every store - including films that aren't in stock. Write an "upsert" statement to populate the table
-- with the correct values. By "upsert", I mean insert a SQL statement that will either insert a new row in the
-- table (ie. a new film, store, stock count) or update the stock count if the film/store attempting to be inserted
-- already exists in the table). Research PostgreSQL's INSERT ON CONFLICT and look at the examples for some
-- guidance on how to do this.


create table stock
(
    stock_id serial,
    film_id integer references film (film_id) not null,
    store_id integer references store (store_id) not null,
    stock_count integer default 0 not null
);

create unique index idx_film_id_and_store_id on stock (store_id, film_id);

select * from stock;

with stock_values as (select film_id, store.store_id, 1 as stock_count from film
    join inventory using (film_id)
    cross join store)

insert into stock select * from stock_values
on conflict (store_id, film_id)
DO UPDATE SET stock_count = stock.stock_count + 1 where stock.store_id = EXCLUDED.store_id and stock.film_id = EXCLUDED.film_id;

-- Solution I missed the update 
insert into inventory_stats(store_id, film_id, stock_count)
  select s.store_id, f.film_id, count(i.inventory_id)
  from film as f
    cross join store as s
    left join inventory as i
      on f.film_id = i.film_id
      and s.store_id = i.store_id
  group by f.film_id, s.store_id
on conflict (store_id, film_id)
do update set
  stock_count = excluded.stock_count;


-- 11.13 Write a single statement to delete the first rental made by each customer and to avoid any foreign key
-- violations you'll also have to delete any associated payments in that same statement.
-- You might need to do some research online to figure this one out.
-- As a hint, you can use Common Table Expressions (CTEs) with delete statements and delete statements themselves can return results with the RETURNING clause!

with min_dates(time, customer_id) as (select min(rental_date), customer_id from rental
group by customer_id)

delete from payment where rental_id in (select rental_id from rental
 join min_dates on rental.customer_id = min_dates.customer_id and min_dates.time = rental.rental_date);

delete from rental where rental_id in (select rental_id from rental
 join min_dates on rental.customer_id = min_dates.customer_id and min_dates.time = rental.rental_date);


with deleted_rentals as
(
  delete from rental
  where rental_id in
    (select distinct on (customer_id) rental_id
     from rental
     order by customer_id, rental_date)
  returning rental_id
)
delete from payment
where rental_id in
  (select rental_id
   from deleted_rentals);

-- 11.14 In the films table the rating column is of type mpaa_rating, which is an ENUM.
-- You've read online about the downsides of ENUMs and now want to convert your table design to instead
-- store the different mpaa rating types in a reference table with the type as the primary key.
-- Write a script to create the new table, populate it with data, convert the film table,
-- and then drop the mpaa_rating type so it won't be used ever again. You're going to need to Google
-- a few ideas and look up some documentation to get through this one - good luck!

create table mpaa_film_rating(
    type varchar(8) primary key unique
)

insert into mpaa_film_rating (
    SELECT unnest(enum_range(NULL::mpaa_rating)) as ratings
)

alter table film add column mpaa_film_rating varchar(8);

insert into film (film_id, mpaa_film_rating)
select film_id, rating from film
ON DUPLICATE KEY(film_id) UPDATE mpaa_film_rating=excluded.mpaa_film_rating where excluded.film_id = film_id;

alter table film drop column rating;

alter table film add foreign key (
    mpaa_film_rating ) references mpaa_film_rating.type;


--- Solution

create table mpaa_ratings
(
  rating text primary key
);

insert into mpaa_ratings
  select unnest(enum_range(null::mpaa_rating));

alter table film
  alter column rating drop default,
  alter column rating type text,
  alter column rating set default 'G',
  add foreign key (rating) references mpaa_ratings(rating);

drop type mpaa_rating;
```

### Views/Functions

Database View: Virtual Table, holds queries you do over and over.  For instance, an address spread over multiple tables
 - Creating a view doesn't run the query, just saves it for later   
 - You can join, query and whatever as is if the view is a regular table
 - Can use this for security purposes, limit the fields certain db users can read as a dba
 
Materialized View:
 - like view but it stores/caches the values
 - 'create materialized view'
 - refreshed with a 'refresh materialized view' call

Functions:

There are several built in types of aggregate and functions.  Postgres has a rich ability to 

```
Views: 

-- 12.1 We often need to get basic film information for a rental and so regularly find ourselves writing queries
-- to join from the rental table on to the inventory and film tables. Write a view called vw_rental_film to make
-- this more convenient, returning for each rental ID the film's title, length, and rating.
-- Then write a query to return all the rows from this view to check it's working as expected.

create view vw_rental_film as
select customer_id, inventory_id, f.film_id, rental_id, f.title, f.rating, f.length, rental_date, return_date from rental r
  join inventory using (inventory_id)
  join film f on inventory.film_id = f.film_id;

-- Solution

create view vw_rental_film as
  select
    r.rental_id,
    f.title,
    f.length,
    f.rating
  from rental as r
    inner join inventory as i using (inventory_id)
    inner join film as f using (film_id)
  order by r.rental_id;

-- 12.2 Use the vw_rental_film view you just created to return, for each customer, the number of 'R' films they've rented out.
-- Include customers who haven't rented any R films also. Note - this is trickier than it first appears...be very careful and double-check your results!

with ratings(customer_id, rating, count) as (
  select customer.customer_id, rating, count(rating) from customer
  left outer join vw_rental_film vrf on customer.customer_id = vrf.customer_id
  group by 1, rating
  having rating = 'R'
  order by 1)

select customer_id,
       case count
         when count then count
         else 0
       end as count
  from customer
  left outer join ratings using(customer_id)
  where customer_id > 0;

-- Solution

select
  c.customer_id,
  count(r.rental_id)
from customer as c
  left join (rental as r
               inner join vw_rental_film as rf
                 on r.rental_id = rf.rental_id
                 and rf.rating = 'R')
    using (customer_id)
group by c.customer_id
order by c.customer_id;


-- 12.3 Create a view called vw_monthly_totals that returns the amount of income received each
-- month (you've done this a couple of times in this course now - time to finally save this
-- in a view to avoid the repetition!)

create view vm_monthly_totals as
with summed_months as (select date_trunc('month', rental.rental_date) as month, sum(rental_rate) as total from rental
  join inventory i on rental.inventory_id = i.inventory_id
  join film f on i.film_id = f.film_id
  group by 1
  order by 1),
  months as (select * from generate_series('2005-01-01'::timestamp, '2006-03-01'::timestamp, '1 month') as month)
select months.month,
       case total
       when total then total
       else 0
       end as total
    from months
    left outer join summed_months on summed_months.month = months.month;

-- solutions

-- 12.4 Using the new vw_monthly_totals view and window functions (remember how those work?
-- If not, here's your chance to refresh!), write a query that returns the amount of income
-- received each month and compares it against the previous month's income, showing the change.

with totals as (select month, total,
    coalesce(lag(total) over (order by month desc), 0) as previous
    from vm_monthly_totals)

select month, total - previous as difference from totals;

-- solution

select
  month,
  total as income,
  lag(total) over (order by month) as "prev month income",
  total - lag(total) over (order by month) as "change"
from vw_monthly_totals;

-- 12.5 Continuing on from Exercise 1, you now have a view called vw_rental_film.
-- You create a new materialized view called mvw_rental_film defined as below.
-- Imagine a period of time has now passed and the materialized view's cache is out of date.
-- Write a query which will output the difference between the original view and the materialized view
-- (essentially this boils down to writing a query to show the difference between two sets of results).
-- Within a test transaction block you can roll back, make some insertions and deletions to test your query works as expected.

create materialized view mvw_rental_film
as select * from vw_rental_film;

select * from mvw_rental_film
except
select * from vw_rental_film;

-- Solution

First minus the second + second minus the first

(
  select * from vw_rental_film
  except
  select * from mvw_rental_film
)
union all
(
  select * from mvw_rental_film
  except
  select * from vw_rental_film
);
```

### Performance

Explain -> Returns query plan
Explain Analyze -> Returns query plan and returns times that it took

The query plan uses table statistics to estimate what the plan will be

#### Query Plan Node Types

Seq Scan -> Goes through the whole table
 - Start Cost for this is 0, it goes through the entire table
Parallel Seq Scan -> Seq Scan with 2+ threads 
Index Scan -> Uses the index on A column
 - Goes in and finds the record, loads the record
Index Only Scan -> Uses Only Indexes on the tables  
Bitmap Heap Scan -> 
 - Fetches all indexes from disk at once and sorts and puts them in contiguous memory for easy access

Join
Nested Loop -> Good for small tables, for each table loop through one, then the other, think standard for loop with i and j.  Good for small tables
Merge Join -> Good for medium tables, first sorts each table, then puts together where they match
Has Join -> Good for large tables, Build hash table of one table, then uses that has to lookup.  Postgres will limit this based on working memory config

```
-- Setup a test table for our purposes
create schema test;

create table test.messages (
    id int,
    account_id int,
    msg text
);

insert into test.messages(id, account_id, msg)
  select id,
         random() * 100000,
         substring('hello are you there', (random() * 20)::int, 5)
  from generate_series(1, 10000000) as s(id);

-- after initializing or updating a table with large data this
-- updates the table statistics
vacuum analyze test.messages;

select * from test.messages limit 100;

explain analyze
select id, msg
from test.messages
where id = 33;

-- Parallel Seq Scan, super slow

create index on test.messages(id)

explain analyze
select id, msg
from test.messages
where id = 33;

-- index scan, much faster

create index on test.messages(id, msg)

explain analyze
select id, msg
from test.messages
where id = 33;

-- index ONLY scan, doesn't hit sequential at all
``` 
 
#### Optimizing Query Plan
 - First write for readability
 - Use joins over Subqueries 
 - Missing Indexes
 - Use a different index (GIN, BRIN)
 - Partial Index, only index what you are needing (where active = 1)
 - CTEs can act as an 'optimization fence' in psql

Specific
 - Instead of using in, try to turn it into a join
 - Instead of using not in, try using left join or not exists (see below)
 - Use filter instead of CASE
 - Limit subquery overuse
  
```
Examples of different approaches affecting query plan

-- Delete to simulate finding missing
delete
from test.messages
where id in (67, 66, 1002, 5876, 708484);

-- 1 correlated subquery
explain analyze
select s.id
from generate_series(
    (select min(id) from test.messages),
    (select max(id) from test.messages)) as s(id)
where not exists
(select *
from test.messages as m
where m.id = s.id);

-- 2 CTE and Window (misses duplicate)
with t as
(
    select
    id as current,
    lead(id) over (order by id) as next
    from test.messages
)
select
  current + 1 as missing_from,
  current - 1 as missing_to
from t
where next - current > 1;

-- Set Operator
explain analyze
select s.id
from generate_series(
    (select min(id) from test.messages),
    (select max(id) from test.messages)) as s(id)
except
(
  select id from test.messages
)
```

```
-- where not exists vs not in
explain analyze
select film_id, title
from film as f
-- With not in
where film_id not in 
(select film_id from film_actor);
-- With not exists
where not exists
(select * from film_actor where film_id = f.film_id);
-- with join
left join film_actor as fa using (film_id)
where fa.film_id is null
```