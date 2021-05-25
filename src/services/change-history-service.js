function getChangeHistories(baseUrl,
                            entityType,
                            entityId,
                            version,
                            isApproved,
                            offset,
                            limit) {
    console.log('toit....');
    let url = `${baseUrl}.${entityType}/${entityId}/changehistory?`;
    const queryParams = [];
    if (version) {
        queryParams.push(`versionId=${version}`);
    }
    if (isApproved) {
        queryParams.push(`approved=${isApproved}`);
    } else {
        queryParams.push(`offset=${offset}&limit=${limit}`);
    }
    url += queryParams.join('&');
    console.log(url);
    return {
        "offset": 0,
        "count": 3,
        "limit": 100,
        "histories": [
            {
                "date": "2019-09-13T12:37:37.450Z",
                "fields": [
                    {
                        "newValue": "asdf",
                        "oldValue": "Some thing usable",
                        "fieldName": "controlDescription",
                        "fieldType": "textarea",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Description"
                    },
                    {
                        "newValue": "Key Control Activity",
                        "oldValue": "Test Control Activity",
                        "fieldName": "controlCategoryClassification",
                        "fieldType": "singleselect",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Control Category & Classification"
                    },
                    {
                        "newValue": "group1,groupCustom,gropu3",
                        "oldValue": "group1,groupCustom,TestGroup",
                        "fieldName": "impactedIndependentRiskManagementGroups",
                        "fieldType": "multiselect",
                        "sectionName": "association",
                        "sectionLabel": "Independent Risk Management Group",
                        "fieldLabel": ""
                    },
                    {
                        "newValue": "Draft",
                        "oldValue": "AwaitingApproval",
                        "fieldName": "controlStatus",
                        "fieldType": "singleselect",
                        "sectionName": "status",
                        "sectionLabel": "Status",
                        "fieldLabel": "Status"
                    }
                ],
                "modifiedBy": "qvv013",
                "associations": [
                    {
                        "operation": "add",
                        "entityName": "PLAN-1024",
                        "entityType": "plan"
                    },
                    {
                        "operation": "remove",
                        "entityName": "PLAN-88765",
                        "entityType": "plan"
                    }
                ],
                "historyId": "b275f717-aa40-441b-b2ac-8317dad64874"
            },
            {
                "date": "2019-09-13T12:37:37.450Z",
                "fields": [
                    {
                        "newValue": "Some thing usable",
                        "oldValue": "asdf",
                        "fieldName": "controlDescription",
                        "fieldType": "textarea",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Description"
                    },
                    {
                        "newValue": "Test Control Activity",
                        "oldValue": "Key Control Activity",
                        "fieldName": "controlCategoryClassification",
                        "fieldType": "singleselect",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Control Category & Classification"
                    },
                    {
                        "newValue": "group1,groupCustom,TestGroup",
                        "oldValue": "group1,groupCustom,gropu3",
                        "fieldName": "impactedIndependentRiskManagementGroups",
                        "fieldType": "multiselect",
                        "sectionName": "association",
                        "sectionLabel": "Independent Risk Management Group",
                        "fieldLabel": ""
                    },
                    {
                        "newValue": "AwaitingApproval",
                        "oldValue": "Draft",
                        "fieldName": "controlStatus",
                        "fieldType": "singleselect",
                        "sectionName": "status",
                        "sectionLabel": "Status",
                        "fieldLabel": "Status"
                    }
                ],
                "modifiedBy": "qvv013",
                "associations": [
                    {
                        "operation": "add",
                        "entityName": "PLAN-88765",
                        "entityType": "plan"
                    },
                    {
                        "operation": "remove",
                        "entityName": "PLAN-1024",
                        "entityType": "plan"
                    }
                ],
                "historyId": "5c82c1a0-70f6-450b-b1fb-1ff72dc4238e"
            },
            {
                "date": "2019-09-13T12:37:37.450Z",
                "fields": [
                    {
                        "newValue": "asdf",
                        "oldValue": "",
                        "fieldName": "controlTitle",
                        "fieldType": "textarea",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Title"
                    },
                    {
                        "newValue": "asdf",
                        "oldValue": "",
                        "fieldName": "controlDescription",
                        "fieldType": "textarea",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Description"
                    },
                    {
                        "newValue": "Key Control Activity",
                        "oldValue": "",
                        "fieldName": "controlCategoryClassification",
                        "fieldType": "singleselect",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Control Category & Classification"
                    },
                    {
                        "newValue": "Weekly",
                        "oldValue": "",
                        "fieldName": "executionFrequency",
                        "fieldType": "singleselect",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Frequency"
                    },
                    {
                        "newValue": "Detective",
                        "oldValue": "",
                        "fieldName": "controlType",
                        "fieldType": "singleselect",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Type"
                    },
                    {
                        "newValue": "Manual",
                        "oldValue": "",
                        "fieldName": "controlMethod",
                        "fieldType": "singleselect",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Method"
                    },
                    {
                        "newValue": "Aml",
                        "oldValue": "",
                        "fieldName": "owningBusiness",
                        "fieldType": "singleselect",
                        "sectionName": "field",
                        "sectionLabel": "Control Details",
                        "fieldLabel": "Owning Business"
                    },
                    {
                        "newValue": "group1,groupCustom,gropu3",
                        "oldValue": "",
                        "fieldName": "impactedIndependentRiskManagementGroups",
                        "fieldType": "multiselect",
                        "sectionName": "association",
                        "sectionLabel": "Independent Risk Management Group",
                        "fieldLabel": ""
                    },
                    {
                        "newValue": "ieg588",
                        "oldValue": "",
                        "fieldName": "documentationOwner",
                        "fieldType": "singleselect",
                        "sectionName": "people",
                        "sectionLabel": "StakeHolders",
                        "fieldLabel": "Control Documentation Lead"
                    },
                    {
                        "newValue": "aab644",
                        "oldValue": "",
                        "fieldName": "accountableExecutive",
                        "fieldType": "singleselect",
                        "sectionName": "people",
                        "sectionLabel": "StakeHolders",
                        "fieldLabel": "Control Owner"
                    },
                    {
                        "newValue": "Draft",
                        "oldValue": "",
                        "fieldName": "controlStatus",
                        "fieldType": "singleselect",
                        "sectionName": "status",
                        "sectionLabel": "Status",
                        "fieldLabel": "Status"
                    }
                ],
                "modifiedBy": "qvv013",
                "associations": [
                    {
                        "operation": "add",
                        "entityName": "PLAN-1023530",
                        "entityType": "plan"
                    },
                    {
                        "operation": "add",
                        "entityName": "PLAN-1024",
                        "entityType": "plan"
                    },
                    {
                        "operation": "add",
                        "entityName": "RISK-1023530",
                        "entityType": "risk"
                    },
                    {
                        "operation": "add",
                        "entityName": "RISK-77865",
                        "entityType": "risk"
                    }
                ],
                "historyId": "f282979e-ab50-4b67-8673-5231a6dd85fa"
            }
        ]
    };
}

export {
    getChangeHistories
}


