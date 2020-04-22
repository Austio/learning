package weather.analyzer.consumers

import java.time.Duration
import java.util
import java.util.Properties

import org.apache.kafka.clients.consumer._
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.common.errors.WakeupException

import scala.collection.JavaConverters._
import scala.concurrent.{Future, blocking}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.io.StdIn

case class WeatherData(location: String, epoch: Long, temperature: Int)

object WeatherAnalyzer{
/*
 * Usage
 * scala -classpath ReproducibleWeatherProducer-0.1.jar weather.analyzer.consumers.WeatherAnalyzer SERVERS GROUPID
 * SERVERS is a comma delimited list of servers in the format of [ServerAddress]:[Port] ~ Default = localhost:9092
 * GROUPID is a single string value ~ Default = "weather-consumer"
 */
  def main(args: Array[String]) {
    val props = new Properties()
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, args.lift(0).getOrElse("localhost:9092"))
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
      "org.apache.kafka.common.serialization.StringDeserializer")
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
      "org.apache.kafka.common.serialization.StringDeserializer")
    props.put(ConsumerConfig.GROUP_ID_CONFIG, args.lift(1).getOrElse("weather-consumer"))

    val consumer = new KafkaConsumer[String, String](props)
    try {
      setupShutdown(consumer)
      val topic = "weather"
      consumer.subscribe(Seq(topic).asJava, //OR java.util.regex.Pattern
        new ConsumerRebalanceListener {
          override def onPartitionsRevoked(partitions: util.Collection[TopicPartition]) = {
            println("Lost the following partitions: ")
            partitions.asScala.foreach(println)
          }
          override def onPartitionsAssigned(partitions: util.Collection[TopicPartition]) = {
            println("Gained the following partitions: ")
            partitions.asScala.foreach(println)
          }
        }
      )
      while(true){
        val timeToWaitForData = Duration.ofSeconds(1)
        val weatherRecords: ConsumerRecords[String, String] = consumer.poll(timeToWaitForData)
        weatherRecords.asScala
          .map(weatherRecord => convertToWeatherDataFrom(weatherRecord))
          .groupBy(weatherData => weatherData.location)
          .foreach{ case (location, weatherList) => {
            val dateSortedWeatherList = weatherList.toSeq.sortBy(weatherData => weatherData.epoch)
            dateSortedWeatherList
              .sliding(5,5)
              .foreach((weatherChunk: Seq[WeatherData]) => {
                printWhetherAscendingOrDescending(weatherChunk)
                println(s"Processed weather chunk containing '$weatherChunk'")
              })
          }}
        Thread.sleep(5000)
      }
    } catch {
      case _ : WakeupException => //Ignore
    } finally {
      consumer.close()
      println("Shutting Down")
    }
  }

  private def convertToWeatherDataFrom(weatherRecord: ConsumerRecord[String, String]) = {
      val weatherValues = weatherRecord.value.split(',')
      val location = weatherRecord.key.split('_')(1)
      WeatherData(location, epoch = weatherValues(0).toLong, temperature = weatherValues(1).toInt)
  }

  private def isAscending(temperatures: Seq[Int]): Boolean = {
    temperatures.sliding(2).forall{
      case Seq() => true
      case Seq(_) => true
      case Seq(first,second) => first <= second
    }
  }

  private def isDescending(temperatures: Seq[Int]): Boolean = {
    temperatures.sliding(2).forall{
      case Seq() => true
      case Seq(_) => true
      case Seq(first, second) => first >= second
    }
  }

  private def printWhetherAscendingOrDescending(weatherDatas: Seq[WeatherData]) = {
    val temperatures = weatherDatas.map(weatherData => weatherData.temperature)
    val location = weatherDatas.head.location
    if(isAscending(temperatures)) println(s"Temperatures in $location are on the rise.")
    else if(isDescending(temperatures)) println(s"It's getting colder in $location.")
    else println(s"Temperatures are stagnating in $location.")
  }

  private def setupShutdown(consumer: KafkaConsumer[_, _]) = {
    val mainThread = Thread.currentThread
    Runtime.getRuntime.addShutdownHook(new Thread {
      override def run(): Unit = {
        consumer.wakeup
        try {
          mainThread.join
        } catch {
          case ex: Throwable => println(s"Exception caught waiting for main thread to complete: $ex")
        }
      }
    })
    Future {
      blocking {
        if (StdIn.readLine(">>>Press [ENTER] to shut the consumer down\n") != null) {
          consumer.wakeup
          System.exit(0)
        }
      }
    }
  }
}

