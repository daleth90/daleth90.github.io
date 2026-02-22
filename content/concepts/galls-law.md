---
title: 蓋爾定律
created: 2026-02-04
modified: 2026-02-22
---

蓋爾定律 (Gall's Law) 來自 John Gall 在 1975 年寫的《Systemantics: How Systems Work and Especially How They Fail》。

> [!note]
> 雖然軟體工程上很常聽到類似的原則，但這本書不是專談軟體工程方面的系統，而是泛用性的系統理論。

> A complex system that works is invariably found to have evolved from a simple system that worked. A complex system designed from scratch never works and cannot be patched up to make it work. You have to start over with a working simple system.

> 一個能正常運作的複雜系統，無一例外，都是從一個「能運作的簡單系統」逐步演化而來。一個從零開始被設計出來的複雜系統，永遠不會真的運作，而且也無法靠事後修補讓它變得可運作。你唯一能做的，是回到起點，從一個「能運作的簡單系統」重新開始。

## 知名失敗案例

1. 美國的 HealthCare.gov 於 2013 年 10 月 1 日首次上線即崩潰的事件。
2. Netscape 花了 3 年的時間，放棄 Netscape 4 的原始碼，重寫開發 Netscape 6。花費的時間導致把市場機會都讓給微軟的 IE，2000 年 11 月發佈後也遭遇系統問題，最終公司倒閉。

## 誤解

有些管理人，或甚至是不負責任的工程師，會把這個理論扭曲為「不需要先行設計」或是「之後再重構就好」。但是，如果系統之後要能夠演化，前提是==系統必須要被設計成有能夠演化的條件==，從軟體開發的角度來說就是==可維護性==和==可擴展性==。

也就是說，系統仍然需要先行設計，但是要基於==簡單==和==可演化==這兩個原則。特別是不要在未經驗證的假設下進行過度設計。這也符合 XP（Extreme Programming，極限程式設計）的簡單假設原則。

## XP 的簡單假設

簡單假設認為任何問題都可以「極度簡單」地解決。傳統的系統開發方法要考慮未來的變化，要考慮程式碼的可重用性。極限編程拒絕這樣做。

> 是的，但是我們知道總有一天會需要資料庫，會需要 ORB，也總有一天得去支援多客戶端。所以，我們現在就需要為那些東西做好準備，不是嗎？
> 
> XP 團隊會對此進行認真的考慮。他們開始時會先假設方案不需要那些基礎設施。只有在==有證據==或至少==有十分明顯的跡象顯示==現在引入這些基礎設施會==比繼續等待更划算時==，團隊才會引入這些基礎設施。
> 
> —《無瑕的程式碼 敏捷完整篇》P.21

又例如：明明還沒受到市場青睞，尚未出現的高流量需求，就先使用複雜的微服務架構。

## XP 的快速回饋

當回饋能做到及時、迅速，將發揮極大的作用。一個事件和對這一事件做出回饋之間的時間，一般被用來掌握新情況以及做出修改。與傳統開發方法不同，與客戶的發生接觸是不斷反覆出現的。客戶能夠清楚地洞察開發中系統的狀況。並能夠在整個開發過程中及時給出回饋意見，在需要的時候能夠掌控系統的開發方向。

## References

- [John Gall (author) - Wikipedia](https://en.wikipedia.org/wiki/John_Gall_(author)#Gall's_law)
- [Small is Beautiful — The Big Bang Launch Failure of Healthcare.gov | by Bishr Tabbaa | Medium](https://medium.com/@bishr_tabbaa/small-is-beautiful-the-launch-failure-of-healthcare-gov-5e60f20eb967)
- [Things You Should Never Do, Part I – Joel on Software](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/)
- [極限編程 - 維基百科，自由的百科全書](https://zh.wikipedia.org/zh-tw/%E6%9E%81%E9%99%90%E7%BC%96%E7%A8%8B)
