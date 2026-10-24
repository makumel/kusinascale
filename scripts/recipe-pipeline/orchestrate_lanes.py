"""
Multi-Agent Parallel Orchestrator for KusinaScale (Final Batch 4)
Extracts all remaining items across Google Drive to achieve 100% coverage.
"""

import os
import sys
import subprocess
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

LANES = [
    {
        "id": "final_carinderia_sweep",
        "folders": ["Filipino pork recipes", "Filipino seafood/fish recipes", "Filipino vegetable recipes", "Filipino beef recipes"],
        "limit": 30
    },
    {
        "id": "final_asian_viet_chinese",
        "folders": ["Vietnamese recipes", "Chinese pork recipes", "Chinese Beef Recipes", "Chinese Chicken Recipes"],
        "limit": 30
    },
    {
        "id": "final_western_burgers_seafood",
        "folders": ["American Burgers & Sandwiches", "Italian seafood recipes", "Italian Recipes"],
        "limit": 30
    },
    {
        "id": "final_twist_and_all_remaining",
        "folders": ["Filipino cuisine with a twist", "Filipino(ILOCANO) recipes", "Turkish recipes"],
        "limit": 30
    }
]

def launch_parallel_lanes():
    print("=" * 65)
    print("🚀 LAUNCHING MULTI-LANE PARALLEL RECIPE WORKERS (FINAL SURGE 4)")
    print("=" * 65)

    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "lane_worker.py"))
    processes = []

    for lane in LANES:
        cmd = [
            sys.executable,
            script_path,
            "--lane", lane["id"],
            "--limit", str(lane["limit"]),
            "--folders"
        ] + lane["folders"]

        print(f"[*] Spawning Agent Lane: {lane['id']} -> {len(lane['folders'])} folders")
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="ignore")
        processes.append((lane["id"], p))

    print(f"\n[OK] All {len(processes)} parallel agent workers spawned. Monitoring progress...")

    while any(p.poll() is None for _, p in processes):
        for lane_id, p in processes:
            if p.poll() is None:
                line = p.stdout.readline()
                if line:
                    stripped = line.strip()
                    if "[OK]" in stripped or "Processing:" in stripped or "Folder:" in stripped:
                        print(f"[{lane_id[:14]:<14}] {stripped}")
        time.sleep(0.5)

    print("\n" + "=" * 65)
    print("[OK] All parallel worker lanes have finished their current extraction pass!")
    print("=" * 65)

    # Consolidate all lane output into catalog
    consolidator = os.path.abspath(os.path.join(os.path.dirname(__file__), "consolidate_batches.py"))
    subprocess.run([sys.executable, consolidator], shell=True)

if __name__ == "__main__":
    launch_parallel_lanes()
