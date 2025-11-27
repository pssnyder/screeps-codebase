/**
 * Simple Test Framework
 * Lightweight testing utilities
 */

class TestFramework {
    /**
     * Run a test function
     */
    static test(name, testFn, results) {
        results.total++;
        
        try {
            const passed = testFn();
            
            if (passed) {
                console.log(`  ✓ ${name}`);
                results.passed++;
            } else {
                console.log(`  ✗ ${name} - Test returned false`);
                results.failed++;
            }
        } catch (error) {
            console.log(`  ✗ ${name} - Error: ${error.message}`);
            results.failed++;
        }
    }
    
    /**
     * Assert a condition
     */
    static assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    /**
     * Assert equality
     */
    static assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}: expected ${expected}, got ${actual}`);
        }
    }
    
    /**
     * Assert deep equality for objects
     */
    static assertDeepEqual(actual, expected, message) {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        
        if (actualStr !== expectedStr) {
            throw new Error(`${message}: expected ${expectedStr}, got ${actualStr}`);
        }
    }
}

module.exports = TestFramework;
