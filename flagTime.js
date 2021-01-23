const showSuccessPop = () => {
    Swal.fire({
        title: 'You win',
        text: 'Congratulations! 🎉🎉🎉',
        icon: 'success',
        confirmButtonText: 'New Game'
    }).then((result) => {
        if (result.value) {
            clearGame()
            game()
        }
    })
}

const validateFlag = () => {
    let allFlag = eleSelectorAll('.show-flag')
    let countEle = eleSelector('.mine-count')
    let total = Number(countEle.dataset.count)
    let allMine = total === allFlag.length

    let allRight = Array.from(allFlag).every(item => {
        let cell = Number(item.dataset.number)
        return cell === 9
    })

    let passGame = allMine && allRight
    if (passGame) {
        showSuccessPop()
    }

}

const toggleFlag = (self) => {
    let flagEle = self.querySelector('.flag')
    let countEle = eleSelector('.mine-count')
    let limit = Number(countEle.dataset.limit)

    let notOpen = !self.classList.contains('opened')
    if (limit !== 0 && notOpen) {
        flagEle.classList.toggle('show-flag')

        let markMine = flagEle.classList.contains('show-flag')
        if (markMine) {
            validateFlag()
        }
    }
}

/**
 * 统计雷
 */
const countFlag = () => {
    let allFlag = eleSelectorAll('.show-flag')
    let countEle = eleSelector('.mine-count')
    let total = Number(countEle.dataset.count)
    let currentFlag = allFlag.length

    let restMine = total - currentFlag
    countEle.innerHTML = restMine
    countEle.dataset.limit = restMine
}

/**
 * 放置旗帜
 */
const setFlag = () => {
    let allCell = eleSelector('#id-div-mime')
    allCell.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        let self = e.target
        let isTarget = self.classList.contains('cell')
        let isFlag = self.classList.contains('flag')

        if (isTarget) {
            toggleFlag(self)
            countFlag()
        } else if (isFlag) {
            // 取消放置
            self.classList.toggle('show-flag')
            countFlag()
        }

    })
}


const changeTime = (timeMark) => {
    let secondEle = eleSelector('.show-second')
    let current = secondEle.innerHTML
    let updateSecond = Number(current) + 1
    let minEle = eleSelector('.show-min')
    let currentMin = minEle.innerHTML

    if (updateSecond === 61) {
        let updateMin = Number(currentMin) + 1
        if (updateMin === 30) {
            clearInterval(timeMark)
        }
        if (String(updateMin).length === 1) {
            updateMin = `0${ updateMin }`
        }

        minEle.innerHTML = updateMin
        updateSecond = '00'
    }

    if (String(updateSecond).length === 1) {
        updateSecond = `0${ updateSecond }`
    }
    secondEle.innerHTML = updateSecond

}


const startTime = () => {
    let timeMark =  setInterval(function () {
        changeTime(timeMark)
    }, 1000)
    localStorage.setItem('timeMark', JSON.stringify(timeMark))
}

/**
 * 已经点击过，自动开启计时
 */
const autoCountTime = () => {
    let locationStr = localStorage.getItem('firstLocation')
    let notEmpty = Boolean(locationStr)
    if (notEmpty) {
        startTime()
        localStorage.removeItem('firstLocation')
    }
}
const resetTime = () => {
    let timeMark = JSON.parse(localStorage.getItem('timeMark'))
    clearInterval(timeMark)

    let minEle = eleSelector('.show-min')
    minEle.innerHTML = '00'
    let secondEle = eleSelector('.show-second')
    secondEle.innerHTML = '00'
}

/**
 * count created mine
 */
const countCreateMine = (square) => {
    let count = 0
    for (let i = 0; i < square.length; i++) {
        let row = square[i]

        for (let j = 0; j < row.length; j++) {
            let cell = row[j]
            if (cell === 9) {
                count++
            }
        }
    }

    let countEle = `<span class="mine-count" data-count="${ count }"
            data-limit="${ count }"
            >${ count }</span>`
    let container = eleSelector('.num-container')
    container.insertAdjacentHTML('beforeend', countEle)
}
