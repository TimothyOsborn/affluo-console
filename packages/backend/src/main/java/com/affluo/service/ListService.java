package com.affluo.service;

import com.affluo.dto.AddListItemRequest;
import com.affluo.dto.CreateListRequest;
import com.affluo.dto.UpdateListRequest;
import com.affluo.model.List;
import com.affluo.repository.mongo.ListRepository;
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
public class ListService {
    
    private final ListRepository listRepository;
    
    public List<List> getListsByCompany(String companyId) {
        log.info("Fetching lists for company: {}", companyId);
        return listRepository.findByCompanyId(companyId);
    }
    
    public Optional<List> getListById(String companyId, String listId) {
        log.info("Fetching list {} for company: {}", listId, companyId);
        Optional<List> list = listRepository.findById(listId);
        return list.filter(l -> l.getCompanyId().equals(companyId));
    }
    
    public List createList(String companyId, CreateListRequest request) {
        log.info("Creating new list '{}' for company: {}", request.getName(), companyId);
        
        // Check if list with same name already exists
        if (listRepository.existsByCompanyIdAndName(companyId, request.getName())) {
            throw new IllegalArgumentException("List with name '" + request.getName() + "' already exists");
        }
        
        List list = new List();
        list.setId(UUID.randomUUID().toString());
        list.setCompanyId(companyId);
        list.setName(request.getName());
        list.setDescription(request.getDescription());
        list.setCreatedAt(LocalDateTime.now());
        list.setUpdatedAt(LocalDateTime.now());
        
        // Convert DTO fields to model fields
        if (request.getFields() != null) {
            list.setFields(request.getFields().stream()
                .map(this::convertToModelField)
                .toList());
        }
        
        // Convert DTO items to model items
        if (request.getItems() != null) {
            list.setItems(request.getItems().stream()
                .map(this::convertToModelItem)
                .toList());
        }
        
        return listRepository.save(list);
    }
    
    public List updateList(String companyId, String listId, UpdateListRequest request) {
        log.info("Updating list {} for company: {}", listId, companyId);
        
        Optional<List> existingList = getListById(companyId, listId);
        if (existingList.isEmpty()) {
            throw new IllegalArgumentException("List not found");
        }
        
        List list = existingList.get();
        
        // Check if new name conflicts with existing list
        if (!list.getName().equals(request.getName()) && 
            listRepository.existsByCompanyIdAndNameAndIdNot(companyId, request.getName(), listId)) {
            throw new IllegalArgumentException("List with name '" + request.getName() + "' already exists");
        }
        
        list.setName(request.getName());
        list.setDescription(request.getDescription());
        list.setUpdatedAt(LocalDateTime.now());
        
        // Update fields
        if (request.getFields() != null) {
            list.setFields(request.getFields().stream()
                .map(this::convertToModelField)
                .toList());
        }
        
        // Update items
        if (request.getItems() != null) {
            list.setItems(request.getItems().stream()
                .map(this::convertToModelItem)
                .toList());
        }
        
        return listRepository.save(list);
    }
    
    public void deleteList(String companyId, String listId) {
        log.info("Deleting list {} for company: {}", listId, companyId);
        
        Optional<List> list = getListById(companyId, listId);
        if (list.isEmpty()) {
            throw new IllegalArgumentException("List not found");
        }
        
        listRepository.deleteById(listId);
    }
    
    public List.ListItem addListItem(String companyId, String listId, AddListItemRequest request) {
        log.info("Adding item to list {} for company: {}", listId, companyId);
        
        Optional<List> listOpt = getListById(companyId, listId);
        if (listOpt.isEmpty()) {
            throw new IllegalArgumentException("List not found");
        }
        
        List list = listOpt.get();
        List.ListItem newItem = convertToModelItem(request.getData());
        list.getItems().add(newItem);
        list.setUpdatedAt(LocalDateTime.now());
        
        listRepository.save(list);
        return newItem;
    }
    
    public void removeListItem(String companyId, String listId, String itemId) {
        log.info("Removing item {} from list {} for company: {}", itemId, listId, companyId);
        
        Optional<List> listOpt = getListById(companyId, listId);
        if (listOpt.isEmpty()) {
            throw new IllegalArgumentException("List not found");
        }
        
        List list = listOpt.get();
        boolean removed = list.getItems().removeIf(item -> item.getId().equals(itemId));
        
        if (!removed) {
            throw new IllegalArgumentException("Item not found");
        }
        
        list.setUpdatedAt(LocalDateTime.now());
        listRepository.save(list);
    }
    
    public List<String> getListFieldValues(String companyId, String listId, String fieldName) {
        log.info("Getting field values for field '{}' in list {} for company: {}", fieldName, listId, companyId);
        
        Optional<List> listOpt = getListById(companyId, listId);
        if (listOpt.isEmpty()) {
            throw new IllegalArgumentException("List not found");
        }
        
        List list = listOpt.get();
        return list.getItems().stream()
            .map(item -> item.getData().get(fieldName))
            .filter(value -> value != null)
            .map(Object::toString)
            .distinct()
            .toList();
    }
    
    private List.ListField convertToModelField(CreateListRequest.ListFieldDto dto) {
        List.ListField field = new List.ListField();
        field.setName(dto.getName());
        field.setType(dto.getType());
        field.setRequired(dto.getRequired());
        field.setOptions(dto.getOptions());
        field.setOrder(dto.getOrder());
        return field;
    }
    
    private List.ListField convertToModelField(UpdateListRequest.ListFieldDto dto) {
        List.ListField field = new List.ListField();
        field.setName(dto.getName());
        field.setType(dto.getType());
        field.setRequired(dto.getRequired());
        field.setOptions(dto.getOptions());
        field.setOrder(dto.getOrder());
        return field;
    }
    
    private List.ListItem convertToModelItem(Map<String, Object> data) {
        List.ListItem item = new List.ListItem();
        item.setId(UUID.randomUUID().toString());
        item.setData(data);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        return item;
    }
}
