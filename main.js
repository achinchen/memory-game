class Cards {
  constructor() {
    this.colors = [ 'blue', 'green', 'pink', 'yellow' ]
    this.shapes = [ 'diamond', 'oval', 'rectangle', 'triangle' ]
  }
  get cardList() {
    return this.getCardList()
  }
  getCardList() {
    let list = []
    this.colors.forEach(color => {
      this.shapes.forEach(shape => {
        list.push({ cardImage: `${shape}-${color}.svg`, color, shape })
      })
    })
    return list
  }
}

class Game {
  constructor() {
    this.cards = new Cards()
    this.shapeList = []
    this.colorList = []
    this.level = 0
  }
  get isBonus() {
    return !(this.level < 3)
  }
  get tradeOff() {
    return this.level > 4 ? 'all' : this.level % 2 == 0 ? 'color' : 'shape'
  }
  get countOfCards() {
    return this.isBonus ? 16 : 8
  }

  startGame() {
    if (this.level < 6) {
      this.level += 1
    } else {
      this.finishGame()
    }
  }
  getRule() {}
  finishGame() {
    console.log('finish Game!')
  }
  getSufferArray(count) {
    let tempArray = [...Array(4).keys()]
    return tempArray.sort(() => 0.5 - Math.random()).slice(0, count)
  }
  getLevels() {
    return this.getRandomNumber(4)
  }
}

let game = new Game()