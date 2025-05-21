package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    /**
     * Forward all routes to index.html for the frontend SPA router
     * This enables React Router to handle client-side routing
     */
    @GetMapping(value = {"/"})
    public String index() {
        return "forward:/index.html";
    }
    
    /**
     * Alternative path for SPA routing
     */
    @GetMapping(value = {"/login", "/register", "/products/**", "/cart", "/checkout", "/admin/**"})
    public String forwardSpaRoutes() {
        return "forward:/";
    }
} 