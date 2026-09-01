// ---------------------------------------------------------------------------------------------------------------------
// Matrix Chars
// ---------------------------------------------------------------------------------------------------------------------
// These are based on the below project
// https://github.com/mdcrty/mdcrty-packages/blob/main/packages/digital-rain/src/DigitalRain.tsx
//const KANJI = "日";
const KATAKANA = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZç';
const NUMS = '0123456789';
const SYMBOLS = ':・."=*+-<>!@#$%&?*'; //':・."=*+-<>!@#$%&?*♠♣♥♦★☎☹☺☯☮♻♚♛♜♝♞♟𓃾';
const BASE_MATRIX_CHARS = KATAKANA + LATIN + NUMS;
// amplify pool so symbols are rarer
export const MATRIX_CHARS = BASE_MATRIX_CHARS.repeat(3) + SYMBOLS;

export const getMatrixChar = () => {
  const index = Math.floor(Math.random() * MATRIX_CHARS.length);
  return MATRIX_CHARS[index];
};
export const BASE_FONT_SIZE = 24;
export const BASE_SIZE = BASE_FONT_SIZE * 1;
export const CELL_WIDTH = BASE_FONT_SIZE + 2;

export const MODE_CUSTOM = 'custom';
export const MODE_BASIC = 'basic';

const charSets = [
  'aаạąäàáᴀₐᵃAΑΑ̇АᎪᗅꓮꓯＡ𝐀𝐴𝑨𝒜𝓐𝔄𝔸𝕬𝖠𝗔𝘈𝘼𝙰𝚨𝛢𝜜𝝖𝞐ᴬªɑǟ',
  'bƅᵇᵦBƁΒВᏴᏼᗷᛒℬꓐꞴＢᴮ',
  'cсƈċᴄᵓᶜCϹСᏟᑕℂℭ⸦ꓚＣↄɔꜾ',
  'dԁɗᶁꝺᵈDᎠᗞᗪᴅⅅⅮꓓＤᴰ',
  'eеẹėéèₑᵉEΕЕᎬⴹꓰＥᴱɛɇꬲ',
  'fᶠFϜᖴℱꓝꞘＦꜰ',
  'gġɡցᶃǥǵᵍGℊ⅁ꓖＧᴳցǵǥ',
  'hһʰHΗНᎻᏂℋℌꓧＨᴴ',
  'iіíïⁱᵢIIⅠⅠⅼ丨ιℐℑ∣⍳Ⲓⵏꓲᴵ',
  'jјʝϳʲJЈᴊꞲＪᴶ',
  'kκᵏKΚКᛕⲔꓗＫᴷĸꝁ',
  'lӏḷˡLℓ∣⏽Ⲓⵏꓲᴸ',
  'mᵐMΜМᴍℳꟽⲘꓟＭᴹɱꟿ',
  'nոⁿₙNΝՆᴎℕꓠＮᴺŋɴꞃ',
  'oоοօȯọỏơóòöᵒºOΟОՕ०ꓳ〇ⲞⲟＯᴼ',
  'pрᵖPΡРℙⲢꓑＰᴾ',
  'qզԛɋʠᵠQℚꝖＱ',
  'rгᴦʳRΓℛꓣＲᴿɼʁꝛ',
  'sʂˢSЅꚂꙄꙅⴑＳꜱſꞩ',
  'tτꚋᵗTΤТᴛⲦꓔＴᵀŧʈꞇ',
  'uυսüúùᵘᵤU∪𝕌𝖀ꓴＵᵁμυᴜ',
  'vνѵᴠꝟᵛV∨𝖁ꓦＶⱽʌʋ',
  'wѡԝʷWᴡꓪＷᵂɯωꝡ',
  'xхҳẋˣX×⤫⤬⨯ꓫＸ',
  'yуýʸYΥҮɣꓬＹ',
  'zʐżƶᶻZℤꓜＺ',
  '0OoΟοОоՕ〇ꓳⲞⲟＯ𝟎𝟘𝟢𝟬∅⌀⓪',
  '1lɪ｜ǀ∣𝟏𝟙𝟣𝟭𐄇',
  '2ƧᒿꙄ𝟐𝟚𝟤𝟮²ᒿ²',
  '3ƷȜЗӠ𝟑𝟛𝟥𝟯³ʒ꣓',
  '4Ꮞ４𝟒𝟜𝟦𝟰',
  '5Ƽ５𝟓𝟝𝟧𝟱ƽ',
  '6бᏮⳒ６𝟔𝟞𝟨𝟲',
  '7𐓒７𝟕𝟟𝟩𝟳',
  '8８𝟖𝟠𝟪𝟴',
  '9Ⳋ９𝟗𝟡𝟫𝟵',
  '!ǃⵑ！',
  '$＄💲',
  '?Ɂʔ？ʡॽ¿',
  '',
];

const matrixCharMap: Record<number, string> = {};

charSets.forEach((item) => {
  for (const char of item) {
    if (!matrixCharMap[char.codePointAt(0)!]) {
      matrixCharMap[char.codePointAt(0)!] = item;
    }
  }
});

export { matrixCharMap };
