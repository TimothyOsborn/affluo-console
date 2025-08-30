package com.affluo.controller;

import com.affluo.model.Form;
import com.affluo.service.FormService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies/{companyId}/forms")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class FormController {

    private final FormService formService;

    @GetMapping
    public ResponseEntity<List<Form>> getForms(@PathVariable String companyId) {
        log.info("GET /api/companies/{}/forms", companyId);
        List<Form> forms = formService.getFormsByCompany(companyId);
        return ResponseEntity.ok(forms);
    }

    @GetMapping("/{formId}")
    public ResponseEntity<Form> getForm(@PathVariable String companyId, @PathVariable String formId) {
        log.info("GET /api/companies/{}/forms/{}", companyId, formId);
        Optional<Form> form = formService.getFormById(companyId, formId);
        return form.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Form> createForm(@PathVariable String companyId, @RequestBody Form form) {
        log.info("POST /api/companies/{}/forms", companyId);
        try {
            Form createdForm = formService.createForm(companyId, form);
            return ResponseEntity.ok(createdForm);
        } catch (IllegalArgumentException e) {
            log.error("Error creating form: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{formId}")
    public ResponseEntity<Form> updateForm(@PathVariable String companyId, 
                                         @PathVariable String formId, 
                                         @RequestBody Form form) {
        log.info("PUT /api/companies/{}/forms/{}", companyId, formId);
        try {
            Form updatedForm = formService.updateForm(companyId, formId, form);
            return ResponseEntity.ok(updatedForm);
        } catch (IllegalArgumentException e) {
            log.error("Error updating form: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{formId}")
    public ResponseEntity<Void> deleteForm(@PathVariable String companyId, @PathVariable String formId) {
        log.info("DELETE /api/companies/{}/forms/{}", companyId, formId);
        try {
            formService.deleteForm(companyId, formId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("Error deleting form: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
