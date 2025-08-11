---
title: Portfolio
noindex: "true"
comments: "false"
---

<img src="https://avatars.githubusercontent.com/u/12347255?v=4" width=100 alt="Header">

I'm **Wen Taichi**, a Unity game developer with **10 years of professional experience**, primarily focused on small to mid-sized projects. I typically handle system architecture and general features, such as core gameplay, UI, and custom editor tools. I also manage Git repositories and often take on responsibilities like technical research, solution design, and mentoring junior engineers.

Feel free to reach out if you're interested in working with me, whether for commercial work or indie projects, or just want to have a conversation!
- [GitHub](https://github.com/daleth90)
- [LinkedIn](https://www.linkedin.com/in/wentaichi/)
- [Bluesky](https://bsky.app/profile/daleth90.bsky.social)

-----

## Professional Works

### (FANIMAX) Cyber Parkour

![[cyber_parkour_gameplay.gif|500]]

- Developed a 2D platformer racing battle mobile game with Unity and Fusion
- Implemented backend with PlayFab and Azure Functions
- Responsible for overall system architecture design and implementation
- Created a custom skill editor tool
- Collaborated with designers to structure AI behavior tree rule
- Mentored junior engineers on programming best practices and architecture
- Managed resource updates and bundling rules with Addressables
- Designed release pipelines and version branching for Google Play and Apple App Store

-----

### (IGG) Myth Saga

![[myth_saga_1.jpg|200]] ![[myth_saga_2.jpg|200]] ![[myth_saga_3.jpg|200]]

- Developed a service-based mobile RPG using Unity
- Responsible for all client-side features of the auto-grinding/loot system, including AI and socket middleware integration
- Implemented all client-side features of the guild territory war system
- Developed and maintained various core features commonly found in live-service mobile games

-----

### (FANIMAX) ProjectMD

![[projectmd_gameplay.gif|200]]

- Developed a 2D turn-based mobile game with Unity
- Responsible for overall system architecture design and implementation
- Built a custom skill editor tool
- Established workflows with Addressables
- Wrote Google Apps Script to convert game data from Google Sheets to game-ready data  
- Developed a fixed-point math library, to resolve floating-point precision issues in network communication
- Wrote batch scripts to deploy servers and upload builds to AWS EC2

-----

### (UDREAM) League of Angels M

![[league_of_angels_m_1.jpg|200]] ![[league_of_angels_m_2.jpg|200]]

- Developed and maintained the mobile service game (RPG)  
- Implemented gameplay features with Lua at client and Go at server

-----

### (VAR LIVE) Over Kill

![[over_kill_0.jpg|200]] ![[over_kill_1.jpg|200]] ![[over_kill_2.jpg|200]] ![[over_kill_3.jpeg|200]]

- VR multiplayer shooting game
- Developed game server logic with Java  
- Implemented the 3D space and collision detection and wrote their unit tests with Java  
- Handled pathfinding with recast4j  
- Implemented the battlefield rendering with LWJGL on the game server for debugging.
- Re-implemented the AI tool from C# into Java, and let designers use the same data.

-----

### (VAR LIVE) Asset Manager

- Resource management and update tool with AssetBundle

-----

### (VAR LIVE) Excel Exporter

- My first attempt at creating an Excel-based data table tool.
- The feature design was poor—lacking essential capabilities, and existing ones were unintuitive to use.

-----

### (VAR LIVE) Network Hub

- Developed a networking package for all in-house game projects, since all projects in company required networking.
- The package was designed to be independent of Unity, since some applications were not built with Unity.
- Implemented state synchronization using unordered UDP, and transmitted events via TCP, using C#.

-----
### (VAR LIVE) Horror Hospital

![[horror_hospital_0.jpg|200]] ![[horror_hospital_1.jpg|200]] ![[horror_hospital_2.jpg|200]]

- VR horror game, with simple interactive mechanics.
- Integrated Leap Motion to track players' hand positions and gestures.

-----

### (VAR LIVE) Zombie Jail 2

![[zombie_jail_2_3.jpg|250]] ![[zombie_jail_2_4.jpg|150]]

- VR multiplayer co-op shooting game, developed as a sequel.

-----

### (VAR LIVE) City Hero

![[city_hero_0.jpg|200]]

- VR multiplayer co-op shooting game, target to children.
- Based on _Zombie Jail_, but with a wider variety of weapon behaviors.
- Destructible environment elements.

-----

### (VAR LIVE) Zombie Jail

![[zombie_jail_0.jpg|200]] ![[zombie_jail_1.png|200]] ![[zombie_jail_2.jpg|200]]

- VR Multiplayer co-op shooting game with HTC VIVE.
- Integrated NodeCanvas to allow designers to create enemy spawn and event sequences via visual flowcharts.
- Implemented basic dismemberment mechanics.

-----

### (SAINT-FUN) LALALA Bowling

![[lalalabowling_0.png|200]] ![[lalalabowling_1.png|200]] ![[lalalabowling_2.png|200]]

- Arcade game for children, using two infrared sensors to detect the ball's entry point.
- Took over a project where over 90% of the classes were implemented as singletons, and refactored it into a maintainable architecture.
- Reimplemented the Unity plugin which is for communication with hardware devices. 
- Due to hardware limitations, performed targeted performance optimizations to ensure a stable 60 FPS runtime over 24 hours.

-----

## Side Projects

### Flexi

<img src="https://repository-images.githubusercontent.com/515648023/56576bac-cdbc-4b1f-8a2e-f02c98251a83" width=500 alt="Flexi Cover">

[PhysaliaStudio/Flexi: Unity Gameplay Ability System Framework](https://github.com/PhysaliaStudio/Flexi)

This is a general-purpose framework I developed for games that require complex skill systems. While the setup may be a bit involved, it saves me from having to rewrite the low-level logic in the future.

Except a few prototypes built by myself, the framework has also been validated in a commercial project, and I received feedback and made adjustments. Although there's still room to refine the architecture and API, the current version has already saved me significant time when building combat systems.

- Customizable effect nodes
- Built-in node editor with Unity GraphView
- Built-in LIFO queue and tick-based logic
- RPG-style stat calculation

-----

### ExcelDataExporter

[PhysaliaStudio/ExcelDataExporter](https://github.com/PhysaliaStudio/ExcelDataExporter)

Just a data table tool for Excel.

- Supports defining classes, structs, and enums directly in Excel, with code generation
- Outputs to ScriptableObject or JSON formats
- Access data via C# API