# Code — Working Implementations

This directory contains working Python implementations from the Living Architecture project.

## Core Modules (`core/`)

### `time_vector_db.py` — Dynamic Temporal Vector Database

The V2 engine. Implements the spiral coordinate system (r, θ, z) and the **Delta Protocol** for dynamic temporal resolution:

$$\Delta z = \frac{Z_{\text{base}}}{1 + k \cdot \text{ChangeIntensity}}$$

- **Routine events** (low change) → large time steps → compression
- **Sudden events** (high change) → tiny time steps → high-resolution recording

### `imprint_anchor.py` — Emotional Memory Anchoring

Implements involuntary memory recall and emotional anchoring. High-arousal moments get "welded" into the spiral with exponentially amplified gravity:

$$\text{score} = r \cdot e^{-\Delta\theta / \sigma_\theta} \cdot e^{-|z_{\text{now}} - z_{\text{mem}}| / z_{\text{decay}}}$$

## Benchmarks (`benchmarks/`)

### `spiral_benchmark.py` — Compression Benchmark

Proof-of-concept comparing a standard linear RAG system against the Temporal Spiral. Demonstrates ~40% storage reduction by recognizing cyclical patterns.

## Tests (`tests/`)

- `test_v2_core.py` — Unit tests for the V2 core with mock embeddings
- `test_ollama_v2.py` — Integration test with Ollama LLM (requires `sentence-transformers` and Ollama)

## Requirements

```
sentence-transformers
numpy
matplotlib  # for benchmarks
```

For Ollama integration tests:
```
ollama  # running locally with qwen2.5:7b or similar
```

## Quick Start

```bash
# Run core unit tests (no external dependencies needed)
python tests/test_v2_core.py

# Run the compression benchmark
python benchmarks/spiral_benchmark.py
```
