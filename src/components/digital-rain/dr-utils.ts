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

export interface CellRain {
  length: number;
  position: number;
}
