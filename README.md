<img src="src/main/frontend/public/boot-logo.png" height="120px"><img style="margin-bottom: 20px" src="src/main/frontend/public/plus.png" height="80px"><img src="src/main/frontend/public/ng-logo.png" height="120px">
# Spring Boot and Angular 2 starter app

> Starter webapp using Spring Boot on the backend and Angular 2 on the frontend, with 
Maven and Angular CLI as build tools and with hot reloading on both sides.

## Quickstart
Run the app:

    git clone https://github.com/dlizarra/spring-angular2-cli-starter.git
    cd spring-angular2-cli-starter
    mvn spring-boot:run

The app will be available at `http://localhost:8080`. 

There's also a sample REST endpoint at [/users](http://localhost:8080/users), the H2 console at [/h2-console](http://localhost:8080/h2-console) and all the endpoints exposed by [Spring Boot Actuator](http://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html) ([/health](http://localhost:8080/health), [/beans](http://localhost:8080/beans), etc.)


## Start developing
The Java code is available at `src/main/java` as usual, and the frontend source files are in 
`src/main/frontend`.

### Running the backend
Run `StarterMain` class from your IDE.

### Running the frontend
Go to `src/main/frontend` and run `ng serve`.

Now we should work with `http://localhost:4200` since this is where the Livereload server will serve the content. All the requests will be proxied to the Spring Boot backend at `http://localhost:8080`.

We can change the proxy url in the [.ember-cli](src/main/frontend/.ember-cli) file.

### How the build process works
There are only  configuration files involved:

