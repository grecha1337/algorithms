export const generationArray = (minValue: number, maxValue: number, minLen: number, maxLenv: number): number[] => {
  const arrLength = Math.floor(Math.random() * (maxLenv - minLen + 1)) + minLen;
  const res = []
  for (let i = 0; i <= arrLength; i++) {
    res.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue)
  }
  return res;
}