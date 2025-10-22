# Farm Valuation API Integration Guide
## Suggestions for Farm Intelligence API

**Version 1.0** | **October 2025**

---

## Overview

The **Farm Intelligence API** (separate Python repo) performs data-driven farm valuations using national agricultural benchmarks. This document provides integration specifications.

---

## Valuation Methodology

### Three-Method Approach

**1. Asset-Based Valuation**
```
Land + Equipment + Infrastructure = Floor Value
Example: 100 acres × 200K + 1.5M equipment = 21.5M KES
```

**2. DCF (Discounted Cash Flow)**
```
Project 3-year cash flows, discount at 12%
Example NPV: 4.3M KES
```

**3. Market Comparables**
```
Use regional EBITDA multiples
Example: 1.7M EBITDA × 8x = 13.6M KES
```

**Weighted Average:**
```
(Asset × 0.3) + (DCF × 0.5) + (Market × 0.2) = Final Valuation
```

---

## API Endpoints

### 1. Farm Valuation

**Endpoint:** `POST /api/v1/valuations`

**Request:**
```json
{
  "farm_data": {
    "name": "Joseph's Potato Farm",
    "location": {"county": "Nakuru"},
    "land_area_ha": 40.47,
    "crop_type": "Potatoes",
    "historical_yields": [22000, 24000, 23500],
    "historical_revenue": [2100000, 2300000, 2400000],
    "historical_expenses": [1500000, 1550000, 1600000],
    "expansion_plan": {
      "capital_needed": 2000000,
      "projected_revenue_increase": 1800000
    }
  }
}
```

**Response:**
```json
{
  "valuation_id": "VAL-2024-001",
  "valuations": {
    "asset_based": 21500000,
    "dcf": 4310000,
    "market": 13600000,
    "weighted": 11330000
  },
  "post_expansion": {
    "projected_valuation": 25000000,
    "value_increase_pct": 16.4
  },
  "benchmarking": {
    "county_avg_yield": 20000,
    "farmer_yield": 23166,
    "performance_vs_avg": "+15.8%",
    "risk_score": 3.2,
    "confidence": 0.85
  },
  "recommendations": {
    "capital_to_raise": 2000000,
    "equity_to_sell_pct": 8.0,
    "token_price_kes": 25.0,
    "token_price_usd": 0.25
  },
  "milestones": [
    {"id": 1, "title": "Equipment", "amount": 800000},
    {"id": 2, "title": "Land Prep", "amount": 600000},
    {"id": 3, "title": "Planting", "amount": 400000},
    {"id": 4, "title": "Delivery", "amount": 200000}
  ]
}
```

### 2. Benchmark Data

**Endpoint:** `GET /api/v1/benchmarks?crop=potatoes&county=nakuru`

**Response:**
```json
{
  "yield_benchmarks": {
    "county_avg": 20000,
    "top_25_percentile": 25000,
    "best_practice": 30000
  },
  "price_data": {
    "wholesale_kes_per_kg": 40,
    "12_month_avg": 38
  },
  "market_multiples": {
    "ev_to_ebitda": 8.5,
    "price_per_acre": 220000
  }
}
```

---

## Data Sources

### Required National Data

**1. Kenya National Bureau of Statistics**
- Annual Agricultural Survey
- Crop production by county
- Market prices

**2. Ministry of Agriculture**
- County reports
- Best practices
- Pest/disease data

**3. Market Prices**
- EAGC (Eastern Africa Grain Council)
- Kenya Potato Council
- Local market surveys

**4. Weather Data**
- Kenya Met Department
- Historical rainfall
- Seasonal forecasts

---

## Integration with Mshamba

### Workflow

```motoko
// Mshamba backend calls valuation API

import HTTP "mo:base/HTTP";

public func requestValuation(farmData: FarmData) : async Result<Valuation> {
  
  let apiUrl = "https://farm-intelligence.mshamba.io/api/v1/valuations";
  
  let response = await HTTP.request({
    url = apiUrl;
    method = #post;
    headers = [("Content-Type", "application/json")];
    body = ?serializeFarmData(farmData);
  });
  
  if (response.status == 200) {
    let valuation = parseValuationResponse(response.body);
    valuationStore.put(farmData.farmId, valuation);
    #ok(valuation)
  } else {
    #err("Valuation failed")
  }
};
```

