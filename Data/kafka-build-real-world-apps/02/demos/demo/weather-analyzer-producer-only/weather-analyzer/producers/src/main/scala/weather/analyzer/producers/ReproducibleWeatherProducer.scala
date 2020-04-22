package weather.analyzer.producers

import java.time._
import java.util.Properties
import java.util.concurrent.Future

import scala.collection.immutable.ListMap
import org.apache.kafka.clients.producer._

object ReproducibleWeatherProducer{
  val locationMappedToTempInFRanges = ListMap(
		"Pittsburgh-PA-US" -> (65 to 95),
		"San Francisco-CA-US" -> (50 to 80),
		"Sydney-NSW-AU" -> (45 to 75),
		"Mumbai-NH-IN" -> (70 to 100),
		"London-UK-GB" -> (45 to 75))
  val locationHourOffset = Seq(0, -3, 14, 9, 6)
  val weatherTypes = Seq("Sunny", "Cloudy", "Fog", "Rain", "Lightning", "Windy")
  val humidities = 30 to 100
  val windSpeedInMPHs = 0 to 20

  val startingDateTime = ZonedDateTime.of(2018, 6, 1,
    0, 0, 0, 0, ZoneId.of("America/New_York"))


	/*
	 * Usage
	 * scala -classpath producers-0.1.jar weather.analyzer.producers.ReproducibleWeatherProducer SERVERS
	 * SERVERS is a comma delimited list of servers in the format of [ServerAddress]:[Port] ~ Default = localhost:9092
	 */
  def main(args: Array[String]) {
    val props = new Properties()
    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, args.lift(0).getOrElse("localhost:9092"))
    props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer")
    props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer")

    val producer = new KafkaProducer[String, String](props)

		try {
			println(">>>Press [ENTER] to shut the producer down")
			val topic = "weather"
			var currentGeneration = 0
			var currentDateTime = startingDateTime
			while (System.in.available == 0) {
				val delayUntilNextSend = 1000 //1 second
				Thread.sleep(delayUntilNextSend)
				val currentWeatherStrings = generateWeatherStringsFor(currentGeneration, currentDateTime)
				currentWeatherStrings.foreach(
					currentWeatherString => {
						val (location, weatherData) = currentWeatherString
						val weatherRecord =
							new ProducerRecord(topic, s"ReproducibleWeatherSource_$location", weatherData)
						val resultFuture: Future[RecordMetadata] = producer.send(weatherRecord, new Callback {
							override def onCompletion(metadata: RecordMetadata, exception: Exception) = {
								if (exception != null) {
                  println(s"Metadata is '$metadata' for error encountered when sending weather record: $exception")
                }
							}
						})
						val metadataResult: RecordMetadata = resultFuture.get
						println(s"Blocking until completion yields the same Metadata of $metadataResult")
					}
				)
				currentWeatherStrings.foreach(println)
				currentGeneration = currentGeneration + 1
				currentDateTime = currentDateTime.plusHours(1)
			}
		} finally {
			producer.close()
		}
  }

  def generateWeatherStringsFor(currentGeneration: Int,
																currentDateTime: ZonedDateTime): Iterable[(String, String)] = {
  	for(
      (locationMappedToTempInFRanges1, index) <- locationMappedToTempInFRanges.zipWithIndex
  	) yield {
      val (location, tempsInF) = locationMappedToTempInFRanges1
  	  val currentDay = currentGeneration / 24
  	  val baseCurrentHour = Math.floorMod(currentGeneration + locationHourOffset(index), 24) 
  	  val currentTempIndex =
				((if(baseCurrentHour > 12) 12 - (baseCurrentHour % 12) else baseCurrentHour) + currentDay) % tempsInF.size
			val tempInF = tempsInF(currentTempIndex)
			val weather = weatherTypes((currentDay + index) % weatherTypes.size)
  	  val humidity = (currentDay + baseCurrentHour + index) % humidities.size
			val windSpeedInMPH = windSpeedInMPHs((currentDay + (baseCurrentHour / 12) + index) % windSpeedInMPHs.size)

  	  (location, s"${currentDateTime.toEpochSecond},$tempInF,$weather,$humidity,$windSpeedInMPH")

  	}
  }
}



