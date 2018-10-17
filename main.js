// (() => {
class Cards {
  constructor() {
    this.colors = ['blue', 'green', 'pink', 'yellow']
    this.shapes = ['diamond', 'oval', 'rectangle', 'triangle']
  }
}

class Game {
  constructor() {
    this.cards = new Cards()
    this.level = 0
    this.answerCardList = []
    this.levelSetting = [
      { shape: 2, color: 1, pairs: 4, bonus: false, tradeOff: null },
      { shape: 1, color: 2, pairs: 4, bonus: false, tradeOff: null },
      { shape: 3, color: 2, pairs: 6, bonus: true, tradeOff: 'shape' },
      { shape: 2, color: 3, pairs: 6, bonus: true, tradeOff: 'color' },
      { shape: 4, color: 4, pairs: 6, bonus: true, tradeOff: 'all' },
      { shape: 4, color: 4, pairs: 6, bonus: true, tradeOff: 'all' }
    ]
  }
  get DOMListOfCard() {
    return document.querySelectorAll('.card-item')
  }
  get isBonus() {
    return !(this.level < 3)
  }
  setActivatedButton() {
    const button = document.querySelector('.activated-btn')
    button.addEventListener('click', () => {
      this.startGame()
      button.innerText = 'stop'
    })
  }
  setCardsEventListener() {
    this.DOMListOfCard.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('selected')
      })
    })
  }
  startGame() {
    if (this.level < 6) {
      this.setLevelOfAnswer()
      this.setCardsEventListener()
      this.level += 1
      if (this.level == 2) this.toggleClassOfLastFourCards()
    } else {
      this.finishGame()
    }
  }
  finishGame() {
    console.log('finish Game!')
  }
  toggleClassOfLastFourCards() {
    let lastFourCards = document.querySelectorAll('.switch')
    lastFourCards.forEach(card => card.classList.toggle('disappear'))
  }
  setLevelOfAnswer() {
    const settingData = this.levelSetting[this.level]
    const cardGroup = this.setCardGroup(settingData)
    const answerCardGroup = this.setAnswerCardGroup(cardGroup, settingData)
    this.answerCardList = this.setAnswerCardList(answerCardGroup, settingData)
    this.setAnswerCardListWhichBehindTheCards()
  }
  setAnswerCardListWhichBehindTheCards() {
    this.DOMListOfCard.forEach((card, index)=> {
      if (card.classList.value.indexOf('disappear') == -1) {
        const backgroundImage = this.answerCardList[index]
        card.children[1].style.backgroundImage = `url(/img/cards-back/${backgroundImage})`
        const borderColor = backgroundImage.slice(
          backgroundImage.indexOf('-') + 1, backgroundImage.indexOf('.svg'))
        card.children[1].classList.add(`border-color-${borderColor}`)
      }
    })
  }
  setCardGroup({ color, shape }) {
    const colorList = this.getMaterialList(this.cards.colors, color)
    const shapeList = this.getMaterialList(this.cards.shapes, shape)
    let tempCardGroup = []
    colorList.forEach(colorItem =>
      shapeList.forEach(shapeItem =>
        tempCardGroup.push(`${shapeItem}-${colorItem}.svg`)
      )
    )
    return tempCardGroup
  }
  setAnswerCardGroup(cardGroup, { pairs }) {
    const sequence = this.getShuffleArray(cardGroup.length, pairs)
    return sequence.map(order => cardGroup[order])
  }
  setAnswerCardList(answerCardGroup, { pairs }) {
    const lengthOfCardList = pairs * 2
    const tempAnswerCardGroup = this.getFilledArray(lengthOfCardList, answerCardGroup)
    const sequence = this.getShuffleArray(lengthOfCardList, lengthOfCardList)
    return sequence.map(order=> tempAnswerCardGroup[order])
  }
  getFilledArray(totalNumber, FilledArray) {
    return [...Array(totalNumber)].map((item, index) => FilledArray[index % FilledArray.length])
  }
  getRandomNumber() {
    return Math.floor(Math.random() * 10) % 4
  }
  getMaterialList(data, count) {
    let sequenceArray = this.getShuffleArray(4, count)
    return sequenceArray.map(order => data[order])
  }
  getShuffleArray(totalNumber, count) {
    return [...Array(totalNumber).keys()]
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
  }
}

let game = new Game()
game.setActivatedButton()
// })()