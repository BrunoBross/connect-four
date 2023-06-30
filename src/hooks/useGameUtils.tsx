import { useCallback } from "react";

export function useGameUtils() {
  const verifyColumns = useCallback((gameMatrix: number[][]) => {
    for (let colIdx = 0; colIdx < gameMatrix[0].length; colIdx++) {
      let prev = 0;
      let count = 1;
      for (let rowIdx = gameMatrix.length - 1; rowIdx >= 0; rowIdx--) {
        const item = gameMatrix[rowIdx][colIdx];
        if (item !== 0 && item === prev) {
          count++;
          if (count >= 4) {
            return true;
          }
        } else {
          count = 1;
        }
        prev = item;
      }
    }
    return false;
  }, []);

  const verifyRows = useCallback((gameMatrix: number[][]) => {
    for (let rowIdx = gameMatrix.length - 1; rowIdx >= 0; rowIdx--) {
      let prev = 0;
      let count = 1;
      for (let colIdx = 0; colIdx < gameMatrix[rowIdx].length; colIdx++) {
        const item = gameMatrix[rowIdx][colIdx];
        if (item !== 0 && item === prev) {
          count++;
          if (count >= 4) {
            return true;
          }
        } else {
          count = 1;
        }
        prev = item;
      }
    }
    return false;
  }, []);

  const verifyMainDiagonals = useCallback((gameMatrix: number[][]) => {
    for (let startCol = 0; startCol <= gameMatrix[0].length - 4; startCol++) {
      for (let startRow = gameMatrix.length - 1; startRow >= 3; startRow--) {
        const item = gameMatrix[startRow][startCol];
        if (item !== 0) {
          let count = 1;
          let colIdx = startCol + 1;
          let rowIdx = startRow - 1;
          while (
            colIdx < gameMatrix[0].length &&
            rowIdx >= 0 &&
            gameMatrix[rowIdx][colIdx] === item
          ) {
            count++;
            if (count >= 4) {
              return true;
            }
            colIdx++;
            rowIdx--;
          }
        }
      }
    }
    return false;
  }, []);

  const verifySecondaryDiagonals = useCallback((gameMatrix: number[][]) => {
    for (let startCol = gameMatrix[0].length - 1; startCol >= 3; startCol--) {
      for (let startRow = gameMatrix.length - 1; startRow >= 3; startRow--) {
        const item = gameMatrix[startRow][startCol];
        if (item !== 0) {
          let count = 1;
          let colIdx = startCol - 1;
          let rowIdx = startRow - 1;
          while (
            colIdx >= 0 &&
            rowIdx >= 0 &&
            gameMatrix[rowIdx][colIdx] === item
          ) {
            count++;
            if (count >= 4) {
              return true;
            }
            colIdx--;
            rowIdx--;
          }
        }
      }
    }
    return false;
  }, []);

  const verifyBoard = useCallback(
    async (gameMatrix: number[][]) => {
      if (
        verifyColumns(gameMatrix) ||
        verifyRows(gameMatrix) ||
        verifyMainDiagonals(gameMatrix) ||
        verifySecondaryDiagonals(gameMatrix)
      ) {
        return true;
      }
      return false;
    },
    [verifyColumns, verifyRows, verifyMainDiagonals, verifySecondaryDiagonals]
  );

  return { verifyBoard };
}
