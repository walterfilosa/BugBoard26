package org.bugboard.backend.security;

import lombok.*;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLogin {
    private String email;
    private String password;
}