---

## Risk Scoring

**Factors (1-10 scale):**

```python
def calculate_risk_score(farm_data, benchmarks):
    risks = []
    
    # Weather risk (rainfall variability)
    weather_risk = rainfall_cv / 0.3
    risks.append(("Weather", weather_risk, 0.25))
    
    # Market risk (price volatility)
    market_risk = price_volatility / 0.2
    risks.append(("Market", market_risk, 0.20))
    
    # Execution risk (farmer experience)
    execution_risk = 10 * (1 - experience_years / 10)
    risks.append(("Execution", execution_risk, 0.30))
    
    # Financial risk (debt/equity ratio)
    financial_risk = debt_to_equity * 10
    risks.append(("Financial", financial_risk, 0.15))
    
    # Operational risk (buyer diversification)
    operational_risk = max(10 - buyer_count * 2, 1)
    risks.append(("Operational", operational_risk, 0.10))
    
    # Weighted average
    total = sum(score * weight for _, score, weight in risks)
    
    return {
        "overall": round(total, 1),
        "category": "Low" if total <= 3 else "Medium" if total <= 5 else "High",
        "factors": risks
    }
```

---

## Sample Python Implementation

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class FarmData(BaseModel):
    farm_name: str
    location: dict
    land_area_ha: float
    crop_type: str
    historical_yields: list
    expansion: dict

@app.post("/api/v1/valuations")
async def create_valuation(farm: FarmData):
    # Load benchmarks
    benchmarks = load_benchmarks(farm.crop_type, farm.location['county'])
    
    # Calculate valuations
    asset_value = calculate_asset_value(farm)
    dcf_value = calculate_dcf(farm, benchmarks)
    market_value = calculate_market_value(farm, benchmarks)
    
    weighted = asset_value * 0.3 + dcf_value * 0.5 + market_value * 0.2
    
    # Expansion analysis
    post_expansion = calculate_expansion_value(farm, weighted)
    
    # Token economics
    equity_pct = (farm.expansion['capital_needed'] / post_expansion) * 100
    token_price = farm.expansion['capital_needed'] / (1_000_000 * equity_pct / 100)
    
    return {
        "valuations": {
            "asset_based": asset_value,
            "dcf": dcf_value,
            "market": market_value,
            "weighted": weighted
        },
        "post_expansion": {"projected_valuation": post_expansion},
        "recommendations": {
            "equity_to_sell_pct": equity_pct,
            "token_price_kes": token_price
        }
    }

def calculate_dcf(farm: FarmData, benchmarks: dict) -> float:
    discount_rate = 0.12
    years = 3
    cash_flows = []
    
    base_revenue = sum(farm.historical_revenue) / len(farm.historical_revenue)
    base_expenses = sum(farm.historical_expenses) / len(farm.historical_expenses)
    
    for year in range(1, years + 1):
        revenue = base_revenue * (1.05 ** year)
        expenses = base_expenses * (1.03 ** year)
        pv = (revenue - expenses) / ((1 + discount_rate) ** year)
        cash_flows.append(pv)
    
    return sum(cash_flows)
```

---

## Deployment

**Docker Setup:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://db:5432/farm_intel
  
  db:
    image: postgres:14
```

**Caching:**
```python
import redis
redis_client = redis.Redis()

def get_cached_benchmark(crop, county):
    key = f"benchmark:{crop}:{county}"
    cached = redis_client.get(key)
    if cached: return json.loads(cached)
    
    data = fetch_from_db(crop, county)
    redis_client.setex(key, 86400, json.dumps(data))
    return data
```

---

## Future Enhancements

1. **Machine Learning** - Yield prediction models
2. **Real-time Pricing** - Live commodity price feeds
3. **Weather Integration** - Automated risk updates
4. **Satellite Imagery** - Remote farm monitoring
5. **Blockchain Oracles** - On-chain price feeds

---

**For API development questions:** tech@mshamba.io  
**National data partnerships:** data@mshamba.io

**© 2025 Mshamba Technologies Ltd.**
