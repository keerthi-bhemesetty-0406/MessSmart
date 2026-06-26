package com.messsmart.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "messes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👈 Force the property name to match "messName" verbatim so it hooks up perfectly with your Repository and Controller layers!
    @Column(name = "mess_name", unique = true, nullable = false, length = 100)
    private String messName;
}