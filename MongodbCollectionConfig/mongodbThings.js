// - `ID`: a unique identifier (required)
// - `Requestor Name`: the name of the person who has requested the item (required, between 3-30 characters)
// - `Item Requested`: the item that has been requested (required, between 2-100 characters)
// - `Created Date`: the date that the item request has been created (required)
// - `Last Edited Date`: the date that the item request was last edited (optional)
// - `Status`: pending/completed/approved/rejected (required)

db.runCommand({
    collMod: "requests",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["id", "requestorName", "itemRequested", "requestCreatedDate", "status"],
            properties: {
                id: {
                    bsonType: "int",
                    description: "A unique identifier",
                },
                requestorName: {
                    bsonType: "string",
                    minLength: 3,
                    maxLength: 30,
                    description: "Name of the person who requested the item",
                },
                itemRequested: {
                    bsonType: "string",
                    minLength: 2,
                    maxLength: 100,
                    description: "The item that has been requested",
                },
                requestCreatedDate: {
                    bsonType: "date",
                    description: "The date the item request was created",
                },
                lastEditedDate: {
                    bsonType: "date",
                    description: "The date that the item request was last edited",
                },
                status: {
                    bsonType: "string",
                    enum: ["pending", "completed", "approved", "rejected"],
                    description: "pending/completed/approved/rejected",
                },
            },
        },
    },
    validationLevel: "strict",
    validationAction: "error"
});
db.requests.createIndex({ id: 1 }, { unique: true });