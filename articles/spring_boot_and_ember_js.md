# [ 0|Dev ] : Spring Boot And EmberJS (+ TDD)

## Intro:
In this write up we will focus on Spring + EmberJS (w/ TDD) while referencing the resources linked below.
Keeping with the `0|Dev` theme, we will start without assumptions and walk through getting up and running from a new machine.
:-)

## Getting Started

### Editor
[IntelliJ IDEA - Ultimate (Free trial)](https://www.jetbrains.com/idea/download/)


## start.spring.io
start.spring.io is powered by Spring Initializr and Pivotal Web Services and one easy way to get up and going with your spring boot application.

We will be referencing this tutorial:
> [Let’s make friends with Spring and EmberJS – part 1 ](http://nortpoint.io/2016/10/13/lets-make-friends-with-spring-and-emberjs/)

Instead of getting started with the mvn command, lets use the spring initializr.

![spring_INITIALIZR](../../images/spring_initializr.png)



```pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
  <dependency>
    <groupId>com.jayway.restassured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>2.8.0</version>
    <scope>test</scope>
  </dependency>
```

```
com.joshuamccall.StartApplication.SprimberjBackendApplication

@RestController
@RequestMapping("/customers")
public class CustomerController {
    private final CustomersFakeRepository customersFakeRepository;

    @Autowired
    public CustomerController(CustomersFakeRepository customersFakeRepository) {
        this.customersFakeRepository = customersFakeRepository;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    Customer getCustomer(@PathVariable("id") Integer id){
        return customersFakeRepository.findById(id);
    }
}

```
```
com.joshuamccall.StartApplication.SprimberjBackendApplicationTests

@Test
public void customers() {
  get("/customers/1").then().assertThat().body(equalTo("hello"));
}
```







### Ember.js support for JetBrains IDEs (IntelliJ, WebStorm, ...)
[Ember.js support for JetBrains IDEs (IntelliJ, WebStorm, ...)](https://github.com/Turbo87/intellij-emberjs)

## Recap

## Resources and further reading:
- [Let’s make friends with Spring and EmberJS – part 1 ](http://nortpoint.io/2016/10/13/lets-make-friends-with-spring-and-emberjs/)
- [Let’s make friends with Spring and EmberJS – part 2](http://nortpoint.io/2016/10/17/lets-make-friends-with-spring-and-emberjs-part-2/)
- [Ember Super Rentals Tutorial](https://guides.emberjs.com/v2.16.0/tutorial/ember-cli/)
- [Spring Boot: REST + TDD from scratch](https://hackernoon.com/spring-boot-rest-tdd-from-scratch-15f13ed799e0)
- YouTube Playlist:
  - [Spring Boot Tutorial For Beginners](https://www.youtube.com/playlist?list=PLz5rnvLVJX5WlI-LrwZnVSCcXq21bbk6K)
  - [Complete Core Java Programming Course Beginners to Advance ](https://www.youtube.com/watch?v=R08YRplsYGw)
- [Pluralsight: Creating Your First Spring Boot Application](https://www.pluralsight.com/courses/spring-boot-first-application)


