name := "WeatherProducer"

val kafkaVersion = "2.1.0"

lazy val commonSettings = Seq(
  version := "0.1",
  scalaVersion := "2.12.7",
  resolvers ++= Seq(
    Resolver.sonatypeRepo("public"),
    "confluent" at "http://packages.confluent.io/maven/"
  ),
  libraryDependencies ++= Seq(
    "org.apache.kafka" %% "kafka" % kafkaVersion,
    "org.apache.avro" % "avro" % "1.8.1",
    "io.confluent" % "kafka-avro-serializer" % "5.1.0"
  )
)

lazy val producers = (project in file("producers"))
  .settings(
    commonSettings,
    assemblyJarName in assembly := s"${name.value.replace(' ','-')}-${version.value}.jar",
    assemblyOption in assembly := (assemblyOption in assembly).value.copy(includeScala = false)	
  )

lazy val consumers = (project in file("consumers"))
  .settings(
    commonSettings,
    assemblyJarName in assembly := s"${name.value.replace(' ','-')}-${version.value}.jar",
    assemblyOption in assembly := (assemblyOption in assembly).value.copy(includeScala = false)
  )

