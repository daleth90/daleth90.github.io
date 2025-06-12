---
title: FancyScrollView 與擴充
---

[setchi/FancyScrollView: A versatile Unity scroll view component that enables highly flexible animations.](https://github.com/setchi/FancyScrollView)

蠻喜歡這個套件，可以很方便的進行元素的更新，也可以加工演出。

不過原本的套件處理的層級蠻底層的，所以每個 ScrollView 都需要寫一段擴充，讀過它的範例之後也會發現，每個範例都有一段差不多的程式碼，所以為了方便性，為專案寫個擴充蠻合理的。這層擴充需要根據專案和團隊的風格做調整，這也是為什麼 FancyScrollView 沒辦法做這層的原因。

基礎功能就懶得介紹了。

## 擴充腳本

寫一份 `DefaultGridView.cs` 作為專案的基底功能，自行根據團隊需求調整。

```csharp
using EasingCore;
using FancyScrollView;
using System;
using System.Linq;
using UnityEngine;

public enum Alignment
{
    Upper,
    Middle,
    Lower,
}

public class DefaultGridViewContext : FancyGridViewContext
{
    public int SelectedIndex = -1;
    public Action<int> OnCellClicked;
}

public abstract class DefaultGridViewCell<TItemData> : DefaultGridViewCell<TItemData, DefaultGridViewContext>
{

}

public abstract class DefaultGridViewCell<TItemData, TContext>
    : FancyGridViewCell<TItemData, TContext> where TContext : DefaultGridViewContext, new()
{

}

[RequireComponent(typeof(Scroller))]
public abstract class DefaultGridView<TItemData> : DefaultGridView<TItemData, DefaultGridViewContext>
{

}

[RequireComponent(typeof(Scroller))]
public abstract class DefaultGridView<TItemData, TContext>
    : FancyGridView<TItemData, TContext> where TContext : DefaultGridViewContext, new()
{
    protected new class DefaultCellGroup : FancyCellGroup<TItemData, TContext>
    {
        public FancyCell<TItemData, TContext> FindCell(int index)
        {
            for (var i = 0; i < Cells.Length; i++)
            {
                if (Cells[i].Index == index)
                {
                    return Cells[i];
                }
            }

            return null;
        }
    }

    public int SelectedIndex => Context.SelectedIndex;

    public T FindCell<T>(int index) where T : DefaultGridViewCell<TItemData, TContext>
    {
        int groupIndex = index / startAxisCellCount;
        DefaultCellGroup cellGroup = cellContainer.Cast<Transform>()
            .Select(t => t.GetComponent<DefaultCellGroup>())
            .Where(cellGroup => cellGroup.IsVisible && cellGroup.Index == groupIndex)
            .FirstOrDefault();
        if (cellGroup == null)
        {
            return null;
        }

        return cellGroup.FindCell(index) as T;
    }

    public void SetOnCellClicked(Action<int> action)
    {
        Context.OnCellClicked = action;
    }

    public void RefreshView()
    {
        Refresh();
    }

    public void UpdateSelection(int index)
    {
        if (Context.SelectedIndex == index)
        {
            return;
        }

        Context.SelectedIndex = index;
        Refresh();
    }

    public void ScrollTo(int index, float duration = 0.4f, Ease easing = Ease.InOutQuint, Alignment alignment = Alignment.Middle)
    {
        if (DataCount == 0)
        {
            return;
        }

        ScrollTo(index, duration, easing, GetAlignment(alignment));
    }

    public void JumpTo(int index, Alignment alignment = Alignment.Middle)
    {
        if (DataCount == 0)
        {
            return;
        }

        JumpTo(index, GetAlignment(alignment));
    }

    private float GetAlignment(Alignment alignment)
    {
        return alignment switch
        {
            Alignment.Upper => 0.0f,
            Alignment.Middle => 0.5f,
            Alignment.Lower => 1.0f,
            _ => GetAlignment(Alignment.Middle),
        };
    }
}
```

## 使用範例

### TestGridViewCell

```csharp
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class TestGridViewCell : DefaultGridViewCell<int>
{
    [SerializeField]
    private Image background;
    [SerializeField]
    private TMP_Text number;
    [SerializeField]
    private Color selectedColor = Color.green;
    [SerializeField]
    private Color unselectedColor = Color.white;

    public override void UpdateContent(int itemData)
    {
        background.color = Index == Context.SelectedIndex ? selectedColor : unselectedColor;
        number.text = itemData.ToString();
    }
}
```

### TestGridView

```csharp
using UnityEngine;

public class TestGridView : DefaultGridView<int>
{
    private class CellGroup : DefaultCellGroup { }

    [SerializeField]
    private TestGridViewCell cellPrefab;

    protected override void SetupCellTemplate() => Setup<CellGroup>(cellPrefab);
}
```

### Test (測試啟動腳本)

```csharp
using System.Collections.Generic;
using UnityEngine;

public class Test : MonoBehaviour
{
    [SerializeField]
    private TestGridView gridView;

    private void Start()
    {
        var list = new List<int>(100);
        for (int i = 1; i <= 100; i++)
        {
            list.Add(i);
        }

        gridView.UpdateContents(list);
    }
}
```
