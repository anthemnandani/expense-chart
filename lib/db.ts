import sql from "mssql"

export const config: sql.config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE || "",
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

// Connect once to validate DB connection (optional, for dev)
sql.connect(config)
  .then(() => {
    console.log("✅ Connected to SQL Server database successfully.")
  })
  .catch((err) => {
    console.error("❌ Failed to connect to SQL Server database:", err.message)
  })

export { sql }