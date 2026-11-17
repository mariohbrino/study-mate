# Assignments Model Design

## 1. Purpose

The assignments model represents the structure and attributes of assignments within the system. It defines the key properties, relationships, and constraints that an assignment must adhere to. This model is essential for managing and tracking assignments effectively.

## 2. Data Structure

| Attribute   | Type   | Description                                                              |
| ----------- | ------ | ------------------------------------------------------------------------ |
| id          | String | Unique identifier for the assignment                                     |
| student_id  | String | Identifier of the student who owns the assignment                        |
| title       | String | Title of the assignment                                                  |
| description | String | Detailed description of the assignment                                   |
| course      | String | Course associated with the assignment                                    |
| due_at      | Date   | Due date for the assignment                                              |
| status      | String | Current status of the assignment (e.g., pending, in_progress, completed) |
| created_at  | Date   | Timestamp when the assignment was created                                |
| updated_at  | Date   | Timestamp when the assignment was last updated                           |

## 3. Model Functions

The assignment model will provide the following operations:

- **Get:** Retrieves a list of all assignments for a student
- **Find by ID:** Retrieves the details of a specific assignment
- **Find by Student ID:** Retrieves all assignments for a specific student
- **Store:** Adds a new assignment to the system
- **Update:** Modifies the details of an existing assignment
- **Remove:** Removes an assignment from the system

## 4. Integration

The model will work with Drizzle ORM for database operations with PostgreSQL, using a factory function to create the assignments model functions with dependency injection of the database client connection for modularity and testability.

## 5. Testing

Vitest and PGlite will be used for testing the assignment model, ensuring that all CRUD operations and relationships function correctly. Relationships testing will be implemented in future work.

- Store - Tests the storing of a new assignment for a student
- Find by ID - Tests retrieving a specific assignment by its ID
- Find by Student ID - Tests retrieving all assignments associated with a specific student
- Update - Tests updating the details of an existing assignment
- Remove - Tests removing an existing assignment

## 6. Relationships

The assignment model has relationships with other models in the system, defining how assignments are connected to students and study sessions. These relationships help maintain data integrity and enable efficient querying of related data.

| Relationship | Model         | Description                                               |
| ------------ | ------------- | --------------------------------------------------------- |
| belongs_to   | Student       | The user who created or is responsible for the assignment |
| has_many     | Study Session | The study sessions associated with the assignment         |
