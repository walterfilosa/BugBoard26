package org.bugboard.backend.model;

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
