package com.affluo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateListRequest {
    private String name;
    private String description;
    private List<ListFieldDto> fields;
    private List<Map<String, Object>> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListFieldDto {
        private String name;
        private String type;
        private Boolean required;
        private List<String> options;
        private Integer order;
    }
}
