package com.affluo.config;

import com.affluo.model.List;
import com.affluo.repository.mongo.ListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final ListRepository listRepository;
    
    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing sample data...");
        
        // Only initialize if no lists exist
        if (listRepository.count() == 0) {
            initializeSampleLists();
            log.info("Sample lists initialized successfully");
        } else {
            log.info("Lists already exist, skipping initialization");
        }
    }
    
    private void initializeSampleLists() {
        // Product Inventory List
        List productInventory = new List();
        productInventory.setId("list-1");
        productInventory.setCompanyId("company-1");
        productInventory.setName("Product Inventory");
        productInventory.setDescription("Complete product catalog with SKUs and categories");
        productInventory.setCreatedAt(LocalDateTime.now());
        productInventory.setUpdatedAt(LocalDateTime.now());
        
        // Product Inventory Fields
        productInventory.setFields(Arrays.asList(
            createField("Product Name", "text", true, null, 1),
            createField("SKU", "text", true, null, 2),
            createField("Category", "select", true, Arrays.asList("Electronics", "Clothing", "Home & Garden", "Books", "Sports"), 3),
            createField("Price", "number", true, null, 4),
            createField("Stock Level", "number", true, null, 5),
            createField("Supplier", "text", false, null, 6)
        ));
        
        // Product Inventory Items
        productInventory.setItems(Arrays.asList(
            createItem("item-1", Map.of(
                "Product Name", "Laptop Pro X1",
                "SKU", "LAP-001",
                "Category", "Electronics",
                "Price", "1299.99",
                "Stock Level", "45",
                "Supplier", "TechCorp"
            )),
            createItem("item-2", Map.of(
                "Product Name", "Wireless Headphones",
                "SKU", "AUD-002",
                "Category", "Electronics",
                "Price", "199.99",
                "Stock Level", "120",
                "Supplier", "AudioMax"
            )),
            createItem("item-3", Map.of(
                "Product Name", "Cotton T-Shirt",
                "SKU", "CLO-003",
                "Category", "Clothing",
                "Price", "24.99",
                "Stock Level", "200",
                "Supplier", "FashionCo"
            )),
            createItem("item-4", Map.of(
                "Product Name", "Garden Hose",
                "SKU", "GAR-004",
                "Category", "Home & Garden",
                "Price", "39.99",
                "Stock Level", "75",
                "Supplier", "GardenPro"
            )),
            createItem("item-5", Map.of(
                "Product Name", "Programming Guide",
                "SKU", "BOK-005",
                "Category", "Books",
                "Price", "49.99",
                "Stock Level", "30",
                "Supplier", "BookWorld"
            ))
        ));
        
        listRepository.save(productInventory);
        
        // Employee Directory List
        List employeeDirectory = new List();
        employeeDirectory.setId("list-2");
        employeeDirectory.setCompanyId("company-1");
        employeeDirectory.setName("Employee Directory");
        employeeDirectory.setDescription("Company employee information and contact details");
        employeeDirectory.setCreatedAt(LocalDateTime.now());
        employeeDirectory.setUpdatedAt(LocalDateTime.now());
        
        // Employee Directory Fields
        employeeDirectory.setFields(Arrays.asList(
            createField("First Name", "text", true, null, 1),
            createField("Last Name", "text", true, null, 2),
            createField("Email", "email", true, null, 3),
            createField("Department", "select", true, Arrays.asList("Engineering", "Sales", "Marketing", "HR", "Finance", "Operations"), 4),
            createField("Position", "text", true, null, 5),
            createField("Hire Date", "date", true, null, 6),
            createField("Phone", "text", false, null, 7)
        ));
        
        // Employee Directory Items
        employeeDirectory.setItems(Arrays.asList(
            createItem("emp-1", Map.of(
                "First Name", "John",
                "Last Name", "Smith",
                "Email", "john.smith@company.com",
                "Department", "Engineering",
                "Position", "Senior Developer",
                "Hire Date", "2023-01-15",
                "Phone", "+1-555-0123"
            )),
            createItem("emp-2", Map.of(
                "First Name", "Sarah",
                "Last Name", "Johnson",
                "Email", "sarah.johnson@company.com",
                "Department", "Sales",
                "Position", "Sales Manager",
                "Hire Date", "2022-08-20",
                "Phone", "+1-555-0124"
            )),
            createItem("emp-3", Map.of(
                "First Name", "Mike",
                "Last Name", "Davis",
                "Email", "mike.davis@company.com",
                "Department", "Marketing",
                "Position", "Marketing Specialist",
                "Hire Date", "2023-03-10",
                "Phone", "+1-555-0125"
            ))
        ));
        
        listRepository.save(employeeDirectory);
        
        // Customer List
        List customerList = new List();
        customerList.setId("list-3");
        customerList.setCompanyId("company-1");
        customerList.setName("Customer List");
        customerList.setDescription("Customer database with contact and preference information");
        customerList.setCreatedAt(LocalDateTime.now());
        customerList.setUpdatedAt(LocalDateTime.now());
        
        // Customer List Fields
        customerList.setFields(Arrays.asList(
            createField("Customer Name", "text", true, null, 1),
            createField("Email", "email", true, null, 2),
            createField("Phone", "text", false, null, 3),
            createField("Company", "text", false, null, 4),
            createField("Customer Type", "select", true, Arrays.asList("Individual", "Small Business", "Enterprise"), 5),
            createField("Join Date", "date", true, null, 6),
            createField("Status", "select", true, Arrays.asList("Active", "Inactive", "Pending"), 7)
        ));
        
        // Customer List Items
        customerList.setItems(Arrays.asList(
            createItem("cust-1", Map.of(
                "Customer Name", "Alice Johnson",
                "Email", "alice@example.com",
                "Phone", "+1-555-0101",
                "Company", "TechStart",
                "Customer Type", "Small Business",
                "Join Date", "2023-06-15",
                "Status", "Active"
            )),
            createItem("cust-2", Map.of(
                "Customer Name", "Bob Wilson",
                "Email", "bob@bigcorp.com",
                "Phone", "+1-555-0102",
                "Company", "BigCorp Inc",
                "Customer Type", "Enterprise",
                "Join Date", "2022-11-20",
                "Status", "Active"
            )),
            createItem("cust-3", Map.of(
                "Customer Name", "Carol Brown",
                "Email", "carol@personal.com",
                "Phone", "+1-555-0103",
                "Company", "",
                "Customer Type", "Individual",
                "Join Date", "2024-01-05",
                "Status", "Active"
            ))
        ));
        
        listRepository.save(customerList);
    }
    
    private List.ListField createField(String name, String type, Boolean required, java.util.List<String> options, Integer order) {
        List.ListField field = new List.ListField();
        field.setName(name);
        field.setType(type);
        field.setRequired(required);
        field.setOptions(options);
        field.setOrder(order);
        return field;
    }
    
    private List.ListItem createItem(String id, Map<String, Object> data) {
        List.ListItem item = new List.ListItem();
        item.setId(id);
        item.setData(data);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        return item;
    }
}
