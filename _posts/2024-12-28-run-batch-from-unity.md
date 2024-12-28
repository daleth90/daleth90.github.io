---
layout: post
title: 如何從 Unity 執行批次檔 (bat)
tags:
  - c#
  - unity
  - batch
---

通常我們都希望能夠看見 bat 的執行過程。如果你在網路上搜尋 "C# cmd batch keep window" 之類的關鍵字，你會找到很多人教你用 `Process`，並且用 `cmd /k` 取代 `cmd /c` 指令。

<!--more-->

如果你是用 Visual Studio 開發 Console 應用程式的話，`cmd /c` 的功能是在你的小黑窗內使用新的 cmd 環境執行 bat，並且馬上離開該環境。如果你的 bat 有延遲效果的話，你可以從標題上觀察出環境的切換。而 `cmd /k` 則是在新的 cmd 環境執行 bat 完成後，不會離開該環境。但是，我們的環境是 Unity，並不是 Console 應用程式，使用 `Process` 呼叫 cmd 的結果就完全不一樣了。

在各種 GUI 應用程式中，使用 `Process` 呼叫的 `cmd` 指令，不論是 `/c` 或 `/k`，都會在執行完該行後立即結束，甚至你的 batch 內有 `pause` 都沒用。

根據這個[論壇留言](https://superuser.com/a/306215)和這份[微軟文件](https://learn.microsoft.com/en-us/windows/console/closing-a-console)，可能是直接關閉的理由，但我沒有很確定。
> A console is closed when the last process attached to it terminates or calls **FreeConsole**.

### 範例批次檔

注意這個範例需要從 C# 設定環境變數，因此 `UseShellExecute = true` 是完全不可行的選項。

```shell
@echo off
echo Unity Version: %UNITY_VERSION%
echo Another Variable: %ANOTHER_VARIABLE%
pause
```

### start 指令

想出來的方法是，使用第一個等等註定會被結束的 cmd 指令，執行 [start](https://learn.microsoft.com/zh-tw/windows-server/administration/windows-commands/start) 指令產生另外一個獨立的 cmd 視窗，再執行 bat。

寫 bat 相關程式碼時，<mark>一定要考慮到路徑上有空白字元的狀況</mark>，因此路徑得用雙引號 (") 包起來。然而 `start` 指令若碰到雙引號，會把第一組雙引號包覆起來的字串當成視窗標題，所以只能把標題和程式路徑一起設定好。

```csharp
Arguments = $"/c start \"TestProcess\" \"{batFilePath}\""
```

可惜結果差一點，bat 結束後，`start` 開啟的 cmd 視窗不會自己關閉。

```shell
Unity Version: 2021.3.18f1
Another Variable: abcde
請按任意鍵繼續 . . .

D:\Projects\Test>
```

### cmd 搭配 exit 指令

那麼再改進一次，使用 `start` 搭配 `cmd` 來執行多重指令 (`start` 本身做不到)，使其執行完 bat 後，額外呼叫 [exit](https://learn.microsoft.com/zh-tw/windows-server/administration/windows-commands/exit) 指令把當前視窗關掉，這樣就成功了。一樣要注意雙引號。

```csharp
Arguments = $"/c start \"TestProcess\" cmd /k \"\"{batFilePath}\" && exit\""
```

### 完整程式碼

```csharp
using System.Diagnostics;
using System.IO;
using UnityEditor;
using UnityEngine;
using Debug = UnityEngine.Debug;

public class TestCallBat
{
    [MenuItem("Tools/Call Test.bat")]
    public static void CallBat()
    {
        // 從 Unity 專案資料夾開始
        string workingDirectory = new DirectoryInfo(Application.dataPath).Parent.FullName;

        // 順便測試含有空白字元路徑的麻煩情況，注意工作路徑上不要有空白字元是個好習慣。
        string batFilePath = "Test Folder\\Test.bat";

        // 初始化 ProcessStartInfo
        var startInfo = new ProcessStartInfo
        {
            // 使用 cmd.exe 來執行 .bat
            FileName = "cmd",

            // 設定工作目錄，方便 .bat 內部使用相對路徑
            WorkingDirectory = workingDirectory,

            // 結果：網路上最容易查到的方法，但實際試過仍然會立即關閉
            //Arguments = $"/k \"{batFilePath}\"",

            // 結果：幾乎快成功了，可惜 bat 結束後，start 開啟的 cmd 視窗不會關閉
            //Arguments = $"/c start \"TestProcess\" \"{batFilePath}\"",

            // 結果：成功
            // 結論：使用 cmd /c start 來開啟標題為 TestProcess 的 cmd 視窗。
            // 然後在其中使用 cmd 指令執行 bat 檔案，並在執行完回到 TestProcess 環境後，再追加 exit 來關閉 TestProcess 視窗。
            Arguments = $"/c start \"TestProcess\" cmd /k \"\"{batFilePath}\" && exit\"",

            // 設為 false 才能設定環境變數
            UseShellExecute = false,
        };

        // 設定環境變數
        startInfo.EnvironmentVariables["UNITY_VERSION"] = Application.unityVersion;
        startInfo.EnvironmentVariables["ANOTHER_VARIABLE"] = "abcde";

        // 啟動 Process
        using Process process = Process.Start(startInfo);
        if (process != null)
        {
            // 等待執行結束
            process.WaitForExit();
            Debug.Log($"Process exited with code {process.ExitCode}");
        }
        else
        {
            Debug.LogError("Failed to start the process.");
        }
    }
}
```
