import { generateResponse } from '../src/services/gemini.js';

async function test() {
    try {
        console.log("Testing generateResponse...");
        const response = await generateResponse("Mera naam Amit hai, mujhe kaunsi schemes mil sakti hai?");
        console.log("SUCCESS! Gemini returned:");
        console.log(response);
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
