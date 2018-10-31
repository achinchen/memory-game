new Vue({
  el: '#app',
  data() {
    return {
      timer: 500,
      level: 0,
      score: 0,
      flopTimes: 0,
      isPlayingMode: false,
      cardSetting: {
        colors: [ 'blue', 'green', 'pink', 'yellow' ],
        shapes: [ 'diamond', 'oval', 'rectangle', 'triangle' ]
      },
      levelSetting: [
        { shape: 2, color: 1, quantity: 12 },
        { shape: 1, color: 2, quantity: 12 },
        { shape: 2, color: 1, quantity: 12 },
        { shape: 1, color: 2, quantity: 12 },
        { shape: 3, color: 2, quantity: 12 },
        { shape: 2, color: 3, quantity: 12 },
        { shape: 3, color: 2, quantity: 12 },
        { shape: 2, color: 3, quantity: 12 },
        { shape: 4, color: 4, quantity: 12 },
        { shape: 4, color: 4, quantity: 12 }
      ],
      currentSelectedCards: [],
      answerCardList: [...Array(12)].fill(
        { url: '', shape: '', card: '',  isSelected: false, isFoundPairs: false, isEnabled: false })
    }
  },
  computed: {
    currentLevelSetting() {
      return this.levelSetting[parseInt(this.level)]
    },
    foundPairsQuantity() {
      return this.answerCardList.filter(({isFoundPairs}) => isFoundPairs).length
    },
    isFinishCurrentLevel() {
      return this.foundPairsQuantity == this.answerCardList.length
    },
    displayScore() {
      return this.score.toString().padStart(3, 0)
    }
  },
  methods: {
    startGame() {
      if(this.level == 10 ) {
        this.level = 0
        console.log(`finish game, your score is ${this.score}`)
      } else if(!this.isPlayingMode) {
        this.playGame()
      }
    },
    playGame() {
      this.level += 1
      this.setAnswerOfLevel()
      setTimeout(() => {
        this.answerCardList.forEach(card => card.isSelected = true)
        setTimeout(() => this.answerCardList.forEach(card => card.isSelected = false), this.timer * 4)
        setTimeout(() => this.isPlayingMode = true, this.timer - 200)
      }, 0)
    },
    resetCurrentGame() {
      this.level = 0
      this.flop = 0
      this.score = 0
      this.isPlayingMode = false
      this.playGame()
    },
    stopGame() {
      this.isPlayingMode = false
    },
    pickCardUp(index) {
      if(this.isPlayingMode) {
        this.preventMultiplyClick(index)
        let currentCard = this.answerCardList[index]
        const { isEnabled, isSelected, isFoundPairs } = currentCard
        if (isEnabled && !( isSelected || isFoundPairs)) {
          this.flopTimes += 1
          currentCard.isSelected = true
          this.currentSelectedCards.push({...currentCard, index})
          console.log(`--------pickCardUp--------`)
          console.log(this.currentSelectedCards)
          console.log(`--------------------------------`)
          this.checkFoundPairs()
        }
      }
    },
    preventMultiplyClick(index) {
      const currentCard = this.answerCardList[index]
      if (!currentCard.isFoundPairs) {
        currentCard.isEnabled = true
        setTimeout(() => currentCard.isEnabled = false, this.timer)
      }
    },
    checkFoundPairs() {
      const length = this.currentSelectedCards.length
      if (length > 1) {
        if (length > 2) {
          this.resetCurrentSelectedCards()
          this.currentSelectedCards = []
          console.log(`--------checkFoundPair--------`)
          console.log(this.currentSelectedCards)
          console.log(`--------------------------------`)
        } else {
          this.scoreCalculator()
          setTimeout(() => this.currentSelectedCards = [], this.timer)
        }
      }
    },
    scoreCalculator() {
      console.log('hello from scoreCalculator')
      let flagOfFoundPairs = false
      const firstCard = this.currentSelectedCards[0]
      const secondCard = this.currentSelectedCards[1]
      flagOfFoundPairs = firstCard.color == secondCard.color && firstCard.shape == secondCard.shape
      if (flagOfFoundPairs) this.score += 2
      this.resultOfDataSetter(flagOfFoundPairs)
    },
    resultOfDataSetter(flagOfFoundPairs) {
      console.log('hello from resultOfDataSetter')
      const changedKey = flagOfFoundPairs ? 'isFoundPairs' : 'isSelected'
      this.currentSelectedCards.forEach(({index}) => {
        setTimeout(() => this.answerCardList[index][changedKey] = flagOfFoundPairs,
          flagOfFoundPairs ? 0 : this.timer - 200)
      })
      setTimeout(() => { if(this.isFinishCurrentLevel) this.levelCalculator() }, this.timer)
    },
    resetCurrentSelectedCards() {
      this.answerCardList.forEach((card) => { if (!card.isFoundPairs) card.isSelected = false })
    },
    levelCalculator() {
      this.isPlayingMode = false
      setTimeout(() => this.bonusCalculator(), this.timer * 2)
      setTimeout(() => this.startGame(), this.timer * 5)
    },
    bonusCalculator() {
      const length = this.answerCardList.length
      this.score += this.flopTimes == length ? 5 : this.flopTimes < length * 1.5 ? 3 : 1
      this.flopTimes = 0
    },
    setAnswerOfLevel() {
      const cardGroup = this.setCardGroup(this.currentLevelSetting)
      const answerCardGroup = this.setAnswerCardGroup(cardGroup, this.currentLevelSetting)
      this.answerCardList = this.setAnswerCardList(answerCardGroup, this.currentLevelSetting)
    },
    setCardGroup({ color, shape }) {
      const colorList = this.getMaterialList(this.cardSetting.colors, color)
      const shapeList = this.getMaterialList(this.cardSetting.shapes, shape)
      let tempCardGroup = []
      colorList.forEach(colorItem =>
        shapeList.forEach(shapeItem =>
          tempCardGroup.push({
            url: `${shapeItem}-${colorItem}.svg`,
            shape: shapeItem,
            color: colorItem,
            isSelected: false,
            isFoundPairs: false,
            isEnabled: false
          })
        )
      )
      return tempCardGroup
    },
    setAnswerCardGroup(cardGroup, { quantity }) {
      const sequence = this.getShuffleArray(cardGroup.length, quantity / 2)
      return sequence.map(order => cardGroup[order])
    },
    setAnswerCardList(answerCardGroup, { quantity }) {
      const tempAnswerCardGroup = this.getFilledArray(quantity, answerCardGroup)
      const sequence = this.getShuffleArray(quantity, quantity)
      return sequence.map(order => ({...tempAnswerCardGroup[order]}))
    },
    getFilledArray(totalNumber, FilledArray) {
      return [...Array(totalNumber)].map(
        (item, index) => FilledArray[index % FilledArray.length])
    },
    getMaterialList(data, count) {
      let sequenceArray = this.getShuffleArray(4, count)
      return sequenceArray.map(order => data[order])
    },
    getShuffleArray(totalNumber, count) {
      return [...Array(totalNumber).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
    }
  }
})