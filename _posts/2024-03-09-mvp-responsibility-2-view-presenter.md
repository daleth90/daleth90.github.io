---
layout: post
title: MVP 模式的職責區分 (2) - View 與 Presenter
tags:
  - unity
  - mvp
---

**※ 雖然此篇與 Unity 比較有關，但是概念適用於現代的 MVx 系列。**

Presenter 的工作是站在 Model 與 View 中間協調兩邊的運作。一方面取得 Model 的資料與事件，根據展示需求傳達給 View；一方面接收使用者操作 View 的行為，決定如何與操作 Model 工作以及更進一步的展示。

但是 Presenter 和 View 的分界概念到底是什麼？

<!--more-->

### 從 Passive View 開始

[Passive View](https://martinfowler.com/eaaDev/PassiveScreen.html) 是由 Martin Fowler 提出的概念，可以說是最單純的 View。它本身沒有任何展示邏輯，每個欄位要顯示什麼都得由 Presenter 告知。同時也提出了 [Supervising Controller](https://martinfowler.com/eaaDev/SupervisingPresenter.html)，原因是有些複雜的 UI 演出讓 Controller 難以測試，因此讓 View 相依於 Model，透過 Observer 來偵測 Model 的變化。

注意這些是 20 年前的「草稿」(那本書已經沒空寫了)。Supervising Controller 指的複雜 UI 演出，不見得只會由 Model 資料變化來觸發，也可能由 Controller 觸發。既然如此，就應該統一由 Controller 觸發會比較適當。

Passive View 是不錯的思考起點，但是很容易被無限上綱，我曾經聽過 iOS (新手)工程師連滾輪造成 Scroll View 上下變動多少都要給 Controller 管理，這種程式碼寫起來真的是很囉唆。

我們試著把無限上綱的部分去掉，把展示層的工作分成<mark>由 Presenter「決定要展示什麼內容」，以及由 View「決定如何展示內容」</mark>。

Presenter「決定要展示什麼內容」這項工作，是比較高層級的概念。例如：展示遊戲角色資訊時，Presenter 知道 View 需要這個角色要呈現的數值，但 Presenter 不需要知道 View 是如何呈現這些資訊的，Presenter 不需要知道經驗值用 bar 或 text 展示，也不需要知道 bar 上的 shader 參數。又例如：角色成功升級時，Presenter 知道需要讓 View 進行某個演出，因此呼叫了 View 的某個 API，但是 Presenter 不需要知道 View 做了多複雜的演出。這些東西由「決定如何展示內容」的 View 來決定。

以自動化測試的角度來說，我們希望程式碼能盡量被單元測試，但是 GUI 無法被單元測試，因為被其框架綁住而無法直接產生實體。此外 GUI 處理的是人類的視覺感受而不是程式邏輯，因此用程式碼測試文字顏色大小之類的東西也沒有意義。因此我們知道，<mark>「決定要展示什麼內容」是程式邏輯；「決定如何展示內容」是視覺設計</mark>。

在 Unity，我們知道 MonoBehaviour 的幾個狀況：
1. 一定要透過 MonoBehaviour 才能製作 GUI。
2. MonoBehaviour 無法被單元測試。
3. MonoBehaviour 的生命週期常常不會是我們想要的時機，通常我們會自己決定執行時機。
4. 不會想和美術在 Git 上有 prefab 的衝突。

因此我們<mark>把「決定要展示什麼內容」的 Presenter 寫成可以測試的單純類別；把「決定如何展示內容」的 View 寫成 MonoBehaviour 類別</mark>。例如：由 Presenter 告知要展示的文字，然後 View 自己決定 Component、大小、顏色等等。

但事情總是沒那麼單純。

### 情境：查詢資料

查詢資料的工作通常讓 Presenter 處理，而不是 View。例如：如果要顯示遊戲角色的資訊，Presenter 會知道角色 ID，並自行查詢等級、經驗值及其它相關資料，再交給 View 來顯示。這個做法使 View 與系統脫鉤，只單方面接收 Presenter 的資料，讓 View 更容易接受修改，也更容易被其它功能相似的 Presenter 重複使用。

當然有時候這樣做會覺得很麻煩，特別是有 Grid View 的情境，你會發現需要為 Grid View 多寫個資料類別。以這個例子來說，一定會有人想直接把角色 ID 傳給 View，讓 View 自己查詢角色資料。注意這個做法也不是 Supervising Controller，因為這個行為沒有任何 Observer 的概念。

我個人認為，如果邏輯流動與相依性管控適當的話，適當的偷懶是可以的。有些資料跟「如何展示」比較相關的，我會讓 View 自行查詢。但上面角色資料的例子，我還是建議讓 Presenter 查詢會比較好。

### 情境：讀取資源

讀取資源的工作通常讓 View 處理，當 Presenter 把角色模型的 resource key 交給 View，由 View 決定讀取的過程，像是同步讀取或非同步讀取，也可以自己決定非同步讀取的演出方式。讀取的過程某種層面上也是視覺設計的部分，Presenter 不需要知道其中的細節。

但也還是有特例，有些情境下讓 Presenter 先告知資源讀取器讀取完必要資源，再打開 View 會比較適合。但你可能也可以讓 View 有個純讀取用的非同步 API，等 View 讀取完通知 Presenter。

### 模糊的分界

Presenter 與 View 的職責分界雖然有個方向但比較模糊，根據狀況不同可能需要調整職責切分，需要一些經驗判斷。不過大方向有確立好的話，有必要修改時也不過就是搬幾段程式碼而已。
