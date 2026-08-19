exports.up = (pgm) => {
    pgm.createTable("activity_logs", {
        id: "id",
        user_id: {
            type: "integer",
            notNull: true,
            references: "users",
            onDelete: "CASCADE",
        },
        action: { type: "varchar(50)", notNull: true },
        details: { type: "text" },
        created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    });

    pgm.createIndex("activity_logs", "user_id");
    pgm.createIndex("activity_logs", "created_at");
};

exports.down = (pgm) => {
    pgm.dropTable("activity_logs");
};