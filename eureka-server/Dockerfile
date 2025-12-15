FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY eureka-server/pom.xml .
COPY eureka-server/src ./src
# Skip compiling/running tests inside the Docker build to avoid needing test dependencies
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]

