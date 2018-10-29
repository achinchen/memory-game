new Vue({
  el: '#app',
  data() {
    return {
      level: 0,
      score: 0,
      flopTimes: 0,
      isPlayingMode: false,
      cardSetting: {
        colors: [ 'blue', 'green', 'pink', 'yellow' ],
        shapes: [ 'diamond', 'oval', 'rectangle', 'triangle' ]
      },
      currentSelectedCards: [],
      levelSetting: [
        { shape: 2, color: 1, quantity: 8, tradeOff: [], bonus: null },
        { shape: 1, color: 2, quantity: 8, tradeOff: [], bonus: null },
        { shape: 3, color: 2, quantity: 12, tradeOff: ['shape'], bonus: 3 },
        { shape: 2, color: 3, quantity: 12, tradeOff: ['color'], bonus: 3 },
        { shape: 4, color: 4, quantity: 12, tradeOff: ['shape', 'color'], bonus: 5},
        { shape: 4, color: 4, quantity: 12, tradeOff: ['shape', 'color'], bonus: 5}
      ],
      answerCardList: [...Array(8)].fill(
        { url: '', shape: '', card: '',  isSelected: false, isFoundPairs: false })
    }
  },
  mounted() {
    // this.detectUserStatus()
  },
  computed: {
    currentLevelSetting() {
      return this.levelSetting[parseInt(this.level)]
    },
  },
  methods: {
    startGame() {
      if(this.level == 6 ) {
        this.level = 0
        console.log(`finish game, your score is ${this.score}`)
      } else {
        this.level += 1
        this.setAnswerOfLevel()
        setTimeout(() => {
          this.answerCardList.forEach(card => card.isSelected = true)
          setTimeout(() => this.answerCardList.forEach(card => card.isSelected = false), 1500)
          setTimeout(() => this.isPlayingMode = true, 300)
        },0)
      }
    },
    stopGame() {
      this.isPlayingMode = false
    },
    checkFoundPairs() {
      if (this.currentSelectedCards.length > 1) {
        this.scoreCalculator()
        if (this.currentSelectedCards.length == 3) this.currentSelectedCards.length = 0
      } 
    },
    scoreCalculator() {
      this.basicScoreCalculator()
      console.log(this.answerCardList.filter(({isFoundPairs}) => isFoundPairs).length)
      if (this.answerCardList.filter(
        ({isFoundPairs}) => isFoundPairs).length == this.answerCardList.length) {
          this.flopsBonusCalculator()
          this.isPlayingMode = false
          this.popupDialog = true
          setTimeout(() => this.startGame(), 3000)
        }
    },
    basicScoreCalculator() {
      let firstCard = this.currentSelectedCards[0]
      let secondCard = this.currentSelectedCards[1]
      let flagOfFoundPairs = false
      const { tradeOff, bonus } = this.currentLevelSetting
      const comparisonKeys = Object.keys(this.cardSetting).map(key => key.substring(0,key.length -1))
      if (firstCard.color == secondCard.color && firstCard.shape == secondCard.shape) {
        this.score += (bonus + 1)
        flagOfFoundPairs = true
      } else {
        const tradeOffKey = tradeOff.toString()
        const basicKey = comparisonKeys.filter(key => key != tradeOffKey)
        if (tradeOff.length == 1 && firstCard[basicKey] == secondCard[basicKey]) {
          this.score += (bonus + 1)
          flagOfFoundPairs = true
        }
      }
      this.resultOfDataSetter(flagOfFoundPairs)
    },
    resultOfDataSetter(flagOfFoundPairs) {
      const changedKey = flagOfFoundPairs? 'isFoundPairs' : 'isSelected'
      // this.currentSelectedCards.forEach((card) => {
      //   card[changedKey] = flagOfFoundPairs
      // })
    },
    flopsBonusCalculator() {
      const length = this.answerCardList.length
      this.score += this.flopTimes == length ? 5 : this.flopTimes < length * 1.5 ? 3 : 1
    },
    pickCardUp(index) {
      if(this.isPlayingMode) {
        let currentCard = this.answerCardList[index]
        currentCard.isSelected = true
        this.flopTimes += 1
        this.currentSelectedCards.push(currentCard)
        this.checkFoundPairs()
        // if(this.isFinishedCurrentLevel) this.switchPlayingMode()
      }
    },
    switchPlayingMode() {
      this.stopGame()
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
            isFoundPairs: false
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