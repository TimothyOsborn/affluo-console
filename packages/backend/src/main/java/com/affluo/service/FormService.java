package com.affluo.service;

import com.affluo.model.Form;
import com.affluo.repository.mongo.FormRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FormService {
    
    private final FormRepository formRepository;
    private final ListService listService;
    
    public List<Form> getFormsByCompany(String companyId) {
        log.info("Fetching forms for company: {}", companyId);
        return formRepository.findByCompanyId(companyId);
    }
    
    public Optional<Form> getFormById(String companyId, String formId) {
        log.info("Fetching form {} for company: {}", formId, companyId);
        Optional<Form> form = formRepository.findByIdAndCompanyId(formId, companyId);
        if (form.isPresent()) {
            // Process list data sources before returning
            processFormDataSources(form.get(), companyId);
        }
        return form;
    }
    
    public Form createForm(String companyId, Form form) {
        log.info("Creating new form '{}' for company: {}", form.getName(), companyId);
        
        form.setId(UUID.randomUUID().toString());
        form.setCompanyId(companyId);
        form.setCreatedAt(LocalDateTime.now());
        form.setUpdatedAt(LocalDateTime.now());
        
        // Process list data sources before saving
        processFormDataSources(form, companyId);
        
        return formRepository.save(form);
    }
    
    public Form updateForm(String companyId, String formId, Form form) {
        log.info("Updating form {} for company: {}", formId, companyId);
        
        Optional<Form> existingForm = formRepository.findByIdAndCompanyId(formId, companyId);
        if (existingForm.isEmpty()) {
            throw new IllegalArgumentException("Form not found");
        }
        
        Form updatedForm = existingForm.get();
        updatedForm.setName(form.getName());
        updatedForm.setDescription(form.getDescription());
        updatedForm.setStatus(form.getStatus());
        updatedForm.setFields(form.getFields());
        updatedForm.setSettings(form.getSettings());
        updatedForm.setUpdatedAt(LocalDateTime.now());
        
        // Process list data sources before saving
        processFormDataSources(updatedForm, companyId);
        
        return formRepository.save(updatedForm);
    }
    
    public void deleteForm(String companyId, String formId) {
        log.info("Deleting form {} for company: {}", formId, companyId);
        
        Optional<Form> form = formRepository.findByIdAndCompanyId(formId, companyId);
        if (form.isEmpty()) {
            throw new IllegalArgumentException("Form not found");
        }
        
        formRepository.deleteById(formId);
    }
    
    /**
     * Process form fields to resolve list data sources and populate options
     */
    private void processFormDataSources(Form form, String companyId) {
        if (form.getFields() == null) return;
        
        for (Form.FormField field : form.getFields()) {
            if (field.getDataSource() != null && "list".equals(field.getDataSource().getType())) {
                try {
                    // Get list field values and populate options
                    List<String> fieldValues = listService.getListFieldValues(
                        companyId,
                        field.getDataSource().getListId(),
                        field.getDataSource().getListField()
                    );
                    
                    // Convert to options format
                    if (field.getOptions() == null) {
                        field.setOptions(Map.of());
                    }
                    
                    // Add enum values to options
                    field.getOptions().put("enum", fieldValues);
                    
                    log.debug("Processed list data source for field {}: {} values", 
                        field.getLabel(), fieldValues.size());
                        
                } catch (Exception e) {
                    log.warn("Failed to process list data source for field {}: {}", 
                        field.getLabel(), e.getMessage());
                }
            }
        }
    }
    
    /**
     * Get a form with resolved data sources for form rendering
     */
    public Optional<Form> getFormForRendering(String companyId, String formId) {
        log.info("Getting form {} for rendering in company: {}", formId, companyId);
        return getFormById(companyId, formId);
    }
}