- [package.json](src/main/frontend/package.json) where we have a "build" script that runs `ng build`.
- [pom.xml](pom.xml#L139) in which we configure the frontend-maven-plugin to run this "build" script during the `generate-sources` phase.
- The [.ember-cli](src/main/frontend/.ember-cli) file where we specify the output directory for the compiled frontend files, which is `src/main/resources/static`.


When we run `mvn spring-boot:run` the frontend source files will be compiled and left at `src/main/resources/static` which is one of the default locations that Spring Boot specifies for static content (the others are /META-INF/resources, /resources and /public), so it will take those files and move them to `target/classes/static`.


### Hot reloading
In the **backend** we make use of Spring DevTools to enable hot reloading, 
so every time we make a change in our files an application restart will
be triggered automatically.

Keep in mind that Spring DevTools automatic restart only works if we run the 
application by running the main method in our app, and not if for example we run 
the app with maven with `mvn spring-boot:run`.

In the **frontend** when we run `ng serve` Angular CLI starts an Ember Livereload server that will watch for any change in our frontend files.

### Profiles

The project comes prepared for being used in three different environments plus 
another one for testing. We use Spring Profiles in combination with Boot feature for 
loading properties files by naming convention (application-*\<profile name\>*.properties).

You can find the profile constants in 
[StarterProfiles](src/main/java/com/dlizarra/starter/StarterProfiles.java) 
and the properties files in `src/main/resources`.

### Database
The database connections are configured in 
[DatabaseConfig](src/main/java/com/dlizarra/starter/DatabaseConfig.java)
where we can find a working H2 embedded database connection for the default profile, and the staging and production configurations examples for working with an external database.

Instead of the default JDBC Tomcat connection pool we added a faster [Hikari CP](https://github.com/brettwooldridge/HikariCP) one.

### Repository layer
The project includes three base data repositories:

- [ReadOnlyRepository](src/main/java/com/dlizarra/starter/support/jpa/ReadOnlyRepository.java): We can use this base repository when we want to make sure the application doesn't insert or update that type of entity, as it just exposes a set of methods to read entities.
- [CustomCrudRepository](src/main/java/com/dlizarra/starter/support/jpa/CustomCrudRepository.java): It's the same as the `CrudRepository` that Spring Data provides, but the `findOne`method in the custom version returns a Java 8 `Optional<T>` object instead of `<T>`. It's just a small difference but it avoids having to override the `findOne` method in every repository to make it return an `Optional` object. This repository is intended to be used when we don't need paging or sorting capabilities for that entity.
- [CustomJpaRepository](src/main/java/com/dlizarra/starter/support/jpa/CustomJpaRepository.java): Again, it's there to provide the same funcionality as the Spring `JpaRepository` but returning `Optional<T>`. We can extend this base repository if we want CRUD operations plus paging and sorting capabilities.

### Security
All the boilerplate for the initial Spring Security configuration is already created. These are they key classes:

- [User](src/main/java/com/dlizarra/starter/user/User.java), [Role](src/main/java/com/dlizarra/starter/role/Role.java) and  [RoleName](src/main/java/com/dlizarra/starter/role/RoleName.java) which are populated by [data.sql](src/main/resources/data.sql) file for the default profile only.
- [CustomUserDetails](src/main/java/com/dlizarra/starter/support/security/CustomUserDetails.java)
- [CustomUserDetailsService](src/main/java/com/dlizarra/starter/support/security/CustomUserDetailsService.java)
- [SecurityConfig](src/main/java/com/dlizarra/starter/SecurityConfig.java) with just very basic security rules.

### DTO-Entity mapping
The project includes Orika and it already has a class, [OrikaBeanMapper](src/main/java/com/dlizarra/starter/support/orika/OrikaBeanMapper.java), ready to be injected anywhere and be used to do any mapping. It will also scan the project on startup searching for custom mappers and components.

You can see how to use it in [UserServiceImpl](src/main/java/com/dlizarra/starter/user/UserServiceImpl.java) or in this sample [project](https://github.com/dlizarra/orika-spring-integration).

This, along with Lombok annotations for auto-generating getters, setters, toString methods and such, allows us to have much cleaner Entities and DTOs classes.

### Unit and integration testing
For **unit testing** we included Spring Test, JUnit, Mockito and AssertJ as well as an [AbstractUnitTest](src/test/java/com/dlizarra/starter/support/AbstractUnitTest.java) class that we can extend to include the boilerplate annotations and configuration for every test. [UserServiceTest](src/test/java/com/dlizarra/starter/user/UserServiceTest.java) can serve as an example.

To create integration tests we can extend [AbstractIntegrationTest](src/test/java/com/dlizarra/starter/support/AbstractIntegrationTest.java) and make use of Spring `@sql` annotation to run a databse script before every test, just like it's done in [UserRepositoryTest](src/test/java/com/dlizarra/starter/user/UserRepositoryTest.java).

### Code coverage
The project is also ready to use Cobertura as a code coverage utility and Coveralls to show a nice graphical representation of the results, get a badge with the results, etc. 

The only thing you need to do is to create an account in [Coveralls.io](http://coveralls.io) and add your repo token key [here](pom.xml#L134) in the pom.xml.

And if you want to use different tools you just need to remove the plugins from the pom.


### Continuous integration and deployment
A [travis.yml](.travis.yml) file is included with a minimal configuration just to use jdk 8, trigger the code analysis tool and deploy the app to Heroku using the `api_key` in the file. 

We also included a Heroku [Procfile](Procfile) which declares the `web` process type and the java command to run our app and specifies which Spring Profile we want to use.



## Tech stack and libraries
### Backend
- [Spring Boot](http://projects.spring.io/spring-boot/)
- [Spring MVC](http://docs.spring.io/autorepo/docs/spring/3.2.x/spring-framework-reference/html/mvc.html)
- [Spring Data](http://projects.spring.io/spring-data/)
- [Spring Security](http://projects.spring.io/spring-security/)
- [Spring Test](http://docs.spring.io/autorepo/docs/spring-framework/3.2.x/spring-framework-reference/html/testing.html)
- [JUnit](http://junit.org/)
- [Mockito](http://mockito.org/)
- [AssertJ](http://joel-costigliola.github.io/assertj/)
- [Lombok](https://projectlombok.org/)
- [Orika](http://orika-mapper.github.io/orika-docs/)
- [Maven](https://maven.apache.org/)

### Frontend
- [Angular 2](https://angular.io/)
- [Angular CLI](https://cli.angular.io/)
- [Moment.js](http://momentjs.com/)


---
