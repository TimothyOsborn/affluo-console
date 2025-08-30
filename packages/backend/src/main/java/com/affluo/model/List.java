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

@Document(collection = "lists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class List {
    
    @Id
    private String id;
    
    @Indexed
    private String companyId;
    
    private String name;
    private String description;
    
    private List<ListField> fields;
    private List<ListItem> items;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListField {
        private String name;
        private String type; // text, number, email, select, date
        private Boolean required;
        private List<String> options; // for select fields
        private Integer order;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListItem {
        private String id;
        private Map<String, Object> data; // dynamic field values
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
