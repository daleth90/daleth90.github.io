---
title: object 與 IntPtr 的轉換
---

透過 `GCHandle` 進行轉換，要注意需要透過 `GCHandle.Free()` 釋放記憶體，同時要注意釋放記憶體的時機。

```csharp
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class Program
{
	public static void Main()
	{
	    // object to IntPtr
		List<string> list1 = new List<string>();
		list1.Add("Number1");
		GCHandle handle1 = GCHandle.Alloc(list1);
        IntPtr parameter = GCHandle.ToIntPtr(handle1);
        // Wrong! If you free here,
        // the IntPtr parameter will point to null, and cause native crash.
		//handle1.Free();

        // IntPtr to object
		GCHandle handle2 = GCHandle.FromIntPtr(parameter);
		// Wrong! You think you can free handle1 since we don't need the IntPtr anymore?
		// Because handle2 point to the same position, free handle1 would cause handle2.Target becomes null.
		//handle1.Free();
		List<string> list2 = handle2.Target as List<string>;
        list2.Add("Number2");
		
		handle1.Free();  // Can only free handle1 here. I guess we can just free one of handle1 and handle2, but I'm not sure.
        handle2.Free();
		
		Console.WriteLine($"Final list count: {list2.Count}");
		for (var i = 0; i < list2.Count; i++)
		{
			Console.WriteLine(list2[i]);
		}
		
		// Expected:
        // Final list count: 2
        // Number1
        // Number2
	}
}
```

另外參考連結裡面有人寫了個 Extensions，一開始覺得很方便寫了試試，結果感覺這個做法真是蠻危險的。首先這個 Extensions 是專門給下面實作 `IDisposable` 的 `GCHandleProvider` 類別使用的，但除非封裝起來，否則這樣寫所有地方都呼叫的到，而且會讓 `GCHandle` 釋放不掉。

不過 `IDisposable` 的寫法似乎還不錯，把 Extensions 去掉的結果如下。

```csharp
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class GCHandleProvider : IDisposable
{
    private readonly GCHandle _handle;
    
    public IntPtr Pointer => GCHandle.ToIntPtr(_handle);
    
    public GCHandleProvider(object target)
    {
        _handle = GCHandle.Alloc(target);
    }
    
    public GCHandleProvider(IntPtr parameter)
    {
        _handle = GCHandle.FromIntPtr(parameter);
    }

    public T To<T>() where T : class
    {
        return _handle.Target as T;
    }

    public void Dispose()
    {
        ReleaseUnmanagedResources();
        GC.SuppressFinalize(this);
    }
    
    private void ReleaseUnmanagedResources()
    {
        if (_handle.IsAllocated)
        {
            _handle.Free();
        }
    }

    ~GCHandleProvider()
    {
        ReleaseUnmanagedResources();
    }
}

public class Program
{
	public static void Main()
	{
	    // object to IntPtr
		List<string> list1 = new List<string>();
		list1.Add("Number1");
		using var gchProvider1 = new GCHandleProvider(list1);
        IntPtr parameter = gchProvider1.Pointer;
        
        // IntPtr to object
		using var gchProvider2 = new GCHandleProvider(parameter);
		List<string> list2 = gchProvider2.To<List<string>>();
        list2.Add("Number2");

		Console.WriteLine($"Final list count: {list2.Count}");
		for (var i = 0; i < list2.Count; i++)
		{
			Console.WriteLine(list2[i]);
		}
		
		// Expected:
        // Final list count: 2
        // Number1
        // Number2
	}
}
```

## References

- [winapi - C# - How To Convert Object To IntPtr And Back? - Stack Overflow](https://stackoverflow.com/questions/17339928/c-sharp-how-to-convert-object-to-intptr-and-back)
