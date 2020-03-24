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

#### Common Table Expressions

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

-- 8.8 Calculate for each customer the longest amount of time they've gone between renting a film

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
```