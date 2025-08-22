---
title: 計時器與浮點數誤差
created: 2025-07-18
modified: 2025-07-18
---

寫計時相關功能時，使用 float 變數，在每個 `Update()` 加上或減去 `deltaTime`，是不準確的做法。

因為 float 使用在比較大的數字的時候，用來儲存小數的位數就變少了，也就是說，加減的誤差變大。導致加減像是 `deltaTime` 這種很小的數值時，小數點就==被誤差洗掉了==，並==導致計算不精準==的狀況。當然，如果數字夠小，可能感受不出差別。

我自己簡單的實測一次：使用倖存者類型的 30 分鐘（1800 秒）來倒數計時。實際花費的時間是 1806.942 秒，30 分鐘就會有將近 7 秒的誤差。要注意時間和誤差不是正比關係，是根據整數佔了幾個位元來決定的。

正確的做法應該是在計時器開始的時候，用 `Time.time` 紀錄開始的時間，需要時間的時候就用當前的時間與開始的時間做比對。

```csharp
using TMPro;
using UnityEngine;

public class Timer : MonoBehaviour
{
    [SerializeField]
    private TMP_Text _timeText;

    private bool _isRunning = false;
    private float _startTime;

    private void Update()
    {
        if (!_isRunning)
        {
            if (Input.GetKeyDown(KeyCode.Space))
            {
                _isRunning = true;
                _startTime = Time.time;
            }
        }

        if (_isRunning)
        {
            float elapsedTime = Time.time - _startTime;
            int minutes = Mathf.FloorToInt(elapsedTime / 60);
            int seconds = Mathf.FloorToInt(elapsedTime % 60);
            _timeText.text = $"{minutes:00}:{seconds:00}";
        }
    }
}
```

## References

- https://www.facebook.com/share/p/16fELxKCbc/