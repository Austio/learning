[Kafka Basics Tutorial](https://kafka-tutorials.confluent.io/kafka-console-consumer-producer-basics/kafka.html)

### Consumer / Producer example
Before Each:
 - docker-compose exec broker bash

#### Create a Topic
 - Topics will listen to messages
 - kafka-topics --create --topic example-topic --bootstrap-server broker:9092 --replication-factor 1 --partitions 1

#### Create a Consumer
 - This consumer will print out anything as it comes through the topic
 - kafka-console-consumer --topic example-topic --bootstrap-server broker:9092 

#### Create a Message with the Console Producer
 - kafka-console-producer --topic example-topic --broker-list broker:9092
 - This will open a console where you can type several messages like
 - the
 - brown
 - cow
 - jumped over the lazy fox
 
 CTL+C to exit the Producer of messages
 
#### Consume from beginning

Now consumer from the beginning, produce the following messages
 - close your consumer
 - produce the following message "FooBarBaz"
  - kafka-console-producer --topic example-topic --broker-list broker:9092 
  - enter: FooBarBaz
 - Create a new consumer with the `--from-beginning` options
  - kafka-console-consumer --topic example-topic --bootstrap-server broker:9092  --from-beginning
 
Now you should see it print out all the previous messages!
  
### Produce with Key Value Paris

Kafka produces key value pairs above with a key of 'null'.  You can produce with key/value by adjusting your commands

#### Start a Key/Value producer
kafka-console-producer --topic example-topic --broker-list broker:9092\
  --property parse.key=true\
  --property key.separator=":"
 
Create keys like `foo:bar` `biz:baz`

Then create a consumer with key value pairs
kafka-console-consumer --topic example-topic --bootstrap-server broker:9092 \
 --from-beginning \
 --property print.key=true \
 --property key.separator="-" 

```
 foo-bar
 biz-baz
```



T