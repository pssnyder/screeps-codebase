# Tips  

This page lists some of the tips listed on the "Tip of the day:" popup, as well as additional information.

## Scripting and CPU  

- You can output HTML content to the console, like links to rooms.
- Use loop architecture to save CPU on the logic you do not have to run each tick.
- Modular architecture of a script will allow easy testing of individual functions in the simulator.
- Your CPU Limit depends on your Global Control Level.
- Set up a grunt task to write scripts on your local machine and commit them to Screeps.
- To output an object content into the console, use JSON.stringify.
- You can address from your script only those rooms that contain your creeps or structures
- require spends CPU depending on the size and complexity of the module loaded.
- Each game action has a constant cost of 0.2 CPU.
- Unless you use up your CPU limit each tick, it is stored for future use. This is called the bucket.
- The creep memory is saved upon death, so clear Memory.creeps.* to prevent overflowing.
- The more small objects in the Memory, the more CPU spent on its parsing.
- A good way to save CPU is caching often-used paths.
- Increasing the reusePath option in the Creep.moveTo method helps saving CPU.
- You can use more CPU than your CPU limit allows in short bursts.
- If CPU limit raises, your script will execute only partially.
- Use branches to test and debug your temporary code and also do backups.
- To save your CPU, use less creeps of a larger size.
- Use try/catch blocks in right places to avoid a complete halt of your script due to errors.

## Gameplay  

- Send emails to yourself with the function Game.notify to be aware of everything happening in the game.
- Bulk sending of emails can be set in Account Management
- Test various game scenarios in the simulator in order to be prepared for surprises.
- The Game.notify function automatically groups identical messages using the specified interval..
- It is too costly and senseless to maintain an army of military creeps in the peacetime.
- Respawning in a chosen room would automatically destroy all structures except walls and roads.
- You can create any objects in the simulator to test your script.
- You cannot have more than 3 rooms in the Novice Area.
- Always try to control as many rooms as your GCL allows. It will allow your colony to develop at the maximum speed.
- The game is fully recorded, so you can see replay of any room for the past several days.
- Dead body parts have weight and generate fatigue as well.
- A creep can execute some commands simultaneously in one tick, for examplemove+build+dropEnergy.
- Roads wear out as they are used, so don’t forget to repair them.
- To prevent other players from seizing a neutral room you want, useCreep.reserveController.
- Use links to save on creep building and CPU.
- You can apply transfer and heal to another player’s creep, and transfer, build andrepair to others’ structures.
- Use Room.energyAvailable and Room.energyCapacityAvailable to determine how much energy all the spawns and extensions in the room contain.
- You can speed up downgrading of hostile room controller by using Creep.claimControlleron it.
- Ramparts can be built not just on empty squares but on existing structures too.
- Walls and roads don’t belong to any player, so they should be searched with the help ofFIND_STRUCTURES, not FIND_MY_STRUCTURES.
- Observers allow to get the Room object for the rooms that have no objects of yours.
- You can build and repair roads in any rooms, even neutral ones.
- Build roads to save on MOVE body parts of your creeps.
- Creeps can miss each other if they walk towards each other simultaneously or follow step by step.
- The more spawn extensions in a room, the more energy you can spend on building one creep.
- Energy in a storage can not be used to spawn creeps. Transfer it to a spawn or extensions instead.
- The RANGED_ATTACK body part is 2 times weaker than ATTACK and 2 times costlier at that.
- Towers can aim at any object in a room even through walls and obstacles.
- A resource abandoned on the ground eventually vanishes.
- More spawns in a room allows building more creeps at a time.
- While not destroyed, a rampart protects a creep or building on its square from any type of attack.
- Spawn extensions capacity increases on room levels 7 and 8.
- Creeps cannot move faster than 1 square per tick.
- Walking over swamps is 5 times slower compared to plain land.
- Power banks appear only in neutral rooms that divide living sectors on the map.
- A tower’s effectiveness depends on the distance to the target.
- Use towers to set up automatic defense of your room.
- Sources in neutral rooms have reduced capacity. Reserve or claim the room to restore it to full capacity.
- Links can pass energy to other links at any point inside the same room.
- A spawn automatically replenishes itself with power until the energy in the room reaches 300 units.
- Leaderboards reset to zero each month, while your game process continues.
- The console.log function of the simulator displays a live expandable object in the browser console.
- A creep with an ATTACK part automatically strikes back at every attacker by ATTACK
- Roads wear out as they are used, so don’t forget to repair them.
- Spawn extensions do not have to be placed near spawns, their range is the whole room.
- Ramparts and walls initially have 1 hit point. Repair them after construction.
- If you want to play from scratch, you can always Respawn in a new room.
- Use storage to not lose surplus of mined resources.
- To control a room continuously, you need to upgrade your controller from time to time.
- Every creep dies after 1500 ticks, however you can prolong its life using the Spawn.renewCreep method.