export const validateFen = (fen: string): boolean => {
  const parts = fen.trim().split(/\s+/);

  if (parts.length !== 6) {
    return false;
  }

  const [position, activeColor, castling, enPassant, halfMove, fullMove] = parts;
  const rows = position.split('/');

  if (rows.length !== 8) {
    return false;
  }

  for (const row of rows) {
    let rowCount = 0;

    for (const char of row) {
      if (/[1-8]/.test(char)) {
        rowCount += parseInt(char, 10);
      } else if (/[prnbqkPRNBQK]/.test(char)) {
        rowCount += 1;
      } else {
        return false;
      }
    }

    if (rowCount !== 8) {
      return false;
    }
  }

  if (!/^[wb]$/.test(activeColor)) {
    return false;
  }

  if (!/^(K?Q?k?q?|-)$/i.test(castling)) {
    return false;
  }

  if (!/^(-|[a-h][36])$/.test(enPassant)) {
    return false;
  }

  if (!/^\d+$/.test(halfMove) || parseInt(halfMove, 10) < 0) {
    return false;
  }

  if (!/^\d+$/.test(fullMove) || parseInt(fullMove, 10) <= 0) {
    return false;
  }

  return true;
};
