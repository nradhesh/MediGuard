FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy common-utils first and build it
COPY common-utils/pom.xml common-utils/pom.xml
COPY common-utils/src common-utils/src
RUN cd common-utils && mvn clean install -DskipTests -Dmaven.test.skip=true

# Copy service pom and source
COPY prescription-service/pom.xml .
COPY prescription-service/src ./src
# Skip tests during Docker build
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 9003
ENTRYPOINT ["java", "-jar", "app.jar"]

