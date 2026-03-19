import { determineContext } from '../src/services/intentRouter.js';

async function test() {
    try {
        console.log("Testing Intent Router with Scheme query...");
        const response = await determineContext("Mujhe PM Kisan yojana ke baare mein batao", { lat: 20, lon: 80 });
        console.log("SUCCESS! Context string generated (truncated first 500 chars):");
        console.log(response.substring(0, 500) + "...\n[Total length: " + response.length + "]");
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
