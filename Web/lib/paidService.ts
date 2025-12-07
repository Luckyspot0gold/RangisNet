/**
 * Call RangisNet paid PTE service via x402 micropayment
 * Uses fetch with x402 payment headers
 * @param data - PTE computation parameters
 * @returns PTE computation results
 */
export async function callPaidService(data?: { run?: string; pair?: string; amount?: string }) {
  try {
    const res = await fetch("/api/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || { run: "pte" }),
    });

    const result = await res.json();
    console.log("X402 Paid Response:", result);
    return result;
  } catch (error) {
    console.error("X402 Payment Error:", error);
    throw error;
  }
}

/**
 * Get service pricing and payment status
 */
export async function getServiceInfo() {
  try {
    const res = await fetch("/api/service", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Service info error:", error);
    throw error;
  }
}
