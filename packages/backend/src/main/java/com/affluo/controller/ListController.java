package com.affluo.controller;

import com.affluo.dto.AddListItemRequest;
import com.affluo.dto.CreateListRequest;
import com.affluo.dto.UpdateListRequest;
import com.affluo.model.List;
import com.affluo.service.ListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies/{companyId}/lists")
@RequiredArgsConstructor
@Slf4j
public class ListController {
    
    private final ListService listService;
    
    @GetMapping
    public ResponseEntity<List<List>> getLists(@PathVariable String companyId) {
        log.info("GET /api/companies/{}/lists", companyId);
        List<List> lists = listService.getListsByCompany(companyId);
        return ResponseEntity.ok(lists);
    }
    
    @GetMapping("/{listId}")
    public ResponseEntity<List> getList(@PathVariable String companyId, @PathVariable String listId) {
        log.info("GET /api/companies/{}/lists/{}", companyId, listId);
        return listService.getListById(companyId, listId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<List> createList(@PathVariable String companyId, @RequestBody CreateListRequest request) {
        log.info("POST /api/companies/{}/lists", companyId);
        try {
            List createdList = listService.createList(companyId, request);
            return ResponseEntity.ok(createdList);
        } catch (IllegalArgumentException e) {
            log.error("Error creating list: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{listId}")
    public ResponseEntity<List> updateList(@PathVariable String companyId, @PathVariable String listId, @RequestBody UpdateListRequest request) {
        log.info("PUT /api/companies/{}/lists/{}", companyId, listId);
        try {
            List updatedList = listService.updateList(companyId, listId, request);
            return ResponseEntity.ok(updatedList);
        } catch (IllegalArgumentException e) {
            log.error("Error updating list: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{listId}")
    public ResponseEntity<Void> deleteList(@PathVariable String companyId, @PathVariable String listId) {
        log.info("DELETE /api/companies/{}/lists/{}", companyId, listId);
        try {
            listService.deleteList(companyId, listId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("Error deleting list: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{listId}/items")
    public ResponseEntity<List.ListItem> addListItem(@PathVariable String companyId, @PathVariable String listId, @RequestBody AddListItemRequest request) {
        log.info("POST /api/companies/{}/lists/{}/items", companyId, listId);
        try {
            List.ListItem newItem = listService.addListItem(companyId, listId, request);
            return ResponseEntity.ok(newItem);
        } catch (IllegalArgumentException e) {
            log.error("Error adding list item: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{listId}/items/{itemId}")
    public ResponseEntity<Void> removeListItem(@PathVariable String companyId, @PathVariable String listId, @PathVariable String itemId) {
        log.info("DELETE /api/companies/{}/lists/{}/items/{}", companyId, listId, itemId);
        try {
            listService.removeListItem(companyId, listId, itemId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("Error removing list item: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{listId}/fields/{fieldName}/values")
    public ResponseEntity<List<String>> getListFieldValues(@PathVariable String companyId, @PathVariable String listId, @PathVariable String fieldName) {
        log.info("GET /api/companies/{}/lists/{}/fields/{}/values", companyId, listId, fieldName);
        try {
            List<String> values = listService.getListFieldValues(companyId, listId, fieldName);
            return ResponseEntity.ok(values);
        } catch (IllegalArgumentException e) {
            log.error("Error getting list field values: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
