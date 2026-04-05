# 相対音感

ニコニコ生放送で動くゲームです。  
遊ぶ: [初心者](https://wakewakame.github.io/nicogame-onkan/index.html?black=false&range=single) / [上級者](https://wakewakame.github.io/nicogame-onkan/index.html?tone=sine)

## 利用したピアノ音源

Upright Piano KW  
https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html

## 利用方法

```sh
npm install
```

### ビルド方法

```sh
npm run build
```

### 動作確認方法

```sh
npm start
```

### エクスポート方法

```sh
akashic export zip --output game.zip --nicolive
```

実行すると `game.zip` という名前の zip ファイルが出力されます。

## テスト方法

```sh
npm test
```
