package com.affluo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Form {
    
    @Id
    private String id;
    
    @Indexed
    private String companyId;
    
    private String name;
    private String description;
    private String status; // DRAFT, PUBLISHED, ARCHIVED
    
    private List<FormField> fields;
    private Map<String, Object> settings;
    
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FormField {
        private String id;
        private String type; // text, number, email, select, checkbox, radio, file, date
        private String label;
        private String placeholder;
        private Boolean required;
        private Map<String, Object> validation;
        private Map<String, Object> options;
        private Integer order;
    }
}
