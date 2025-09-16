// Test setup file

// @ts-ignore
import dotenv from "dotenv";
import {afterEach, beforeEach} from "node:test";

// Load environment variables for testing
dotenv.config({ path: ".env.test" });

// Global test setup
beforeAll(async () => {
    // Setup code that runs before all tests
});

afterAll(async () => {
    // Cleanup code that runs after all tests
});

beforeEach(() => {
    // Setup code that runs before each test
});

afterEach(() => {
    // Cleanup code that runs after each test
});

function beforeAll(arg0: () => Promise<void>) {
    throw new Error("Function not implemented.");
}
function afterAll(arg0: () => Promise<void>) {
    throw new Error("Function not implemented.");
}

