git clone git@github.com:confluentinc/common.git
cd common
git checkout v5.1.0
mvn install -DskipTests
cd ..
git clone git@github.com:confluentinc/rest-utils.git
cd rest-utils
git checkout v5.1.0
mvn install -DskipTests
cd ..
git clone git@github.com:confluentinc/schema-registry.git
cd schema-registry
git checkout v5.1.0
mvn package -DskipTests
cd package-schema-registry\target\kafka-schema-registry-package-5.1.0-package
# copy share from development target and windows bat scripts from root bin
bin\windows\schema-registry-start etc\schema-registry\schema-registry.properties
