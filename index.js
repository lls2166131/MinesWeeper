
const templateCell = function(line, x) {
    let container = ''
    for (let i = 0; i < line.length; i++) {
        let member = line[i]
        let ele = member

        let inner = `<span>${ member }</span>`
        if (member === 9) {
            let apple = '<img class="apple" src="./img/red_apple.png" alt="apple"/>'
            inner = apple
        }

        ele = `
            <img class="flag" data-number="${ member }" 
                src="./img/flag.png" alt="flag"/>
            ${ inner }
        `

        let locationStr = localStorage.getItem('firstLocation')
        let notEmpty = Boolean(locationStr)
        let location = ''
        let clickedClass = ''
        if (notEmpty) {
            location = JSON.parse(locationStr)
            if (location.xLocation === i && location.yLocation === x) {
                clickedClass = 'opened'
            }
        }


        let cell = `
            <div class="cell ${ clickedClass }" data-number="${ member }" data-x="${ x }" data-y="${ i }">
                ${ ele }</div>`
        container += cell
    }

    let rowEle = `
    <div class="row">${ container }</div>`
    return rowEle
}

const templateRow = function(square) {
    let container = ''
    for (let i = 0; i < square.length; i++) {
        let member = square[i]
        let row = templateCell(member, i)
        container += row
    }

    return container
}

const renderSquare = function(square) {
    let allRow = templateRow(square)
    let container = `
        <div id="id-div-mime">${ allRow }</div>`

    let eleRoot = eleSelector('.mine-root')
    eleRoot.insertAdjacentHTML( 'beforeend', container)
}

const bindEventDelegate = function(square) {
    let allCell = eleSelector('#id-div-mime')
    // 第一次点击
    window.firstFlag = true
    autoCountTime()
    allCell.addEventListener('click', (e) => {
        let self = e.target
        let isTarget = self.classList.contains('cell')
        if (isTarget) {
            openSquare(self, square, window.firstFlag)
            window.firstFlag = false
        }
    })

    setFlag()
}


const showEndPop = () => {
    Swal.fire({
        title: 'Game over',
        text: 'Do you want another turn?',
        icon: 'error',
        confirmButtonText: 'New Game'
    }).then((result) => {
        if (result.value) {
            clearGame()
            game()
        }
    })
}

const firstNotMine = (flag, x, y) => {
    if (flag) {
        let location = {
            yLocation: x,
            xLocation: y,
        }
        localStorage.setItem('firstLocation', JSON.stringify(location))
        // 第一次踩雷标记
        localStorage.setItem('firstMine', JSON.stringify(true))
        clearGame()
        game()
        return true
    }
    return false
}

const openSquare = function(cell, square, firstFlag) {
    let { number, x, y } = cell.dataset
    let classList = cell.classList
    let hasOpen = classList.contains('opened')
    if (hasOpen) {
        return
    }

    if (number === '9') {
        let isFirst = firstNotMine(firstFlag, Number(x), Number(y))
        if (isFirst) {
            return
        }
        // 游戏结束
        let container = eleSelector('#id-div-mime')
        container.classList.add('game-end')
        cell.classList.add('opened')
        cell.classList.add('red-cell')
        showEndPop()

    } else if (number === '0') {
        cell.classList.add('opened')
        openAround(square, Number(x), Number(y))
    } else {
        cell.classList.add('opened')
    }

}

/**
 *
 * @param square
 * @param x 行
 * @param y 列
 */
const openAround = function(square, x, y) {
    // 左边三个
    canOpen(square, x - 1, y - 1)
    canOpen(square, x, y - 1)
    canOpen(square, x + 1, y - 1)

    // 上下两个
    canOpen(square, x - 1 , y)
    canOpen(square, x + 1, y)

    // 右边三个
    canOpen(square, x - 1, y + 1)
    canOpen(square, x, y + 1)
    canOpen(square, x + 1, y + 1)
}

const canOpen = function(square, x, y) {
    if (x >= 0 && y >= 0 && x < square[0].length && y < square.length) {
        let selName = `[data-x="${ x }"][data-y="${ y }"]`
        let cell = eleSelector(selName)

        let classList = cell.classList
        let hasOpen = classList.contains('opened')
        if (hasOpen) {
            return
        }

        let { number } = cell.dataset
        if (number === '9') {
            // 什么也不做
        } else if (number === '0') {
            cell.classList.add('opened')
            openAround(square, x, y)
        } else {
            cell.classList.add('opened')
        }
    }
}

const test = () => {
    // let lineTest = [1, 2, 3, 5, 9]
    // let lineEle = templateCell(lineTest, 8)
    testMineData()
}

const game = () => {
    let square = createMineData()
    log('square', square)
    countCreateMine(square)
    renderSquare(square)
    bindEventDelegate(square)
}

const clearGame = () => {
    let eleRoot = eleSelector('.mine-root')
    eleRoot.innerHTML = ''

    // 地雷统计
    let numContainer = eleSelector('.num-container')
    numContainer.removeChild(eleSelector('.mine-count'))
    resetTime()
}

const newGame = () => {
    let btn = eleSelector('.new-game')
    bindEleEvent(btn, 'click', function (e) {
        clearGame()
        game()
    })
}

const __main = () => {
    game()
    newGame()
}

__main()
