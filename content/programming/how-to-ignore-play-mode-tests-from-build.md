---
title: 如何把 PlayMode 測試從建置移除？
created: 2025-05-09
modified: 2025-06-18
---

使用內建選單建立 Test Assembly Folder 的時候，注意 Unity 會把 `UNITY_INCLUDE_TESTS` 加入這個 assembly 的 Define Constraints。

Define Constraints 是用來告訴編譯器，要符合這個限制，才能編譯這個 assembly。而 `UNITY_INCLUDE_TESTS`，目前想像是只有 Player Test 的時候才會加入編譯。因此真正的建置流程不會編譯到這些 PlayMode 測試。

## References

- https://discussions.unity.com/t/info-on-unity_include_tests-define/790789/4
- [Unity - Manual: Assembly Definition properties reference](https://docs.unity3d.com/6000.0/Documentation/Manual/class-AssemblyDefinitionImporter.html#define-constraints)
