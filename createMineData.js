
const createRandom = (num) => {
    return Math.random() > 0.01 ? num : 0
}

const createLine = (num, y, ) => {
    let locationStr = localStorage.getItem('firstLocation')
    let location = ''
    let notEmpty = Boolean(locationStr)
    if (notEmpty) {
        location = JSON.parse(locationStr)
    }

    let container = []
    for (let i = 0; i < num; i++) {
        let cell = createRandom(num)
        let haveClick = location !== ''

        if (haveClick) {
            let clickLocation = location.xLocation === i && location.yLocation === y
            while (cell === 9 && clickLocation) {
                cell = createRandom(num)
            }
        }
        container.push(cell)
    }

    return container
}

const createMine = (num) => {
    let container = []

    for (let i = 0; i < num; i++) {
        let line = createLine(num, i)
        container.push(line)
    }

    return container
}

const countLocation = (square, x, y) => {
    let row = square[0]
    let inSquare = x >= 0 && y >= 0 &&
        (x < row.length) && ( y < square.length )

    if (inSquare) {
        let cell =  square[y][x]
        let notMine = cell !== 9
        if (notMine) {
            square[y][x] = cell + 1
        }

    }
}

const countAround = (square, x, y) => {
    // 左边三个
    countLocation(square, x - 1, y - 1)
    countLocation(square, x - 1, y)
    countLocation(square, x - 1, y + 1)

    // 上下两个
    countLocation(square, x, y - 1)
    countLocation(square, x, y + 1)

    // 右边三个
    countLocation(square, x + 1, y - 1)
    countLocation(square, x + 1, y)
    countLocation(square, x + 1, y + 1)
}

const countMine = (square) => {
    for (let i = 0; i < square.length; i++) {
        let row = square[i]
        for (let j = 0; j < row.length; j++) {
            let cell = row[j]
            if (cell === 9) {
                countAround(square, j, i)
            }
        }
    }
}

const createMineData = () => {
    let square = createMine(9)
    countMine(square)

    return square
}

const testMineData = () => {
    // let square = createMine(9)
    //
    // let counted = countMine(square)
    // log('square', square)
}
