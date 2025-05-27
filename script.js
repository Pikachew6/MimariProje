function encodeData() {
  const dataInput = document.getElementById("data").value;
  if (!/^[01]{1,16}$/.test(dataInput)) {
    alert("Please enter a valid binary string of up to 16 bits.");
    return;
  }

  const dataArray = dataInput.split("").map(Number);
  const hammingCode = calculateHammingCode(dataArray);

  displayOutput(hammingCode, dataArray);
}

function calculateHammingCode(data) {
  const n = data.length;
  const r = Math.ceil(Math.log2(n + Math.log2(n) + 1));
  const codeLength = n + r;
  const hammingCode = Array(codeLength).fill(0);

  // Place data bits in the code
  let j = 0;
  for (let i = 0; i < codeLength; i++) {
    if (Math.pow(2, j) === i + 1) {
      j++;
    } else {
      hammingCode[i] = data.shift();
    }
  }

  // Calculate parity bits
  for (let i = 0; i < r; i++) {
    const parityPos = Math.pow(2, i) - 1;
    let parity = 0;
    for (let k = parityPos; k < codeLength; k += 2 * (parityPos + 1)) {
      for (let l = k; l < k + parityPos + 1 && l < codeLength; l++) {
        parity ^= hammingCode[l];
      }
    }
    hammingCode[parityPos] = parity;
  }

  return hammingCode.join("");
}

function displayOutput(hammingCode) {
  const outputSection = document.getElementById("output-section");
  outputSection.innerHTML = `
      <p>Hamming Code: ${hammingCode}</p>
      <button onclick="introduceError('${hammingCode}')">Introduce Error</button>
  `;
}

function introduceError(hammingCode) {
  const bitToFlip = Math.floor(Math.random() * hammingCode.length);
  let corruptedCode = hammingCode.split("");
  corruptedCode[bitToFlip] = corruptedCode[bitToFlip] === "0" ? "1" : "0";
  corruptedCode = corruptedCode.join("");

  const outputSection = document.getElementById("output-section");
  outputSection.innerHTML += `
      <p>Corrupted Code: ${corruptedCode}</p>
      <button onclick="detectAndCorrectError('${hammingCode}', '${corruptedCode}')">Detect and Correct Error</button>
  `;
}

function detectAndCorrectError(originalCode, corruptedCode) {
  const original = originalCode.split("").map(Number);
  const corrupted = corruptedCode.split("").map(Number);

  let errorPosition = 0;
  for (let i = 0; i < original.length; i++) {
    if (original[i] !== corrupted[i]) {
      errorPosition ^= i + 1;
    }
  }

  const correctedCode = corrupted.slice();
  if (errorPosition > 0) {
    correctedCode[errorPosition - 1] =
      correctedCode[errorPosition - 1] === 0 ? 1 : 0;
  }

  const outputSection = document.getElementById("output-section");
  outputSection.innerHTML += `
      <p>Error Position: ${errorPosition}</p>
      <p>Corrected Code: ${correctedCode.join("")}</p>
  `;
}
