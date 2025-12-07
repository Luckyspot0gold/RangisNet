/**
 * Engine Bridge - Python to Node.js Interface
 * RangisNet HHPEI (Harmonic, Haptic, Phonic Economic Interpreter)
 * 
 * Bridges Python harmonic engines to x402 paid service endpoints
 * Enables real-time sensory economic data via micropayment API
 */

const { spawn } = require("child_process");
const path = require("path");

/**
 * Run the HHPEI Python engine as subprocess
 * Returns full sensory economic payload (JSON)
 * 
 * @returns {Promise<Object>} HHPEI sensory payload
 */
function runHHPEIEngine() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../Engines/HHPEI-engine.py");
    const child = spawn("python3", [scriptPath]);

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Engine failed: ${errorOutput}`));
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (parseError) {
        // Fallback: return raw output if JSON parse fails
        resolve({ 
          raw: output,
          error: "JSON parse failed",
          fallback: true 
        });
      }
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to start engine: ${err.message}`));
    });
  });
}

/**
 * Run legacy PTE engine (Real-time_Calc-engine.py)
 * Maintained for backward compatibility
 * 
 * @returns {Promise<Object>} PTE calculation results
 */
function runPTEEngine() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../Engines/Real-time_Calc-engine.py");
    const child = spawn("python3", [scriptPath]);

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`PTE Engine failed: ${errorOutput}`));
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch {
        resolve({ raw: output });
      }
    });
  });
}

/**
 * Run McCrea Metrics Engine
 * Computes HVI, HLI, HRI, SSS, ω, p
 * 
 * @returns {Promise<Object>} McCrea metrics output
 */
function runMcCreaMetrics() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../Engines/McCrea-MetricsEngine.py");
    const child = spawn("python3", [scriptPath]);

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`McCrea Engine failed: ${errorOutput}`));
      }

      try {
        resolve(JSON.parse(output));
      } catch {
        resolve({ raw: output });
      }
    });
  });
}

module.exports = { 
  runHHPEIEngine,
  runPTEEngine,
  runMcCreaMetrics 
};
