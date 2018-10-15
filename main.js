class Cards {
  constructor() {
    this.colors = [ 'blue', 'green', 'pink', 'yellow' ]
    this.shapes = [ 'diamond', 'oval', 'rectangle', 'triangle' ]
  }
}

class Game {
  constructor() {
    this.cards = new Cards()
    this.level = 0
    this.cardsList = []
    this.levelSetting = [
      { shape: 2, color: 1, countOfCards: 8, bonus: false, tradeOff: null },
      { shape: 1, color: 2, countOfCards: 8, bonus: false, tradeOff: null },
      { shape: 3, color: 2, countOfCards: 16, bonus: true, tradeOff: 'shape' },
      { shape: 2, color: 3, countOfCards: 16, bonus: true, tradeOff: 'color' },
      { shape: 4, color: 4, countOfCards: 16, bonus: true, tradeOff: 'all' },
      { shape: 4, color: 4, countOfCards: 16, bonus: true, tradeOff: 'all' }
    ]
  }
  get isBonus() {
    return !(this.level < 3)
  }
  startGame() {
    if (this.level < 6) {
      this.settingLevelAnswer()
      this.level += 1
      if (this.level > 2) this.displayLastFourCards()
    } else {
      this.finishGame()
    }
  }
  settingLevelAnswer() {
    const levelOfData = this.levelSetting[this.level]
    let colorList = this.getRandomList(this.cards.colors, levelOfData.color)
    let shapeList = this.getRandomList(this.cards.shapes, levelOfData.shape)
    colorList.forEach(color =>
      shapeList.forEach(shape => this.cardsList.push(`${shape}-${color}.svg`))
    )
    if (this.level > 3) {
      let num = this.getRandomNumber()
      this.cardsList = this.cardsList.slice(num, num + 6)
    }
  }
  initialCardsList(data, answerOfCard) {
    return this.getShuffleArray(data.countOfCards, data.countOfCards).map(card => {
      return card % answerOfCard.length == 0 ? answerOfCard[0] : answerOfCard[1]
    })
  }
  settingCardsAnswer(answerList) {
    console.log(answerList)
  }
  displayLastFourCards() {
    let lastFourCards = document.querySelectorAll('.disappear')
    lastFourCards.forEach(card => card.classList.remove('disappear'))
  }
  finishGame() {
    console.log('finish Game!')
  }
  getRandomNumber() {
    return Math.floor(Math.random() * 10) % 4
  }
  getRandomList(data, count) {
    let tempRandomArray = this.getShuffleArray(4, count)
    return data.filter(
      (dataItem, index) => tempRandomArray.indexOf(index) != -1
    )
  }
  getShuffleArray(totalNumber, count) {
    return [...Array(totalNumber).keys()]
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
  }
}

let game = new Game()