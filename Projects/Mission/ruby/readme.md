You will be responsible for conducting the flight into low earth orbit:
1. Travel Distance: 160 kilometers
2. Payload capacity: 50,000 kilograms including rocket itself
3. Fuel capacity: 1,514,100 liters of fuel, already included in the payload total
4. Burn rate: 168,233 liters per minute
5. Average speed: 1500 kilometers/hr

The rocket launch system is comprised of 4 stages, which must happen in this precise order:
1. Enable stage 1 afterburner
2. Disengaging release structure
3. Cross-checks
4. Launch

Active mission controls:
1. Manually transition between launch stages in the expected order
2. Mission control should be able to safely abort launch after stage 1 and retry
3. One in every 3rd launch will require an abort and retry after stage 1, randomize when it actually happens
4. One in every 5th launch will explode, randomize when it actually happens

Necessary instrumentation information to be provided at the end of each mission:
1. Total distance traveled (if aborted this would be 0, if exploded, pick a random spot in the timeline).
2. Total travel time (same as above)

Final Summary to be provided at end of all attempted missions:
1. Total distance traveled (for all missions combined)
2. Number of abort and retries (for all missions combined)
3. Number of explosions (for all missions combined)
4. Total fuel burned (for all missions combined)
5. Total flight time (for all missions combined)

Sample Session:
Welcome to Mission Control!
Mission plan:
  Travel distance:  160.0 km
  Payload capacity: 50,000 kg
  Fuel capacity:    1,514,100 liters
  Burn rate:        168,240 liters/min
  Average speed:    1,500 km/h
  Random seed:      12
What is the name of this mission? Minerva
Would you like to proceed? (Y/n) Y
Engage afterburner? (Y/n) Y
Afterburner engaged!
Release support structures? (Y/n) Y
Support structures released!
Perform cross-checks? (Y/n) Y
Cross-checks performed!
Launch? (Y/n) Y
Launched!
Mission status:
  Current fuel burn rate: 151,416 liters/min
  Current speed: 1,350 km/h
  Current distance traveled: 12.5 km
  Elapsed time: 0:00:30
  Time to destination: 0:05:54
Mission status:
  Current fuel burn rate: 153,098 liters/min
  Current speed: 1,365 km/h
  Current distance traveled: 24.82 km
  Elapsed time: 0:01:00
  Time to destination: 0:05:27

(...)

Mission status:
  Current fuel burn rate: 164,875 liters/min
  Current speed: 1,470 km/h
  Current distance traveled: 137.34 km
  Elapsed time: 0:05:30
  Time to destination: 0:00:55
Mission status:
  Current fuel burn rate: 154,780 liters/min
  Current speed: 1,380 km/h
  Current distance traveled: 149.93 km
  Elapsed time: 0:06:00
  Time to destination: 0:00:25
Mission summary:
  Total distance traveled: 160.36 km
  Number of abort and retries: 0/0
  Number of explosions: 0
  Total fuel burned: 1,079,091 liters
  Flight time: 0:06:25
Would you like to run another mission? (Y/n) Y
Mission plan:
  Travel distance:  160.0 km
  Payload capacity: 50,000 kg
  Fuel capacity:    1,514,100 liters
  Burn rate:        168,240 liters/min
  Average speed:    1,500 km/h
  Random seed:      12
What is the name of this mission? Minerva II
Would you like to proceed? (Y/n) Y
Engage afterburner? (Y/n) Y
Afterburner engaged!
Release support structures? (Y/n) Y
Support structures released!
Perform cross-checks? (Y/n) Y
Cross-checks performed!
Launch? (Y/n) Y
Mission aborted!
Mission summary:
  Total distance traveled: 160.36 km
  Number of abort and retries: 1/1
  Number of explosions: 0
  Total fuel burned: 1,079,091 liters
  Flight time: 0:06:25
Would you like to run another mission? (Y/n) n
