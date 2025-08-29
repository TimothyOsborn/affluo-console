package com.affluo.controller;

import com.affluo.model.Form;
import com.affluo.repository.mongo.FormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/companies/{companyId}/forms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FormController {

    private final FormRepository formRepository;

    @GetMapping
    public ResponseEntity<List<Form>> getForms(@PathVariable String companyId) {
        List<Form> forms = formRepository.findByCompanyId(companyId);
        return ResponseEntity.ok(forms);
    }

    @GetMapping("/{formId}")
    public ResponseEntity<Form> getForm(@PathVariable String companyId, @PathVariable String formId) {
        Optional<Form> form = formRepository.findByIdAndCompanyId(formId, companyId);
        return form.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Form> createForm(@PathVariable String companyId, @RequestBody Form form) {
        form.setCompanyId(companyId);
        form.setCreatedAt(LocalDateTime.now());
        form.setUpdatedAt(LocalDateTime.now());
        Form savedForm = formRepository.save(form);
        return ResponseEntity.ok(savedForm);
    }

    @PutMapping("/{formId}")
    public ResponseEntity<Form> updateForm(@PathVariable String companyId, 
                                         @PathVariable String formId, 
                                         @RequestBody Form form) {
        Optional<Form> existingForm = formRepository.findByIdAndCompanyId(formId, companyId);
        if (existingForm.isPresent()) {
            Form updatedForm = existingForm.get();
            updatedForm.setName(form.getName());
            updatedForm.setDescription(form.getDescription());
            updatedForm.setStatus(form.getStatus());
            updatedForm.setFields(form.getFields());
            updatedForm.setSettings(form.getSettings());
            updatedForm.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(formRepository.save(updatedForm));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{formId}")
    public ResponseEntity<Void> deleteForm(@PathVariable String companyId, @PathVariable String formId) {
        Optional<Form> form = formRepository.findByIdAndCompanyId(formId, companyId);
        if (form.isPresent()) {
            formRepository.deleteById(formId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
