import { PTE } from '../src/pte-engine';
test('PTE computes valid PRM', () => {
  const result = PTE.computePRM({rsi: 70, vix: 20, sentiment: 0.8, volume_delta: 1.2});
  expect(result.probability).toBeGreaterThan(0.3);
});
