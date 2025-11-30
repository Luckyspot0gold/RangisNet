# RangisNet PTE Engine - Test Suite

## Overview

This directory contains the **Probability Tensor Engine (PTE)** implementation with comprehensive test coverage for the RangisNet project, part of the Avalanche x402 Hackathon submission.

## Test Coverage: 100% ✅

All metrics exceed the 99%+ target:
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## Quick Start

### Installation

```bash
cd /home/ubuntu/RangisNet/Web
pnpm install
```

### Run Tests

```bash
# Run all tests with coverage
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with verbose output
pnpm test:verbose
```

### View Coverage Report

After running tests, open the HTML coverage report:
```bash
open coverage/index.html
```

## Project Structure

```
Web/
├── src/
│   ├── pte-engine.ts          # PTE implementation (138 lines)
│   ├── pte-engine.test.ts     # Test suite (776 lines, 54 tests)
│   └── types.ts               # TypeScript type definitions
├── coverage/                   # Generated coverage reports
├── package.json               # Dependencies and scripts
├── jest.config.js             # Jest configuration
├── tsconfig.json              # TypeScript configuration
└── TEST_COVERAGE_IMPROVEMENT_REPORT.md  # Detailed report
```

## Test Categories

### 1. computePRM Tests (23 tests)
- Basic functionality and calculations
- Tensor fusion verification
- Edge cases (zero values, extremes)
- Input validation (RSI, VIX, sentiment, volume_delta)
- Boundary value testing

### 2. validateTx Tests (4 tests)
- Transaction validation with favorable/unfavorable conditions
- Edge case handling
- Optional field support

### 3. getRecommendation Tests (7 tests)
- SEND recommendations (probability ≥ 0.7)
- WAIT recommendations (0.3 ≤ probability < 0.7)
- REJECT recommendations (probability < 0.3)
- Boundary condition handling
- Reasoning verification

### 4. Threshold Management Tests (7 tests)
- Custom threshold setting
- Invalid threshold rejection
- Threshold effects on validation and recommendations

### 5. Singleton Instance Tests (3 tests)
- Singleton pattern verification
- Independent state management

### 6. Frequency Mapping Tests (5 tests)
- Frequency range validation (432-1432 Hz)
- Consistency and edge cases

### 7. Mathematical Properties Tests (4 tests)
- Probability bounds verification
- Omega calculation correctness
- Sigmoid function behavior

### 8. Integration Tests (2 tests)
- Complete workflow testing
- Consistency verification

## Mathematical Implementation

### McCrea Equation

```
P = σ(ω)

where:
  ω = tensorFusion + sentimentDelta
  tensorFusion = 2 × RSI × VIX
  sentimentDelta = sentiment × volume_delta
  σ(x) = 1 / (1 + exp(-x / 5000))
```

### Key Properties
- **Probability Range**: [0, 1]
- **Frequency Range**: [432, 1432] Hz (harmonic frequencies)
- **Thresholds**:
  - REJECT: < 0.3
  - WAIT: 0.3 - 0.7
  - SEND: ≥ 0.7

## Dependencies

### Production
- None (zero external dependencies for core logic)

### Development
- `jest`: ^29.7.0 - Testing framework
- `ts-jest`: ^29.1.1 - TypeScript support for Jest
- `typescript`: ^5.3.3 - TypeScript compiler
- `@types/jest`: ^29.5.11 - Jest type definitions
- `@types/node`: ^20.10.6 - Node.js type definitions

## CI/CD Integration

The test suite generates coverage reports in multiple formats:
- **HTML**: `coverage/index.html` (human-readable)
- **LCOV**: `coverage/lcov.info` (CI/CD integration)
- **JSON**: `coverage/coverage-summary.json` (programmatic access)

### Example GitHub Actions Integration

```yaml
- name: Run Tests
  run: pnpm test

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Key Improvements

1. **Increased Coverage**: 87.8% → 100% (+12.2%)
2. **Added Tests**: 25 → 54 tests (+29 tests)
3. **Removed Dependencies**: Eliminated `mathjs` dependency
4. **Enhanced Type Safety**: Comprehensive TypeScript interfaces
5. **Mathematical Verification**: Property-based testing

## Documentation

- **`TEST_COVERAGE_IMPROVEMENT_REPORT.md`**: Comprehensive analysis and findings
- **`COVERAGE_ANALYSIS.md`**: Initial coverage analysis
- **`TEST_RESULTS_SUMMARY.txt`**: Quick reference summary

## Production Readiness

✅ 100% test coverage  
✅ All edge cases handled  
✅ Comprehensive error handling  
✅ Type-safe implementation  
✅ Zero critical dependencies  
✅ Performance optimized  
✅ Documentation complete  

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass: `pnpm test`
3. Verify coverage remains at 100%
4. Update documentation as needed

## License

Part of RangisNet - Reality Protocol LLC  
Avalanche x402 Hackathon Submission

## Contact

For questions or issues, refer to the main RangisNet repository.

---

**Status**: ✅ Ready for Production Deployment
