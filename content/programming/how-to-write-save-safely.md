---
title: 如何安全的寫入存檔？
---

因為軟體的寫入檔案的過程中，可能會碰到程式立即停止的狀況，導致寫入中斷，而且這些狀況大多不是工程師可避免的，例如：程式崩潰、使用者手動停止、電源斷電……等等。如果我們在為玩家寫入存檔時，是直接對原本的存檔進行覆寫的話，就有可能因為這些狀況，導致存檔損壞。

## 解決方案

1. 先寫到某個暫存用的檔案，例如：`gamesave.dat.tmp`。這樣即使寫入中斷，也不會毀壞原本的存檔。
2. 使用 `File.Move()` 移動並覆蓋正式存檔。這個 API 在這個使用情境下是==原子性==的，不會中斷，只會完全成功或完全失敗。
3. 若是採取自動存檔，以防萬一，也可以管理大約 3\~5 個近期存檔，例如：`gamesave_0.dat`\~`gamesave_2.dat`。這樣做也避免了程式在寫入的過程中真的出現問題時，玩家完全遺失進度的狀況。在這個做法若要保持原子性，要注意不是把所有存檔都 Move 一遍，而是直接找出最舊的存檔格來覆蓋，而讀取的時候直接讀取最新的存檔格。

```csharp
// Note: GameData should be [Serializable]
public void SaveGameData(GameData data)
{
    string savePath = Path.Combine(Application.persistentDataPath, "gamesave.dat");
    string tempPath = savePath + ".tmp";

    // Write to temp file first
    // Important: Though this is just an example, but BinaryFormatter is obsolete in future .NET version. Consider using other binary format.
    using (var fs = new FileStream(tempPath, FileMode.Create))
    {
        var bf = new BinaryFormatter();
        bf.Serialize(fs, data);
    }

    // Atomic rename
    try
    {
        File.Move(tempPath, savePath);
    }
    catch (Exception ex)
    {
        Debug.Error("Move file failed!");
    }
}
```
