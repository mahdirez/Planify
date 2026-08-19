exports.up = (pgm) => {
    pgm.createTable("users", {
        id: "id",
        email: { type: "varchar(255)", notNull: true, unique: true },
        password_hash: { type: "varchar(255)", notNull: true },
        created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    });

    pgm.createTable("tasks", {
        id: "id",
        description: { type: "text", notNull: true },
        completed: { type: "boolean", notNull: true, default: false },
        user_id: {
            type: "integer",
            notNull: true,
            references: "users",
            onDelete: "CASCADE",
        },
        created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("tasks");
    pgm.dropTable("users");
};