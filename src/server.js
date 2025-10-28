
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ====== Config ======
const API_KEY = process.env.MCP_API_KEY || "hardcoded-key-is-bad";
const PORT = process.env.PORT || 3000;

// ====== In-memory Data ======
let employees = {
  "1234": {
    id: "1234",
    name: "Sarah Lee",
    department: "Engineering",
    status: "on leave",
    email: "sarah.lee@company.com"
  },
  "5678": {
    id: "5678",
    name: "Tom Alvarez",
    department: "Marketing",
    status: "active",
    email: "tom.alvarez@company.com"
  }
};

// ====== Middleware: API Key Auth for tool routes ======
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }
  const key = authHeader.split(" ")[1];
  if (key !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key." });
  }
  next();
}

// ====== Public Routes ======
app.get("/", (req, res) => res.send("✅ CompanyDB MCP server is running."));
app.get("/.well-known/mcp.json", (req, res) => {
  res.sendFile(path.join(__dirname, ".well-known/mcp.json"));
});

// Serve UI
app.use("/ui", express.static(path.join(__dirname, "public/ui")));

// ====== MCP Tool Endpoints (Protected) ======
app.post("/tools/get_employee", authMiddleware, (req, res) => {
  const { id } = req.body || {};
  const employee = employees[id];
  if (!employee) return res.status(404).json({ error: "Employee not found" });
  res.json({ result: employee, meta: { tool: "get_employee", ts: new Date().toISOString() } });
});

app.post("/tools/update_status", authMiddleware, (req, res) => {
  const { id, status } = req.body || {};
  const employee = employees[id];
  if (!employee) return res.status(404).json({ error: "Employee not found" });
  employee.status = status;
  res.json({ result: "success", message: `Employee ${id} updated to ${status}.`, meta: { tool: "update_status", ts: new Date().toISOString() } });
});

// ====== Start ======
app.listen(PORT, () => {
  console.log(`🚀 MCP server running at http://localhost:${PORT}`);
});
