public with sharing class GenericLookUpController {
    
        @AuraEnabled(cacheable=true)
        public static List<sObject> searchForRecords(String searchTerm, String tableName) {
            String whereQuery = ' Where Name Like \'%{1}%\' ';
            String limitQuery = 'LIMIT  15';
            String query = 'Select Id, Name from {0} ';
            if(!String.isBlank(searchTerm)) {
                query += whereQuery;
            }
            query += limitQuery;
            return Database.query(String.format(query, new List<Object>{ tableName, searchTerm}));
        }
    }
    