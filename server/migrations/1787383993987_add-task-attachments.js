exports.up = (pgm) => {
    pgm.createTable("task_attachments", {
        id: "id",
        task_id: {
            type: "integer",
            notNull: true,
            references: "tasks",
            onDelete: "CASCADE",
        },
        filename: { type: "varchar(255)", notNull: true },
        original_name: { type: "varchar(255)", notNull: true },
        mime_type: { type: "varchar(100)", notNull: true },
        size: { type: "integer", notNull: true },
        created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    });

    pgm.createIndex("task_attachments", "task_id");
};

exports.down = (pgm) => {
    pgm.dropTable("task_attachments");
};