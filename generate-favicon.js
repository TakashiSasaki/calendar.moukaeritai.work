const fs = require('fs');
const path = require('path'); // Node.jsのpathモジュールを読み込む
const sharp = require('sharp');
const toIco = require('to-ico');

// --- パス設定の変更箇所 ---
const sourceFile = path.join(__dirname, 'public', 'favicon.png'); // 入力ファイルのパス
const outputFile = path.join(__dirname, 'public', 'favicon.ico'); // 出力ファイルのパス
// -------------------------

const sizes = [16, 24, 32, 48, 64]; // .icoに含める画像の解像度

// 入力ファイルの存在を確認
if (!fs.existsSync(sourceFile)) {
    console.error(`エラー: 入力ファイルが見つかりません。パスを確認してください: ${sourceFile}`);
    process.exit(1); // エラーで処理を終了
}

console.log(`${sourceFile} から ${outputFile} を生成します...`);

const imageBuffers = sizes.map(size => {
    return sharp(sourceFile)
        .resize(size, size)
        .toFormat('png')
        .toBuffer();
});

Promise.all(imageBuffers)
    .then(buffers => {
        return toIco(buffers);
    })
    .then(icoBuffer => {
        fs.writeFileSync(outputFile, icoBuffer);
        console.log(`成功: ${outputFile} が生成されました。`);
    })
    .catch(err => {
        console.error('faviconの生成中にエラーが発生しました:', err);
    });