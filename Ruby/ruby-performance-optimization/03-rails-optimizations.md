### 03. Make Rails Faster
- Aggressively preload, select attributes when you can, process in batches
- Replace explicit iterators in view with render collection
- Let your database server do data manipulation fo ryou

##### Load only attributes you need
When pulling a large amount of items from database, you can dramatically reduce the amount of memory and speed by selecting the items you need from your queries. 

For instance
||Query|
|||
|Bad|`Thing.all.each { |thing| think.minions.load }`|500+MB|
|Better|`Thing.includes(:minions).all.each{ |t| t.minions.load }` ||
|Even Better|Thing.find_by_sql("SELECT x...") || Thing.pluck |8MB|

##### Use each!
Using `each_with_index` will load everything into memory.  Use `find_in_batches` and `find_each` 

##### ActionView
Rendering partials in ActionView is actually quite expensive.  If you do that inside of a collection it will have to load/render each time.  The load can be avoided by rendering a collection.

```
# instantitates and loads new view object for partial on each iteration
<% @things.each do |thing| %>
  <%= render partial: 'thing', object: thing %>
<% end %>

# VS
# instantiates and reuses view partial object for entire collection
<%= render partial: 'thing', collection: @things%>
```
