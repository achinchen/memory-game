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
        { shape: 2, color: 1, quantity: 8, tradeOff: null },
        { shape: 1, color: 2, quantity: 8, tradeOff: null },
        { shape: 3, color: 2, quantity: 12, tradeOff: 'shape' },
        { shape: 2, color: 3, quantity: 12, tradeOff: 'color' },
        { shape: 4, color: 4, quantity: 12, tradeOff: 'all' },
        { shape: 4, color: 4, quantity: 12, tradeOff: 'all' }
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
        this.currentSelectedCard.forEac((previousCard, currentCard) => {
          // if(previousCard.isFoundPairs){
          //   currentCard.isSelected = false
          // } else {
          //   this.currentLevelSetting.tradeOff ? 
          // }
          console.log(previousCard,currentCard)
        })
      }
      // if (this.currentSelectedCards.length > 1) {
      //   this.currentSelectedCard
      // }
      console.log(this.currentSelectedCards)
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