# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [x] Read the README [please please please]
- [x] Something cool!
- [x] Back-end
  - [x] Minimum Requirements
    - [x] Setup MongoDB database
    - [x] Setup item requests collection
    - [x] `PUT /api/request`
    - [x] `GET /api/request?page=_`
  - [x] Main Requirements
    - [x] `GET /api/request?status=pending`
    - [x] `PATCH /api/request`
  - [x] Above and Beyond `PATCH /api/request/batch`
    - [x] Batch edits
    - [x] Batch deletes
- [ ] Front-end
  - [ ] Minimum Requirements
    - [ ] Dropdown component
    - [ ] Table component
    - [ ] Base page [table with data]
    - [ ] Table dropdown interactivity
  - [ ] Main Requirements
    - [ ] Pagination
    - [ ] Tabs
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes

# Notes

<!-- Notes go here -->
Batch edit or delete by a given beginDate or endDate (only one is required)
Batch edit requires an old status to change from and a new status to change to
```
{
  "type": "edit" | "delete",
  "oldStatus": "pending",
  "newStatus": "pending",
  "beginDate": "2025-01-06T23:53:26.246Z" | 0,
  "endDate": "2025-01-06T23:59:26.246Z" | 0
}
```