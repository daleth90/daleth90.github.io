---
title: Flexi
---

[<img src="https://repository-images.githubusercontent.com/515648023/56576bac-cdbc-4b1f-8a2e-f02c98251a83" alt="Flexi Cover">](https://github.com/PhysaliaStudio/Flexi)

[PhysaliaStudio/Flexi: Unity Gameplay Ability System Framework](https://github.com/PhysaliaStudio/Flexi)

這是我為了需要複雜技能編輯的遊戲製作的通用框架。雖然前期設置可能複雜了點，但對我工程師來說，以後我就不用再寫一次差不多的底層邏輯了。

經過一次商業開發的驗證，獲得了反饋並調整，雖然一些架構和 API 可能可以再優化，不過功能上目前我自己使用起來蠻有信心的。

- 可以自定義效果節點
- 使用 GraphView 內建節點編輯器
- 內建 LIFO-Queue 與 Tick 運作的效果處理
- 內建 RPG 式的 Stat 計算邏輯

另外這個框架目前只支援純回合制，或是不依賴角色動畫演出的類型。  
如果需要支援角色動畫演出，那還需要額外做個動作編輯器來整合。  
這個也是想做但還沒做的工具。

![Flexi Editor](https://raw.githubusercontent.com/wiki/PhysaliaStudio/Flexi/images/flexi-editor.gif)
![Card Game Sample](https://raw.githubusercontent.com/wiki/PhysaliaStudio/Flexi/images/card-game-samples-1.gif)
