package com.jm.u313.controller;

import com.jm.u313.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Controller
@RequestMapping(value = "/admin")
public class AdminController {
    private final UserService userService;
    public AdminController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping
    public String admin(Model model, Principal principal) {
        model.addAttribute("user", userService.getUser(principal.getName()));
        return "admin";
    }
}
