package com.affluo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormSubmission {
    
    @Id
    private String id;
    
    @Indexed
    private String companyId;
    
    @Indexed
    private String formId;
    
    private String submittedBy;
    private LocalDateTime submittedAt;
    private String status; // PENDING, APPROVED, REJECTED
    
    private Map<String, Object> data;
    private Map<String, Object> metadata;
    
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private String reviewNotes;
}
