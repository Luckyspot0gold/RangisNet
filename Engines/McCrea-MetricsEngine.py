class McCreaMetricsEngine:
    def calculate_HVI(self, market_data):
        frequency_std = np.std(market_data.spectral_density)
        base_frequency = np.mean(market_data.dominant_frequencies)
        amplitude_var = self.calculate_amplitude_instability(market_data)
        
        return (frequency_std / base_frequency) * amplitude_var
        
    def calculate_HLI(self, order_book, trade_flow):
        volume_consistency = self.analyze_volume_patterns(trade_flow)
        spread_quality = self.measure_spread_tightness(order_book)
        volatility_buffer = 1.0 / (1.0 + self.calculate_HVI())
        
        return volume_consistency * spread_quality * volatility_buffer
