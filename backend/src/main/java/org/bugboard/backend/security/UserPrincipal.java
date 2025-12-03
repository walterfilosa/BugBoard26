package org.bugboard.backend.security;

import org.bugboard.backend.model.Utente;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final transient Utente user;

    public UserPrincipal(Utente user) {
        this.user=user;
    }

    @Override
    public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority;
        if(Boolean.TRUE.equals(user.getIsAdmin())){
            authority = new SimpleGrantedAuthority("ROLE_ADMIN");
        }
        else{
            authority = new SimpleGrantedAuthority("ROLE_USER");
        }
        return Collections.singleton(authority);
    }

    @Override
    public @Nullable String getPassword() {
        return user.getPassword();
    }

    @Override
    public @NonNull String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
