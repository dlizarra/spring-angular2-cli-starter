package com.dlizarra.starter.support;

import com.dlizarra.starter.AppConfig;
import com.dlizarra.starter.DatabaseConfig;
import com.dlizarra.starter.SecurityConfig;
import com.dlizarra.starter.StarterProfiles;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = { AppConfig.class, DatabaseConfig.class, SecurityConfig.class })
@ActiveProfiles(StarterProfiles.TEST)
public abstract class AbstractWebIntegrationTest {

}
