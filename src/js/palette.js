export const getPalette = ({ imgFile, canvasId }, callback) => {
  const image = new Image();

  const file = imgFile.files[0];

  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);

  fileReader.onload = () => {
    image.src = fileReader.result;
    image.onload = () => {
      const canvas = document.getElementById(canvasId);
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let palette = distinct(buildHex(imageData.data));
      const totalCount = palette[1].reduce(
        (result, item) => (result = result + item),
        0
      );
      palette = palette[0].map((color, index) => ({
        value: color,
        count: palette[1][index],
        percentage: (palette[1][index] / totalCount) * 100 + "%",
      }));

      palette = palette.sort((a, b) => b.count - a.count).slice(0, 8);
      callback(palette);
    };
  };
};

const buildRgb = (imageData) => {
  const rgbValues = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const rgb = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    };
    rgbValues.push(rgb);
  }
  return rgbValues;
};

const buildHex = (imageData) => {
  const rgbValues = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const rgb =
      formatter(imageData[i]) +
      formatter(imageData[i + 1]) +
      formatter(imageData[i + 2]);
    rgbValues.push(rgb);
  }
  console.log(rgbValues.length);
  return rgbValues;
};

const formatter = (number) => `0${number.toString(16)}`.slice(-2);

function distinct(arr) {
  let value = [];
  const count = [];
  let obj = {};
  let index = 0;

  for (let element of arr) {
    const hasKey = (obj, key) => (obj[key] ? true : false);
    if (!hasKey(obj, element)) {
      value.push(element);
      obj[element] = 1;
      count[index] = 1;
      index++;
    } else {
      const sameElementIndex = value.indexOf(element);
      count[sameElementIndex] = count[sameElementIndex] + 1;
    }
  }

  console.log([value, count][0].length);

  return [value, count];
}

//
class UniqRgb {
  constructor(value, count) {
    this.value = value;
    this.count = count;
  }
}

const getUniqRgb = (rgbValues) => {
  const result = [],
    indexes = [];

  for (let i = 0; i < rgbValues.length; i++) {
    const item = rgbValues[i];
    const uniqRgb = new UniqRgb(item, 1);

    for (let index = i + 1; index < rgbValues.length; index++) {
      const item2 = rgbValues[index];
      if (!indexes.includes(index)) {
        if (isSameRgb(item, item2)) {
          uniqRgb.count++;
          indexes.push(index);
        }
      }
    }

    result.push(uniqRgb);
  }

  return result;
};

const isSameRgb = (rgb1, rgb2) => {
  let count = 0;

  for (const key in rgb1) {
    if (Object.hasOwnProperty.call(rgb1, key)) {
      if (rgb1[key] === rgb2[key]) {
        count++;
      }
    }
  }

  return count === 3 ? true : false;
};
