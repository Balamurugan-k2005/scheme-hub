package com.schemehub.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "required_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequiredDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    @JsonIgnore
    private Scheme scheme;

    @Column(name = "document_name_en", nullable = false)
    private String documentNameEn;
    
    @Column(name = "document_name_hi")
    private String documentNameHi;
    
    @Column(name = "document_name_ta")
    private String documentNameTa;

    @Column(name = "is_mandatory", nullable = false)
    private Boolean isMandatory;
}
