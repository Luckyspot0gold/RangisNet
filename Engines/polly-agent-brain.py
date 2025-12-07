#!/usr/bin/env python3
"""
RangisNet Polly-Based Agent Brain
Autonomous trading agent with spend limits and PRM scoring

Agent Capabilities:
- Negotiate trades based on PRM confidence
- Enforce weekly/monthly/yearly spend limits
- Sign transactions via IBP wallet
- Send ICM warps with sensory feedback
- Learn from market harmonic patterns

Dec 2025 - Hack2Build x402
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import asyncio

# Polly AI SDK (mock for development - replace with actual SDK)
class PollyAI:
    """Polly-based agent reasoning engine"""
    
    def __init__(self, agent_id: str, personality: str = "conservative"):
        self.agent_id = agent_id
        self.personality = personality
        self.decision_history: List[Dict] = []
        
    async def analyze_trade(self, market_data: Dict) -> Dict:
        """Analyze trade opportunity using PRM scoring"""
        prm_score = market_data.get('prm_score', 0.5)
        harmonic_freq = market_data.get('harmonic_freq', 432)
        
        # Decision logic based on personality
        thresholds = {
            'aggressive': 0.60,
            'moderate': 0.75,
            'conservative': 0.85
        }
        
        min_confidence = thresholds.get(self.personality, 0.75)
        
        decision = {
            'should_trade': prm_score >= min_confidence,
            'confidence': prm_score,
            'reasoning': self._generate_reasoning(prm_score, min_confidence),
            'harmonic_alignment': harmonic_freq in [432, 528, 639],
            'timestamp': datetime.now().isoformat()
        }
        
        self.decision_history.append(decision)
        return decision
    
    def _generate_reasoning(self, prm_score: float, threshold: float) -> str:
        """Generate human-readable reasoning"""
        if prm_score >= threshold:
            return f"PRM score {prm_score:.2f} exceeds {self.personality} threshold {threshold:.2f}. Market harmonics aligned. Recommend trade."
        else:
            return f"PRM score {prm_score:.2f} below {self.personality} threshold {threshold:.2f}. Market volatility detected. Wait for clarity."
    
    async def negotiate_price(self, current_price: float, target_price: float) -> Dict:
        """Negotiate optimal entry price"""
        spread = abs(target_price - current_price) / current_price
        
        if spread < 0.01:  # Within 1%
            return {
                'action': 'accept',
                'price': current_price,
                'reasoning': 'Price within acceptable range'
            }
        elif spread < 0.05:  # Within 5%
            return {
                'action': 'counter',
                'price': (current_price + target_price) / 2,
                'reasoning': 'Propose mid-point negotiation'
            }
        else:
            return {
                'action': 'reject',
                'price': None,
                'reasoning': 'Spread too wide - wait for better entry'
            }


class SpendLimitManager:
    """Enforce weekly/monthly/yearly spend limits"""
    
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.limits = {
            'daily': 10.0,      # $10/day
            'weekly': 50.0,     # $50/week
            'monthly': 200.0,   # $200/month
            'yearly': 2000.0    # $2000/year
        }
        self.spending = {
            'daily': 0.0,
            'weekly': 0.0,
            'monthly': 0.0,
            'yearly': 0.0
        }
        self.last_reset = {
            'daily': datetime.now(),
            'weekly': datetime.now(),
            'monthly': datetime.now(),
            'yearly': datetime.now()
        }
    
    def check_limit(self, amount: float) -> Dict:
        """Check if trade amount is within limits"""
        self._reset_periods()
        
        violations = []
        for period in ['daily', 'weekly', 'monthly', 'yearly']:
            if self.spending[period] + amount > self.limits[period]:
                violations.append({
                    'period': period,
                    'limit': self.limits[period],
                    'current': self.spending[period],
                    'requested': amount,
                    'available': self.limits[period] - self.spending[period]
                })
        
        if violations:
            return {
                'approved': False,
                'violations': violations,
                'message': f"Spend limit exceeded for: {', '.join([v['period'] for v in violations])}"
            }
        
        return {
            'approved': True,
            'violations': [],
            'message': 'Trade within all spend limits'
        }
    
    def record_spend(self, amount: float):
        """Record completed trade"""
        self._reset_periods()
        for period in self.spending:
            self.spending[period] += amount
    
    def _reset_periods(self):
        """Reset spending counters based on time periods"""
        now = datetime.now()
        
        # Daily reset
        if (now - self.last_reset['daily']).days >= 1:
            self.spending['daily'] = 0.0
            self.last_reset['daily'] = now
        
        # Weekly reset
        if (now - self.last_reset['weekly']).days >= 7:
            self.spending['weekly'] = 0.0
            self.last_reset['weekly'] = now
        
        # Monthly reset
        if (now - self.last_reset['monthly']).days >= 30:
            self.spending['monthly'] = 0.0
            self.last_reset['monthly'] = now
        
        # Yearly reset
        if (now - self.last_reset['yearly']).days >= 365:
            self.spending['yearly'] = 0.0
            self.last_reset['yearly'] = now
    
    def get_status(self) -> Dict:
        """Get current spending status"""
        self._reset_periods()
        return {
            'limits': self.limits,
            'spending': self.spending,
            'available': {
                period: self.limits[period] - self.spending[period]
                for period in self.limits
            }
        }


class RangisAgent:
    """Complete Mighty Agent with Polly brain and spend limits"""
    
    def __init__(self, agent_id: str, personality: str = "moderate"):
        self.agent_id = agent_id
        self.polly = PollyAI(agent_id, personality)
        self.spend_manager = SpendLimitManager(agent_id)
        self.wallet_address: Optional[str] = None
        self.trade_history: List[Dict] = []
        
    async def connect_wallet(self, ibp_wallet_address: str):
        """Connect IBP wallet for payments"""
        self.wallet_address = ibp_wallet_address
        print(f"✅ Agent {self.agent_id} connected to IBP wallet: {ibp_wallet_address[:10]}...")
    
    async def evaluate_trade(self, market_data: Dict) -> Dict:
        """Full trade evaluation pipeline"""
        
        # Step 1: Polly analysis
        decision = await self.polly.analyze_trade(market_data)
        
        if not decision['should_trade']:
            return {
                'status': 'rejected',
                'reason': decision['reasoning'],
                'agent': self.agent_id
            }
        
        # Step 2: Check spend limits
        trade_amount = market_data.get('amount', 0.01)
        limit_check = self.spend_manager.check_limit(trade_amount)
        
        if not limit_check['approved']:
            return {
                'status': 'blocked',
                'reason': limit_check['message'],
                'violations': limit_check['violations'],
                'agent': self.agent_id
            }
        
        # Step 3: Negotiate price
        current_price = market_data.get('price', 100.0)
        target_price = market_data.get('target_price', current_price)
        negotiation = await self.polly.negotiate_price(current_price, target_price)
        
        if negotiation['action'] == 'reject':
            return {
                'status': 'rejected',
                'reason': negotiation['reasoning'],
                'agent': self.agent_id
            }
        
        # Step 4: Execute trade
        return {
            'status': 'approved',
            'action': 'BUY',
            'amount': trade_amount,
            'price': negotiation['price'],
            'confidence': decision['confidence'],
            'harmonic_freq': market_data.get('harmonic_freq', 528),
            'haptic_pattern': self._generate_haptic(decision['confidence']),
            'agent': self.agent_id,
            'timestamp': datetime.now().isoformat()
        }
    
    def _generate_haptic(self, confidence: float) -> List[int]:
        """Generate haptic pattern based on confidence"""
        if confidence >= 0.9:
            return [111, 0, 111, 0, 111]  # Strong triple pulse
        elif confidence >= 0.75:
            return [50, 0, 100, 0, 50]    # Medium pulse
        else:
            return [30, 0, 30]             # Gentle pulse
    
    async def execute_trade(self, trade_decision: Dict):
        """Execute trade with ICM warp"""
        if trade_decision['status'] != 'approved':
            print(f"❌ Trade not approved: {trade_decision.get('reason')}")
            return
        
        # Record spend
        self.spend_manager.record_spend(trade_decision['amount'])
        
        # Log trade
        self.trade_history.append(trade_decision)
        
        print(f"✅ Agent {self.agent_id} executed trade:")
        print(f"   Amount: ${trade_decision['amount']}")
        print(f"   Price: ${trade_decision['price']:.2f}")
        print(f"   Confidence: {trade_decision['confidence']:.2%}")
        print(f"   Harmonic: {trade_decision['harmonic_freq']}Hz")
        print(f"   Haptic: {trade_decision['haptic_pattern']}")
    
    def get_stats(self) -> Dict:
        """Get agent performance stats"""
        total_trades = len(self.trade_history)
        total_spent = sum(t.get('amount', 0) for t in self.trade_history)
        avg_confidence = sum(t.get('confidence', 0) for t in self.trade_history) / total_trades if total_trades > 0 else 0
        
        return {
            'agent_id': self.agent_id,
            'total_trades': total_trades,
            'total_spent': total_spent,
            'avg_confidence': avg_confidence,
            'spend_limits': self.spend_manager.get_status(),
            'personality': self.polly.personality
        }


# Demo usage
async def demo_agent():
    """Demo Mighty Agent in action"""
    
    print("🤖 RangisNet Mighty Agent Demo")
    print("=" * 50)
    print()
    
    # Create agent
    agent = RangisAgent(
        agent_id="polly-trader-001",
        personality="moderate"
    )
    
    # Connect wallet
    await agent.connect_wallet("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
    print()
    
    # Simulate market data with PRM scoring
    market_scenarios = [
        {
            'pair': 'AVAX/USD',
            'price': 42.50,
            'target_price': 42.75,
            'amount': 0.01,
            'prm_score': 0.92,
            'harmonic_freq': 528
        },
        {
            'pair': 'AVAX/USD',
            'price': 42.80,
            'target_price': 43.00,
            'amount': 0.01,
            'prm_score': 0.65,
            'harmonic_freq': 432
        },
        {
            'pair': 'AVAX/USD',
            'price': 43.20,
            'target_price': 43.25,
            'amount': 0.01,
            'prm_score': 0.88,
            'harmonic_freq': 528
        }
    ]
    
    # Evaluate each scenario
    for i, scenario in enumerate(market_scenarios, 1):
        print(f"📊 Scenario {i}: {scenario['pair']} @ ${scenario['price']}")
        print(f"   PRM Score: {scenario['prm_score']:.2%}")
        print()
        
        decision = await agent.evaluate_trade(scenario)
        
        if decision['status'] == 'approved':
            await agent.execute_trade(decision)
        else:
            print(f"❌ Trade rejected: {decision['reason']}")
        
        print()
        time.sleep(1)
    
    # Show stats
    print("=" * 50)
    print("📈 Agent Performance Stats:")
    stats = agent.get_stats()
    print(json.dumps(stats, indent=2))


if __name__ == "__main__":
    asyncio.run(demo_agent())
