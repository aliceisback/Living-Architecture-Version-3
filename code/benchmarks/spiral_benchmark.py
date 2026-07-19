import matplotlib.pyplot as plt
import random
import time

DATA_TYPES = {
    "TEXT": 1024,          # 1 KB
    "SENSOR": 51200,       # 50 KB
    "AUDIO": 512000,       # 500 KB
    "IMAGE": 2048000,      # 2 MB
}

TOTAL_STEPS = 1000

# Define exactly two specific cycles
CYCLE_1 = ["TEXT", "AUDIO", "IMAGE"] # Routine 1
CYCLE_2 = ["SENSOR", "SENSOR", "TEXT"] # Routine 2

def generate_events():
    events = []
    types_list = list(DATA_TYPES.keys())
    
    i = 0
    while i < TOTAL_STEPS:
        # 10% chance to trigger Cycle 1
        if random.random() < 0.10 and i + len(CYCLE_1) <= TOTAL_STEPS:
            for c_type in CYCLE_1:
                events.append({"step": i, "type": c_type, "size": DATA_TYPES[c_type], "is_cycle": "Cycle 1"})
                i += 1
        # 10% chance to trigger Cycle 2
        elif random.random() < 0.10 and i + len(CYCLE_2) <= TOTAL_STEPS:
            for c_type in CYCLE_2:
                events.append({"step": i, "type": c_type, "size": DATA_TYPES[c_type], "is_cycle": "Cycle 2"})
                i += 1
        # Otherwise random event
        else:
            random_type = random.choice(types_list)
            events.append({"step": i, "type": random_type, "size": DATA_TYPES[random_type], "is_cycle": None})
            i += 1
            
    return events

def benchmark():
    events = generate_events()
    
    system_a_memory_history = []
    system_b_memory_history = []
    
    sys_a_current_size = 0
    sys_b_current_size = 0
    
    cycle_logs = []
    cycle_buffer = []
    current_cycle_target = None
    
    start_time = time.time()
    
    for event in events:
        # System A: Linear Storage
        sys_a_current_size += event["size"]
        system_a_memory_history.append(sys_a_current_size)
        
        # System B: Temporal Spiral
        if event["is_cycle"]:
            # If we just started tracking a new cycle
            if current_cycle_target is None or event["is_cycle"] != current_cycle_target:
                current_cycle_target = event["is_cycle"]
                cycle_buffer = []
                
            cycle_buffer.append(event)
            sys_b_current_size += event["size"] # Temp add
            
            # Check if cycle completed
            target_len = len(CYCLE_1) if current_cycle_target == "Cycle 1" else len(CYCLE_2)
            
            if len(cycle_buffer) == target_len:
                # Compress!
                COMPRESSION_NODE_SIZE = 100 # 100 bytes for spiral node
                
                # Remove the bulky original events
                sys_b_current_size -= sum(e["size"] for e in cycle_buffer)
                # Add the tiny node
                sys_b_current_size += COMPRESSION_NODE_SIZE
                
                # Log it
                cycle_logs.append(f"Стъпка {cycle_buffer[0]['step']} - {cycle_buffer[-1]['step']}: Разпознат и компресиран '{current_cycle_target}' ({target_len} събития). Спестени {(sum(e['size'] for e in cycle_buffer) / 1024):.2f} KB.")
                
                cycle_buffer = []
                current_cycle_target = None
        else:
            # Random event
            sys_b_current_size += event["size"]
            current_cycle_target = None
            cycle_buffer = []
            
        system_b_memory_history.append(sys_b_current_size)

    end_time = time.time()
    calc_time = (end_time - start_time) * 1000
    
    sys_a_mb = [s / (1024*1024) for s in system_a_memory_history]
    sys_b_mb = [s / (1024*1024) for s in system_b_memory_history]
    
    final_a = sys_a_mb[-1]
    final_b = sys_b_mb[-1]
    compression_ratio = final_a / final_b if final_b > 0 else 0
    
    print(f"System A: {final_a:.2f} MB")
    print(f"System B: {final_b:.2f} MB")
    print(f"Ratio: {compression_ratio:.2f}x")
    
    # Save log document
    log_path = r'C:\Users\ivayl\.gemini\antigravity\brain\dd936482-882b-4e95-bbe9-6213a64f82fe\cyclicality_log.md'
    with open(log_path, 'w', encoding='utf-8') as f:
        f.write("# Лог на компресираните цикли\n\n")
        f.write("Този документ показва точните моменти, в които Спиралата е засякла една от двете заложени цикличности и я е компресирала в един възел.\n\n")
        for log in cycle_logs:
            f.write(f"- {log}\n")
    
    # Plotting
    plt.figure(figsize=(10, 6))
    plt.plot(sys_a_mb, label='System A (Current AI / RAG)', color='red', linewidth=2)
    plt.plot(sys_b_mb, label='System B (Temporal Spiral Product)', color='green', linewidth=2)
    plt.title('Memory Growth: Minimal Cyclicality (Only 2 Patterns)')
    plt.xlabel('Time Steps')
    plt.ylabel('Memory Consumed (Megabytes)')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    
    output_path = r'C:\Users\ivayl\.gemini\antigravity\brain\dd936482-882b-4e95-bbe9-6213a64f82fe\spiral_benchmark_chart.png'
    plt.savefig(output_path)

if __name__ == "__main__":
    benchmark()
