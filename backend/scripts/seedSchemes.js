import { runScraper } from '../src/cron/schemeScraper.js';

console.log("Running manual database seed for Shram Saathi Schemes...");
runScraper().then(() => {
    console.log("Seed complete. Exiting...");
    process.exit(0);
}).catch(err => {
    console.error("Seed failed:", err);
    process.exit(1);
});
